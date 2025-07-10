import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../features/slices/modalSlice';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { RootState } from '../../features/store';
import { ModalState } from "../../features/slices/modalSlice";
import { GuestPassSettings,   useViewGuestPassSettingsQuery } from '../../services/gatePassApi';


const ViewGuestPassSettings: React.FC = () => {
  const dispatch = useDispatch();
  const modalData = useSelector((state: RootState) => (state.modal as ModalState).data);
  const { data: guestPassSettings, isLoading, error } = useViewGuestPassSettingsQuery();


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#00bfa5'; // Teal color for active
      case 'pending':
        return '#ffa726'; // Orange color for pending
      case 'expired':
        return '#ef5350'; // Red color for expired
      default:
        return '#757575';
    }
  };

  const handleApprove = (pass: any) => {
    dispatch(
      openModal({
        type: 'APPROVE_GUEST_PASS',
        data: pass,
      })
    );
  };

  const handleConfirmApproval = async () => {
    const passId = modalData?.id;
    if (!passId) return;
    
    try {
      // Here you would typically make an API call to approve the pass
      console.log('Approving pass:', passId);
      // After successful approval, you would refresh the data
    } catch (error) {
      console.error('Error approving pass:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'normal' }}>
        Guest Pass Settings
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="guest pass settings table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><Typography variant="subtitle2">Visitor Name</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Purpose</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Valid From</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Valid Until</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Status</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Issuer</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Visitor Type</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {guestPassSettings?.results?.map((pass: GuestPassSettings) => (
              <TableRow
                key={pass.id}
                sx={{ '&:hover': { backgroundColor: '#f8f8f8' } }}
              >
                <TableCell>{pass.visitorName}</TableCell>
                <TableCell>{pass.purpose}</TableCell>
                <TableCell>{pass.validFrom}</TableCell>
                <TableCell>{pass.validUntil}</TableCell>
                <TableCell>
                  <Chip
                    label={pass.status}
                    sx={{
                      backgroundColor: getStatusColor(pass.status),
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.75rem'
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>{pass.issuerName}</TableCell>
                <TableCell>
                  <Chip
                    label={pass.visitorType}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell>
                  {pass.status === 'Pending' && (
                    <Button
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleApprove(pass)}
                      sx={{
                        backgroundColor: '#00bfa5',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#00a693',
                        },
                        textTransform: 'none',
                        borderRadius: 1,
                      }}
                      size="small"
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationModal
        title="Approve Guest Pass"
        message="Are you sure you want to approve this guest pass? This will grant access to the visitor."
        onConfirm={handleConfirmApproval}
      />
    </Box>
  );
};

export default ViewGuestPassSettings;
