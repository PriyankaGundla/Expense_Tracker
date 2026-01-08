import React from "react";
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

const categories = ["Food", "Bills", "Travel", "Shopping", "Other"];

function ExpenseForm({ open, onClose, onSave, expense }) {
  const theme = useTheme();

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
          variant="outlined"
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
          variant="outlined"
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
          variant="outlined"
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
          variant="outlined"
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
        <Button onClick={onClose}>Cancel</Button>
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
