import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    useTheme,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    TextField,
    InputAdornment
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseList from "../components/expenses/ExpenseList";
import SearchIcon from "@mui/icons-material/Search";
import DeleteNotification from "../components/DeleteNotification";
import { getExpenses, deleteExpense, getTotalExpenseByCurrentMonth, searchExpenses } from "../services/expenseService";

const initialExpenses = [
    { id: 1, title: "Groceries", category: "Food", amount: 1200, date: "2025-01-10" },
    { id: 2, title: "Electricity Bill", category: "Bills", amount: 1800, date: "2025-01-12" },
    { id: 3, title: "Face Care", category: "Shopping", amount: 1800, date: "2025-01-12" },
    { id: 4, title: "Mobile Recharge", category: "Bills", amount: 1800, date: "2025-01-12" },
    { id: 5, title: "Vegitables", category: "Food", amount: 1800, date: "2025-01-12" },
    { id: 6, title: "Dresses", category: "Shopping", amount: 1800, date: "2025-01-12" },
    { id: 7, title: "Wifi Bill", category: "Bills", amount: 1800, date: "2025-01-12" },
    { id: 8, title: "Chicken", category: "Food", amount: 1800, date: "2025-01-12" },
];

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const monthMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
};



function ExpensePage() {
    const theme = useTheme();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [searchText, setSearchText] = useState("");

    const [expenses, setExpenses] = useState([]);
    const [curMonth, setCurMonth] = useState();
    const [curYear, setCurYear] = useState();
    const [totalExpenseByMonth, setTotalExpenseByMonth] = useState(0);
    const [openForm, setOpenForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const startYear = 2020;

    const years = Array.from(
        { length: currentYear - startYear + 1 },
        (_, index) => currentYear - index
    );

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };



    const fetchExpenses = async () => {
        try {
            const response = await getExpenses();
            setExpenses(response.data);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
        }
    };

    const fetchTotalExpenseByCurrentMonth = async (year, month) => {
        try {
            const response = await getTotalExpenseByCurrentMonth();
            setTotalExpenseByMonth(response.data.totalExpense || 0);
            setCurMonth(response.data.month);
            setCurYear(response.data.year);
        } catch (error) {
            console.error("Failed to fetch total expense by month", error);
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchTotalExpenseByCurrentMonth();
    }, []);

    useEffect(() => {
        const hasActiveFilters =
            selectedYear !== "" ||
            selectedMonth !== "" ||
            searchText.trim() !== "";

        if (hasActiveFilters) {
            fetchSearchExpense();
        } else {
            fetchExpenses();
        }
    }, [selectedYear, selectedMonth, searchText]);




    const fetchSearchExpense = async () => {
        try {
            const filters = {};

            if (selectedYear) {
                filters.year = selectedYear;
            }

            if (selectedMonth) {
                filters.month = monthMap[selectedMonth];
            }

            if (searchText.trim()) {
                filters.searchText = searchText.trim();
            }

            const response = await searchExpenses(filters);
            setExpenses(response.data);
        } catch (error) {
            console.error("Failed to search expenses", error);
        }
    };




    console.log("Filters applied:", expenses)


    // const filteredExpenses = useMemo(() => {
    //     return expenses.filter((e) => {
    //         const date = new Date(e.date);
    //         const yearMatch = date.getFullYear() === selectedYear;
    //         const monthMatch =
    //             selectedMonth === "All" ||
    //             date.toLocaleString("default", { month: "long" }) === selectedMonth;

    //         return yearMatch && monthMatch;
    //     });
    // }, [expenses, selectedYear, selectedMonth]);

    // const totalExpense = useMemo(() => {
    //     return filteredExpenses.reduce(
    //         (sum, e) => sum + Number(e.amount || 0),
    //         0
    //     );
    // }, [filteredExpenses]);


    const handleAddClick = () => {
        setEditingExpense(null);
        setOpenForm(true);
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setOpenForm(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);                 // store id
        setOpenDeleteDialog(true);       // open popup
    };

    const confirmDelete = async () => {
        try {
            await deleteExpense(deleteId);
            await fetchExpenses();
        } catch (error) {
            console.error("Failed to delete expense", error);
        } finally {
            setOpenDeleteDialog(false);
            setDeleteId(null);
        }
    };

    const cancelDelete = () => {
        setOpenDeleteDialog(false);
        setDeleteId(null);
    };

    return (
        <Box
            sx={{
                minHeight: "92vh",
                p: 3,
                background: theme.palette.background.default,
            }}
        >
            {/* Page Heading */}
            <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mb: 2 }}
                color="text.primary"
            >
                Expenses
            </Typography>

            {/* Parent Card */}
            <Card
                sx={{
                    maxWidth: "100%",
                    minHeight: "80vh",
                    margin: "0 auto",
                    backgroundColor: theme.palette.background.paper,
                    p: 5,
                }}
            >
                <CardContent>
                    {/* TOP ROW */}
                    <Grid
                        container
                        spacing={3}
                        alignItems="flex-start"
                        justifyContent="space-between"
                    >
                        {/* LEFT: Total Expense Card */}
                        <Grid item xs={12} md="auto">
                            <Card
                                sx={{
                                    width: 280,
                                    backgroundColor: theme.palette.background.primary,
                                    borderRadius: 2,
                                }}
                            >
                                <CardContent>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Total Expenses of {months[curMonth - 1]} {curYear}
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        color="primary.main"
                                        sx={{ mt: 1 }}
                                    >
                                        ₹{totalExpenseByMonth ? totalExpenseByMonth : 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* RIGHT: Filters */}
                        <Grid item xs={12} md="auto">
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 5,
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                }}
                            >
                                {/* Year */}
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>Year</InputLabel>
                                    <Select
                                        label="Year"
                                        value={selectedYear}
                                        onChange={handleYearChange}


                                    >

                                        {years.map((year) => (
                                            <MenuItem key={year} value={year}>
                                                {year}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>


                                {/* Month */}
                                <FormControl size="small" sx={{ minWidth: 140 }}>
                                    <InputLabel>Month</InputLabel>
                                    <Select
                                        label="Month"
                                        value={selectedMonth}
                                        onChange={handleMonthChange}
                                    >
                                        <MenuItem value="All">All</MenuItem>
                                        {months.map((month) => (
                                            <MenuItem key={month} value={month}>
                                                {month}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Search */}
                                <TextField
                                    size="small"
                                    placeholder="Search title or category"
                                    value={searchText}
                                    onChange={handleSearchChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",

                        }}
                    >
                        <Button
                            variant="outlined"           // 👈 outlined gives a border
                            color="primary"
                            onClick={handleAddClick}
                            startIcon={<AddIcon />}
                            sx={{
                                borderRadius: 3,           // 👈 curve the corners
                                borderWidth: 2,            // optional: thicker border
                                textTransform: "none",     // optional: keep text normal
                            }}
                        >
                            Add Expense
                        </Button>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <ExpenseList
                            expenses={expenses}
                            onEdit={(expense) => {
                                setEditingExpense(expense);
                                setOpenForm(true);
                            }}
                            onDelete={handleDeleteClick}
                        />

                        <ExpenseForm
                            open={openForm}
                            onClose={() => setOpenForm(false)}
                            expenseId={editingExpense?.id}
                            onSuccess={fetchExpenses}
                        />
                    </Box>

                </CardContent>



            </Card>

            <DeleteNotification
                open={openDeleteDialog}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                name={"expenses"}
            />
        </Box>

        // <Box
        //     sx={{
        //         minHeight: "100vh",
        //         p: 3,
        //         background: theme.palette.background.default,
        //     }}
        // >
        //     {/* Header */}
        //     <Box
        //         sx={{
        //             display: "flex",
        //             justifyContent: "space-between",
        //             alignItems: "stretch",
        //             mb: 3,
        //             gap: 2,
        //         }}
        //     >
        //         {/* LEFT: FILTER CARD */}
        //         <Card sx={{ flex: 1, borderRadius: 3 }}>
        //             <CardContent>
        //                 <Grid container spacing={3} alignItems="center">
        //                     {/* Total */}
        //                     <Grid item xs={12} md={4}>
        //                         <Typography variant="subtitle2" color="text.secondary">
        //                             Total Expenses
        //                         </Typography>
        //                         <Typography variant="h5" fontWeight={700} color="primary.main">
        //                             ₹ {totalExpense}
        //                         </Typography>
        //                     </Grid>

        //                     {/* Year */}
        //                     <Grid item xs={6} md={4}>
        //                         <FormControl fullWidth>
        //                             <InputLabel>Year</InputLabel>
        //                             <Select
        //                                 label="Year"
        //                                 value={selectedYear}
        //                                 onChange={(e) => setSelectedYear(e.target.value)}
        //                             >
        //                                 {[2025, 2024, 2023].map((year) => (
        //                                     <MenuItem key={year} value={year}>
        //                                         {year}
        //                                     </MenuItem>
        //                                 ))}
        //                             </Select>
        //                         </FormControl>
        //                     </Grid>

        //                     {/* Month */}
        //                     <Grid item xs={6} md={4}>
        //                         <FormControl fullWidth>
        //                             <InputLabel>Month</InputLabel>
        //                             <Select
        //                                 label="Month"
        //                                 value={selectedMonth}
        //                                 onChange={(e) => setSelectedMonth(e.target.value)}
        //                             >
        //                                 <MenuItem value="All">All</MenuItem>
        //                                 {months.map((month) => (
        //                                     <MenuItem key={month} value={month}>
        //                                         {month}
        //                                     </MenuItem>
        //                                 ))}
        //                             </Select>
        //                         </FormControl>
        //                     </Grid>
        //                 </Grid>
        //             </CardContent>
        //         </Card>

        //         {/* RIGHT: ADD BUTTON */}
        //         <Box sx={{ display: "flex", alignItems: "center" }}>
        //             <Button
        //                 variant="contained"
        //                 startIcon={<AddIcon />}
        //                 onClick={handleAddClick}
        //                 sx={{ height: "56px" }}
        //             >
        //                 Add Expense
        //             </Button>
        //         </Box>
        //     </Box>


        //     {/* List */}
        //     <ExpenseList
        //         expenses={expenses}
        //         onEdit={handleEdit}
        //         onDelete={handleDelete}
        //     />

        //     {/* Form Modal */}
        //     <ExpenseForm
        //         open={openForm}
        //         onClose={() => setOpenForm(false)}
        //         onSave={handleSaveExpense}
        //         expense={editingExpense}
        //     />
        // </Box>
    );
}

export default ExpensePage;
