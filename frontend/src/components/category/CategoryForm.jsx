import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Divider,
    InputAdornment,
    useTheme,
    MenuItem,
    Box,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CategoryIcon from "@mui/icons-material/Category";

import { CATEGORY_ICON_MAP } from "./icons";
/* ICON MAP */
// const ICON_MAP = {
//     Food: <FastfoodIcon />,
//     Bills: <ReceiptIcon />,
//     Travel: <FlightIcon />,
//     Shopping: <ShoppingCartIcon />,
// };



function CategoryForm({ open, onClose, onSave, category, usedIcons = [] }) {
    const theme = useTheme();
    const usedIconSet = new Set(usedIcons);

    /* FORM STATE */
    const [name, setName] = useState("");
    const [iconKey, setIconKey] = useState("");

    /* Save handler */
    const handleSave = () => {
        onSave({
            name,
            iconKey,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{ display: "flex", alignItems: "center", gap: 1, pt: 3 }}
            >
                {category ? (
                    <EditIcon fontSize="small" />
                ) : (
                    <AddIcon fontSize="small" />
                )}
                {category ? "Edit Category" : "Add Category"}
            </DialogTitle>

            <Divider />

            <DialogContent>
                {/* Category Name */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Category Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CategoryIcon color="action" />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: "15px" },
                    }}
                />

                {/* Icon Selector */}
                <TextField
                    select
                    fullWidth
                    margin="normal"
                    label="Select Icon"
                    value={iconKey}
                    onChange={(e) => setIconKey(e.target.value)}
                >
                    {Object.keys(CATEGORY_ICON_MAP).map((key) => {
                        const isUsed =
                            usedIconSet.has(key) && key !== category?.iconKey;
                        console.log("isUsed", isUsed)
                        return (
                            <MenuItem key={key} value={key} disabled={isUsed}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        opacity: isUsed ? 0.5 : 1,
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {CATEGORY_ICON_MAP[key]}
                                    {key}
                                    {isUsed && " (Used)"}
                                </Box>
                            </MenuItem>
                        );
                    })}
                </TextField>

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
                    onClick={handleSave}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CategoryForm;
