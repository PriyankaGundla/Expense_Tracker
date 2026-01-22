import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Avatar,
    Typography,
    TablePagination,
    useTheme
} from "@mui/material";
import { deleteCategory } from "../../services/categoryService";
import CategoryForm from "./CategoryForm";
import AddIcon from "@mui/icons-material/Add";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FlightIcon from "@mui/icons-material/Flight";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MovieIcon from "@mui/icons-material/Movie";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SchoolIcon from "@mui/icons-material/School";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PetsIcon from "@mui/icons-material/Pets";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteNotification from "../DeleteNotification";

function CategoryList({ categoriesList = [], getAPI }) {
    const theme = useTheme();
    const [openForm, setOpenForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(9);


    const categoryIcons = {
        Food: <RestaurantIcon />,
        Bills: <ReceiptIcon />,
        Travel: <FlightIcon />,
        Shopping: <ShoppingCartIcon />,
        Entertainment: <MovieIcon />,
        Health: <LocalHospitalIcon />,
        Education: <SchoolIcon />,
        Fitness: <FitnessCenterIcon />,
        Pets: <PetsIcon />,
        Transport: <DirectionsCarIcon />,
        Mobile: <PhoneAndroidIcon />,
        Subscriptions: <SubscriptionsIcon />,
    };

    const totalItems = categoriesList.length;
    const paginatedCategories = categoriesList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleDelete = (id) => {
        setDeleteCategoryId(id);
        setOpenConfirmDelete(true);       
    };

    const confirmDelete = async () => {
        try {
            await deleteCategory(deleteCategoryId);
            await getAPI();
        } catch (error) {
            console.error("Failed to delete expense", error);
        } finally {
            setOpenConfirmDelete(false);
            setDeleteCategoryId(null);
        }
    };

    const cancelDelete = () => {
        setOpenConfirmDelete(false);
        setDeleteCategoryId(null);
    };

    return (
        <>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 5,
                    px: 3,
                }}
            >
                <Box
                    onClick={() => {
                        setSelectedCategory(null);
                        setOpenForm(true);
                    }}
                    sx={{
                        p: 3,
                        height: "100%",
                        borderRadius: "20px",
                        textAlign: "center",
                        border: "2px dashed",
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "0.3s",
                        "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                        },
                    }}
                >
                    <Avatar
                        sx={{
                            mb: 2,
                            width: 56,
                            height: 56,
                            bgcolor: "transparent",
                            border: "2px dashed",
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                        }}
                    >
                        <AddIcon />
                    </Avatar>

                    <Typography fontWeight={700}>Add Category</Typography>
                    <Typography variant="body2">
                        Create a new category
                    </Typography>
                </Box>

                {paginatedCategories.map((cat, index) => (
                    <Card
                        key={index}
                        sx={{
                            borderRadius: 3,
                            boxShadow: 5,
                            transition: "0.3s",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            setSelectedCategory(cat);
                            setOpenForm(true);
                        }}
                    >
                        <CardContent>
                            <Box
                                sx={{
                                    position: "relative",
                                    p: 3,
                                    height: "100%",
                                    borderRadius: "20px",
                                    textAlign: "center",
                                    background: "#fff",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",

                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: "20px",
                                        padding: "2px",
                                        background:
                                            "linear-gradient(135deg, #81c784, #66bb6a)",
                                        WebkitMask:
                                            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                        WebkitMaskComposite: "xor",
                                        maskComposite: "exclude",
                                    },
                                }}
                            >
                                <DeleteOutlineIcon
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        color: "error.main",
                                        cursor: "pointer",
                                        zIndex: 10,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(cat.id);
                                    }}
                                />

                                <Avatar
                                    sx={{
                                        mb: 2,
                                        width: 56,
                                        height: 56,
                                        bgcolor: "#e8f5e9",
                                        color: "#2e7d32",
                                    }}
                                >
                                    {categoryIcons[cat.icon]}
                                </Avatar>

                                <Typography fontWeight={700} variant="h6">
                                    {cat.name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Manage {cat.name.toLowerCase()} expenses
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {totalItems > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 5,
                        px: 3,
                        pl: 135,
                    }}
                >
                    <TablePagination
                        component="div"
                        count={totalItems}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0); 
                        }}
                        rowsPerPageOptions={[9, 14, 24]}
                    />
                </Box>
            )}

            <CategoryForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                category={selectedCategory}
                categoryId={selectedCategory?.id}   
                onSuccess={getAPI}
                usedIcons={categoriesList.map((c) => c.icon)}
            />



            <DeleteNotification
                open={openConfirmDelete}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                name={"category"}
            />
        </>
    );
}

export default CategoryList;
