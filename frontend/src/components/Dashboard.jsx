import React, { use, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import RechartsPie from "./dashboard/PieChart";
import MonthlyExpenseLine from "./dashboard/GraphChart";
import { getExpenses } from "../services/expenseService";
function Dashboard() {
  const theme = useTheme();
  const [recentExpenses, setRecentExpenses] = useState([]);

  const summaryData = [
    { title: "Total Income", value: "₹ 1,20,000", color: "#def5e0ff", textColor: "#2e7d32" },
    { title: "Total Expenses", value: "₹ 75,000", color: "#f7d7dcff", textColor: "#c62828" },
    { title: "Balance", value: "₹ 45,000", color: "#d3e8f7ff", textColor: "#1565c0" },

  ];

  const fetchRecentExpenses = async () => {
    try {
      const response = await getExpenses();
      const expenses = response.data;

      const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split("-");
        return new Date(year, month - 1, day);
      };

      const sortedExpenses = [...expenses].sort(
        (a, b) => parseDate(b.date) - parseDate(a.date)
      );

      setRecentExpenses(sortedExpenses.slice(0, 4));
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    }
  };


  useEffect(() => {
    fetchRecentExpenses();
  }, []);


  console.log(recentExpenses);


  return (
    <Box sx={{ minHeight: "92vh", p: 3, background: theme.palette.background.default }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Dashboard
      </Typography>

      {/* Parent Card */}
      <Card sx={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)", p: 2 }}>
        <CardContent>
          {/* Top Section */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 5 }}>
            {/* Summary Cards */}
            <Box
              sx={{
                flex: 2,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
                gap: 2,
              }}
            >
              {summaryData.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
                    height: 100,
                  }}
                >
                  <CardContent sx={{ p: 0.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "12px",
                        background: item.color,
                        textAlign: "center",
                        minHeight: 90,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                        {item.title}
                      </Typography>
                      <Typography variant="h6" fontWeight={800} sx={{ color: item.textColor }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              {/* ===== Table After Cards ===== */}
              <Box sx={{ mt: 1, width: "210%" }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Recent Expenses
                </Typography>

                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: "10px",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#dedbdbff" }}>
                        <TableCell align="center">S.No</TableCell> {/* Added Serial Number */}
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="center">Category</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Amount (₹)</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {recentExpenses.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{index + 1}</TableCell> {/* Serial Number */}
                          <TableCell align="center">{row.date}</TableCell>
                          <TableCell align="center">{row.category?.name}</TableCell>
                          <TableCell align="center">{row.title}</TableCell>
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
                              ₹{row.amount}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

              </Box>

            </Box>

            {/* Pie Chart */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <RechartsPie />
            </Box>
          </Box>


          <Box sx={{ mt: 5 }}>
            <MonthlyExpenseLine />
          </Box>



        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;
