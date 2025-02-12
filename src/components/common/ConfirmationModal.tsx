import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../features/slices/modalSlice';
import { RootState } from '../../features/store';



interface ConfirmationModalProps {
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal = ({ onConfirm, title, message }: ConfirmationModalProps) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal; 