import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Divider,
  useTheme,
} from "@mui/material";

const TermsDialog = ({ open, onClose }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: theme.palette.primary.main,
        }}
      >
        Terms & Conditions
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" fontWeight={600} gutterBottom>
          1. Introduction
        </Typography>
        <Typography paragraph>
          Welcome to the Expense Tracker application. By using this application,
          you agree to these Terms and Conditions.
        </Typography>

        <Typography variant="h6" fontWeight={600} gutterBottom>
          2. Use of Application
        </Typography>
        <Typography paragraph>
          This app is intended for personal expense tracking only. You agree to
          use it responsibly and lawfully.
        </Typography>

        <Typography variant="h6" fontWeight={600} gutterBottom>
          3. User Accounts
        </Typography>
        <Typography paragraph>
          You are responsible for maintaining the confidentiality of your
          account credentials.
        </Typography>

        <Typography variant="h6" fontWeight={600} gutterBottom>
          4. Google Authentication
        </Typography>
        <Typography paragraph>
          When using Google login, only basic profile information is accessed.
          Your Google password is never stored.
        </Typography>

        <Typography variant="h6" fontWeight={600} gutterBottom>
          5. Data & Privacy
        </Typography>
        <Typography paragraph>
          All user data is stored securely and is not shared with third parties.
        </Typography>

        <Typography variant="h6" fontWeight={600} gutterBottom>
          6. Limitation of Liability
        </Typography>
        <Typography paragraph>
          The application is provided "as is" without warranties of any kind.
        </Typography>

        <Typography variant="h6" fontWeight={600} gutterBottom>
          7. Changes to Terms
        </Typography>
        <Typography paragraph>
          These terms may be updated from time to time without prior notice.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: "10px",
            px: 3,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsDialog;
