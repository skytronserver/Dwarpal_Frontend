import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useViewGuestPassSettingsQuery, useApproveGuestPassSettingsMutation } from '../../services/gatePassApi';
import { useSuccessToast, useErrorToast } from '../../components/Toast';
import { useAuth } from '../../hooks/useAuth';

const ViewGuestPassSettings: React.FC = () => {
  const { data: guestPassSettings, isLoading, error } = useViewGuestPassSettingsQuery();
  const [approveGuestPassSettings] = useApproveGuestPassSettingsMutation();
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [settingToApprove, setSettingToApprove] = useState<number | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const { hasPermission } = useAuth();

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleApprove = (pass: any) => {
    setSettingToApprove(pass.id);
    setIsApproveModalOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (settingToApprove) {
      try {
        await approveGuestPassSettings(settingToApprove).unwrap();
        showSuccessToast('Guest pass setting approved successfully');
        setIsApproveModalOpen(false);
        setSettingToApprove(null);
        setApprovalComment('');
      } catch (error: any) {
        console.error('Error approving guest pass setting:', error);
        showErrorToast(error?.data?.message || 'Error approving guest pass setting');
      }
    }
  };

  const handleApproveCancel = () => {
    setIsApproveModalOpen(false);
    setSettingToApprove(null);
    setApprovalComment('');
  };

  const handleReject = async () => {
    if (settingToApprove) {
      try {
        // Implement reject functionality here
        showSuccessToast('Guest pass setting rejected successfully');
        setIsApproveModalOpen(false);
        setSettingToApprove(null);
        setApprovalComment('');
      } catch (error: any) {
        console.error('Error rejecting guest pass setting:', error);
        showErrorToast(error?.data?.message || 'Error rejecting guest pass setting');
      }
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading guest pass settings</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'normal' }}>
        Guest Pass Settings
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="guest pass settings table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><Typography variant="subtitle2">Title</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Category</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Visiting Hours</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Visiting Days</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Holiday Restriction</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Status</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Created At</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {guestPassSettings?.map((pass) => (
              <TableRow
                key={pass.id}
                sx={{ '&:hover': { backgroundColor: '#f8f8f8' } }}
              >
                <TableCell>{pass.title}</TableCell>
                <TableCell>
                  <Chip
                    label={pass.guest_category}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell>
                  {formatTime(pass.visitor_hours_start)} - {formatTime(pass.visitor_hours_end)}
                </TableCell>
                <TableCell>
                  {pass.visiting_days.map((day, index) => (
                    <Chip
                      key={index}
                      label={day}
                      size="small"
                      sx={{ 
                        mr: 0.5, 
                        mb: 0.5,
                        backgroundColor: '#e3f2fd',
                        fontSize: '0.75rem'
                      }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Chip
                    label={pass.restrict_on_holidays ? 'Restricted' : 'Not Restricted'}
                    size="small"
                    sx={{
                      backgroundColor: pass.restrict_on_holidays ? '#ffebee' : '#e8f5e9',
                      color: pass.restrict_on_holidays ? '#c62828' : '#2e7d32',
                      fontSize: '0.75rem'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={pass.is_approved ? 'Approved' : 'Pending'}
                    sx={{
                      backgroundColor: pass.is_approved ? '#00bfa5' : '#ffa726',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.75rem'
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(pass.created_at)}</TableCell>
                <TableCell>
                  {hasPermission('manage:gate-passes settings') && !pass.is_approved && (
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

      <Dialog
        open={isApproveModalOpen}
        onClose={handleApproveCancel}
        aria-labelledby="approve-confirmation-dialog"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="approve-confirmation-dialog">
          Guest Pass Setting Action
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>
            Are you sure you want to submit this request? This action cannot be undone.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              multiline
              rows={3}
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              placeholder="Add your comments here..."
              variant="outlined"
              size="small"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleApproveConfirm}
            color="success"
            variant="contained"
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'success.main',
                color: 'white'
              },
              backgroundColor: 'green !important',
              color: 'white !important'
            }}
            startIcon={<CheckCircleIcon sx={{ color: 'white !important' }} />}
          >
            Approve
          </Button>
          <Button
            onClick={handleReject}
            color="error"
            variant="outlined"
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'white'
              },
              backgroundColor: 'red !important',
              color: 'white !important'
            }}
            startIcon={<CloseIcon sx={{ color: 'white !important' }} />}
          >
            Reject
          </Button>
          <Button 
            onClick={handleApproveCancel} 
            color="inherit"
            size="small"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewGuestPassSettings;

