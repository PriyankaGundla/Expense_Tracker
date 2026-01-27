import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  Stack,
  InputLabel
} from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import { getExpensesByCategory } from "../../services/expenseService";

const monthMap = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4,
  May: 5, Jun: 6, Jul: 7, Aug: 8,
  Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};


export default function RechartsPie() {
  const theme = useTheme();
  const [categoryData, setCategoryData] = useState([])

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const currentYear = new Date().getFullYear();
  const currentMonth = months[new Date().getMonth()];


  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [message, setMessage] = useState("");

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };


  const fetchExpenseByCategory = async () => {
    try {
      const filters = {
        year: selectedYear,
      };

      if (selectedMonth && selectedMonth !== "All") {
        filters.month = monthMap[selectedMonth];
      }

      const response = await getExpensesByCategory(filters);
      if (!response.data || response.data.length === 0) {
        setCategoryData([]);
        setMessage(response.message);
        return;
      }
      const pieFormattedData = response.data.map(item => ({
        id: item.category.name,
        label: item.category.id,
        value: item.amount,
      }));

      setCategoryData(pieFormattedData);
    } catch (error) {
      console.error("Failed to fetch expenses by category", error);
    }
  };

  useEffect(() => {
    fetchExpenseByCategory();
  }, [selectedYear, selectedMonth]);

  return (
    <Box
      sx={{
        flex: 1,
        p: 1,
        borderRadius: "18px",
        background: theme.palette.background.primary,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 7 }}
      >
        <Typography variant="h6" fontWeight={600}>
          Expenses by Category
        </Typography>

        <Stack direction="row" spacing={1}>
          {/* Year Filter */}
          <FormControl size="small">
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

          {/* Month Filter */}
          <FormControl size="small">
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
        </Stack>
      </Stack>

      <Box sx={{ height: 300 }}>
        {categoryData.length > 0 ? (
          <ResponsivePie
            data={categoryData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: "nivo" }}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            enableRadialLabels
            radialLabel="label"
            radialLabelsSkipAngle={10}
            radialLabelsTextColor="#333"
            radialLabelsLinkColor={{ from: "color" }}
            sliceLabelsSkipAngle={10}
            sliceLabel="value"
            sliceLabelsTextColor="#fff"
          />
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
        )
        }
      </Box>
    </Box >
  );
}
