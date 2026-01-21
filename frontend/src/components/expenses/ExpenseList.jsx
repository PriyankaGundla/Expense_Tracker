import React, { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useTheme,
  TablePagination,
  Box,
  Button,
  Stack,
  Divider
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getExpenses } from "../../services/expenseService";

function ExpenseList({ expenses = [], onEdit, onDelete }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";


  // 🔹 Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  // 🔹 Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 🔹 Paginated data
  const paginatedExpenses = expenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: isLight
                  ? `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.main})`
                  : theme.palette.background.paper,
              }}
            >
              {["S.No", "Title", "Category", "Amount", "Date", "Actions"].map((head) => (
                <TableCell
                  key={head}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    color: isLight ? "#fff" : theme.palette.text.primary,
                  }}
                >
                  {head}
                </TableCell>

              ))}
            </TableRow>
          </TableHead>



          {/* 🔥 Body */}
          <TableBody>
            {paginatedExpenses.map((expense, index) => (
              <TableRow key={expense.id} hover>

                {/* 🔹 S.No */}
                <TableCell align="center" sx={{ fontSize: "1rem" }}>
                  {page * rowsPerPage + index + 1}
                </TableCell>

                <TableCell align="center" sx={{ fontSize: "1rem" }}>
                  {expense.title}
                </TableCell>

                <TableCell align="center" sx={{ fontSize: "1rem" }}>
                  {expense.category}
                </TableCell>

                <TableCell align="center">
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 2,
                      py: 0.5,
                      borderRadius: "10px",
                      backgroundColor: "#d1f9d5ff", // 🌱 light green
                      color: theme.palette.text.paper,
                      fontWeight: 700,
                      fontSize: "1rem",
                      textAlign: "flex-center",
                      minWidth: 90,
                    }}
                  >
                    ₹ {expense.amount}
                  </Box>
                </TableCell>


                <TableCell align="center" sx={{ fontSize: "1rem" }}>
                  {expense.date}
                </TableCell>

                <TableCell align="center" sx={{ gap: 5 }}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="outlined"
                      size="small"
                      color="edit"
                      startIcon={<EditIcon />}
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 600,
                        minWidth: 70,
                      }}
                      onClick={() => onEdit(expense)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 600,
                        minWidth: 70,
                      }}
                      onClick={() => onDelete(expense.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>


        </Table>


        {/* 🔹 Pagination */}
        <TablePagination
          component="div"
          count={expenses.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </>

  );
}

export default ExpenseList;
