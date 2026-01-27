import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { getMonthlyExpenseTrend } from "../../services/expenseService";

const allData = [
  { month: "Jan", year: 2026, expense: 15000 },
  { month: "Feb", year: 2026, expense: 48000 },
  { month: "Mar", year: 2026, expense: 52000 },
  { month: "Apr", year: 2026, expense: 50000 },
  { month: "May", year: 2026, expense: 54000 },
  { month: "Jan", year: 2025, expense: 20000 },
  { month: "Feb", year: 2025, expense: 30000 },
  { month: "Mar", year: 2025, expense: 40000 },
  { month: "Apr", year: 2025, expense: 35000 },
  { month: "May", year: 2025, expense: 45000 },
];

const allMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function MonthlyExpenseLine() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState([]);
  const [message, setMessage] = useState("");

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const fetchMonthlyTrend = async () => {
    try {
      const response = await getMonthlyExpenseTrend(selectedYear);
      setChartData(response.data);
      setMessage(response.message);
    } catch (err) {
      console.error(err);
      setChartData([]);
      setMessage("Failed to fetch monthly trend");
    }
  };

  useEffect(() => {
    fetchMonthlyTrend();
  }, [selectedYear]);

  const filteredData = allMonths.map((month) => {
    const monthData = allData.find(
      (item) => item.year === selectedYear && item.month === month
    );
    return {
      month,
      expense: monthData ? monthData.expense : 0,
    };
  });

  return (
    <Box sx={{ width: "100%", height: 380 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Monthly Expense Trend
        </Typography>

        <FormControl size="small">
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {chartData.some(d => d.expense > 0) ? (
        <ResponsiveContainer width="99%" height="85%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#d32f2f"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Box
          sx={{
            height: "85%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="red">
            {message}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default MonthlyExpenseLine;
