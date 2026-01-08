import React, { useState, useMemo } from "react";
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


function ExpensePage() {
    const theme = useTheme();

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = React.useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState("All");


    const [expenses, setExpenses] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const startYear = 2020;

    const years = Array.from(
        { length: currentYear - startYear + 1 },
        (_, index) => currentYear - index
    );




    const filteredExpenses = useMemo(() => {
        return expenses.filter((e) => {
            const date = new Date(e.date);
            const yearMatch = date.getFullYear() === selectedYear;
            const monthMatch =
                selectedMonth === "All" ||
                date.toLocaleString("default", { month: "long" }) === selectedMonth;

            return yearMatch && monthMatch;
        });
    }, [expenses, selectedYear, selectedMonth]);

    const totalExpense = useMemo(() => {
        return filteredExpenses.reduce(
            (sum, e) => sum + Number(e.amount || 0),
            0
        );
    }, [filteredExpenses]);


    const handleAddClick = () => {
        setEditingExpense(null);
        setOpenForm(true);
    };

    const handleSaveExpense = (expense) => {
        if (expense.id) {
            // Edit
            setExpenses((prev) =>
                prev.map((e) => (e.id === expense.id ? expense : e))
            );
        } else {
            // Add
            setExpenses((prev) => [
                ...prev,
                { ...expense, id: Date.now() },
            ]);
        }
        setOpenForm(false);
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setOpenForm(true);
    };

    const handleDelete = (id) => {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
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
                                        Total Expenses of (Current Month)
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        color="primary.main"
                                        sx={{ mt: 1 }}
                                    >
                                        ₹25,000
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
                                        onChange={(e) => setSelectedYear(e.target.value)}
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
                                        onChange={(e) => setSelectedMonth(e.target.value)}
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
                                    placeholder="Search..."
                                    sx={{ minWidth: 200 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="action" />
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
                            expenses={initialExpenses}
                            onEdit={(expense) => {
                                setEditingExpense(expense);
                                setOpenForm(true);
                            }}
                            onDelete={(id) => {
                                setDeleteId(id);              // store id
                                setOpenDeleteDialog(true);    // open confirmation
                            }}
                        />

                        <ExpenseForm
                            open={openForm}
                            onClose={() => setOpenForm(false)}
                            onSave={handleSaveExpense}
                            expense={editingExpense}
                        />
                    </Box>

                </CardContent>



            </Card>

            <DeleteNotification
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={() => {
                    setExpenses((prev) =>
                        prev.filter((e) => e.id !== deleteId)
                    );
                    setOpenDeleteDialog(false);
                    setDeleteId(null);
                }}
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
