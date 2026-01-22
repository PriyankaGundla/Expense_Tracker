import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Paper
} from "@mui/material";
import { getCategories } from "../services/categoryService";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FlightIcon from "@mui/icons-material/Flight";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import MovieIcon from "@mui/icons-material/Movie";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SchoolIcon from "@mui/icons-material/School";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PetsIcon from "@mui/icons-material/Pets";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import CategoryList from "../components/category/CategoryList";

/* ----------------------------------
   ICON MAP
-----------------------------------*/
const ICON_MAP = {
  food: <RestaurantIcon />,
  bills: <ReceiptIcon />,
  travel: <FlightIcon />,
  shopping: <ShoppingCartIcon />,
  entertainment: <MovieIcon />,
  health: <LocalHospitalIcon />,
  education: <SchoolIcon />,
  fitness: <FitnessCenterIcon />,
  pets: <PetsIcon />,
  transport: <DirectionsCarIcon />,
  mobile: <PhoneAndroidIcon />,
  subscriptions: <SubscriptionsIcon />,
};

/* ----------------------------------
   INITIAL CATEGORIES
-----------------------------------*/
const INITIAL_CATEGORIES = [
  { name: "Food", iconKey: "food" },
  { name: "Bills", iconKey: "bills" },
  { name: "Travel", iconKey: "travel" },
  { name: "Shopping", iconKey: "shopping" },
];

function Category() {
  const theme = useTheme();

  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [iconKey, setIconKey] = useState("food");

  const usedIcons = categories.map((cat) => cat.iconKey);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ----------------------------------
     ADD CATEGORY HANDLER
  -----------------------------------*/
  const handleAddCategory = () => {
    if (!name.trim()) return;

    setCategories([
      ...categories,
      { name: name.trim(), iconKey },
    ]);

    setName("");
    setIconKey("food");
    setOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "92vh",
        p: 3,
        background: theme.palette.background.default,
      }}
    >
      {/* HEADER */}
      <Typography variant="h5" fontWeight={700} mb={3}>
        Categories
      </Typography>

      <Paper sx={{ p: 4, pt: 8, borderRadius: 2 }}>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <CategoryList
            categoriesList={categories}
            getAPI={fetchCategories}
          />

        </Box>
      </Paper >







    </Box>
  );
}

export default Category;
