import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    useTheme
} from "@mui/material";

function DeleteNotification({
    open = false,
    onClose,
    onConfirm,
    name
}) {
    const theme = useTheme();
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontWeight: 700 }}>
                Confirm Delete
            </DialogTitle>

            <DialogContent>
                <Typography>
                    Are you sure you want to delete this {name}?
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap:1 }}>
                <Button onClick={onClose}>Cancel</Button>

                <Button
                    variant="contained"
                    color="error"
                    sx={{
                        borderRadius: "15px",
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        "&:hover": {
                            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                        },
                    }}
                    onClick={onConfirm}
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteNotification;
