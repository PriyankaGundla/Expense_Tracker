import React, { useState } from "react";
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

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

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

      <ResponsiveContainer width="99%" height="85%">
        <LineChart data={filteredData}>
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
    </Box>
  );
}

export default MonthlyExpenseLine;
