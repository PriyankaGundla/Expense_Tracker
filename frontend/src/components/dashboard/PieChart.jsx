import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { ResponsivePie } from "@nivo/pie";

export default function RechartsPie() {
  const theme = useTheme();

  const currentYear = new Date().getFullYear();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const currentMonth = months[new Date().getMonth()];

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const pieData = [
    { id: "Food", label: "Food", value: 20000 },
    { id: "Bills", label: "Bills", value: 15000 },
    { id: "Travel", label: "Travel", value: 10000 },
    { id: "Shopping", label: "Shopping", value: 20000 },
    { id: "Entertainment", label: "Entertainment", value: 10000 },
  ];

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
            <Select value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Month Filter */}
          <FormControl size="small">
            <Select value={month} onChange={(e) => setMonth(e.target.value)}>
              {months.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Box sx={{ height: 300 }}>
        <ResponsivePie
          data={pieData}
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
      </Box>
    </Box>
  );
}
