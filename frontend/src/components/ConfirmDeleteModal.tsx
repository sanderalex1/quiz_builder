import { Modal, Box, Typography, Button, Stack } from "@mui/material";
import type { FC } from "react";
import { confirmationModalStyles } from "./styles";

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onDelete: () => void;
  onClose: () => void;
}

const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onDelete,
  onClose,
}) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={confirmationModalStyles}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}
      <Stack
        direction="row"
        spacing={1}
        sx={{ justifyContent: "flex-end", color: "text.secondary" }}
      >
        <Button color="inherit" variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onDelete}>
          {confirmLabel}
        </Button>
      </Stack>
    </Box>
  </Modal>
);

export default ConfirmDeleteModal;
