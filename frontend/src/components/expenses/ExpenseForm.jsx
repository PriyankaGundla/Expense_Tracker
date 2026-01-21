import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  useTheme,
  InputAdornment,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TitleIcon from '@mui/icons-material/Title';
import { createExpense, getExpenseById, updateExpense } from "../../services/expenseService";

const categories = ["Food", "Bills", "Travel", "Shopping", "Other"];

function ExpenseForm({ open, onClose, expense, onSuccess, expenseId }) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      amount: "",
      date: "",
    });

    setErrors({
      title: "",
      category: "",
      amount: "",
      date: "",
    });
  };


  const validate = () => {
    let valid = true;
    const newErrors = {
      title: "",
      category: "",
      amount: "",
      date: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      valid = false;
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
      valid = false;
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
      valid = false;
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
      valid = false;
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };



  useEffect(() => {
    if (!expenseId || !open) {
      resetForm();
      return;
    }

    const fetchExpense = async () => {
      try {
        const response = await getExpenseById(expenseId);

        const convertToInputDate = (date) => {
          const [day, month, year] = date.split("-");
          return `${year}-${month}-${day}`;
        };


        setFormData({
          title: response.data.title || "",
          category: response.data.category || "",
          amount: response.data.amount || "",
          date: convertToInputDate(response.data.date),
        });
      } catch (error) {
        console.error("Failed to fetch expense", error);
      }
    };

    fetchExpense();
  }, [expenseId, open]);



  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };




  const onSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formatDate = (date) => {

        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
      };
      const expenseData = {
        title: formData.title,
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formatDate(formData.date),
      }


      if (expenseId) {
        // UPDATE
        await updateExpense(expenseId, expenseData);
      } else {
        // CREATE
        await createExpense(expenseData);
      } 
      onSuccess(); // triggers GET API in parent
      resetForm();

      onClose();
    } catch (error) {
      console.error("Failed to create expense", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle
        color="text.color"
        sx={{ display: "flex", alignItems: "center", gap: 1, pt: 3 }}
      >
        {expense ? <EditIcon fontSize="small" /> : <AddIcon fontSize="small" />}
        {expense ? "Edit Expense" : "Add Expense"}
      </DialogTitle>

      <Divider />

      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          variant="outlined"
          helperText={errors.title}
          FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TitleIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: "15px" },
          }}
        />

        <TextField
          select
          fullWidth
          margin="normal"
          label="Category"
          name="category"
          variant="outlined"
          value={formData.category}
          onChange={handleChange}
          helperText={errors.category}
          FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CategoryIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: "15px" },
          }}
        >
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          label="Amount"
          type="number"
          name="amount"
          variant="outlined"
          value={formData.amount}
          onChange={handleChange}
          helperText={errors.amount}
          FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoneyIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: "15px" },
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Date"
          type="date"
          name="date"
          variant="outlined"
          value={formData.date}
          onChange={handleChange}
          helperText={errors.date}
          FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: "15px" },
          }}
        />
      </DialogContent>

      <Divider />


      <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
        <Button onClick={() => {
          resetForm();
          onClose();
        }}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: "15px",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
            },
          }}
          onClick={onSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExpenseForm;
