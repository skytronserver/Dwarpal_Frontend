import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AccessTime, Person, Schedule, Timer, CheckCircle, Assignment, PendingActions, Close } from "@mui/icons-material";
import { Box, Paper, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Chip, TextField } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { useGetShiftByIdQuery, useEditShiftMutation } from "../../services/shiftApi";
import { useState } from "react";

interface Shift {
    id: number;
    shift_name: string;
    shift_start_time: string;
    shift_end_time: string;
    total_work_time: number;
    created_by: number;
    is_active: boolean;
    comment?: string;
}

const ViewShift = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: shift, isLoading } = useGetShiftByIdQuery(Number(id)) as { data: Shift | undefined, isLoading: boolean };
    const [editShift] = useEditShiftMutation();
    const { hasPermission } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comment, setComment] = useState('');

    const handleApprove = async () => {
        try {
            const formData = new FormData();
            formData.append('is_active', 'true');
            if (comment) {
                formData.append('comment', comment);
            }
            await editShift({ id: Number(id), data: formData }).unwrap();
            window.location.reload();
        } catch (error) {
            console.error('Error approving shift:', error);
        }
        setIsModalOpen(false);
        setComment('');
    };

    const handleReject = async () => {
        try {
            const formData = new FormData();
            formData.append('is_active', 'false');
            if (comment) {
                formData.append('comment', comment);
            }
            await editShift({ id: Number(id), data: formData }).unwrap();
            window.location.reload();
        } catch (error) {
            console.error('Error rejecting shift:', error);
        }
        setIsModalOpen(false);
        setComment('');
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setComment('');
    };

    if (isLoading) {
        return <Box sx={{ p: 3 }}>Loading...</Box>;
    }

    if (!shift) {
        return <Box sx={{ p: 3 }}>Shift not found</Box>;
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1200 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Schedule sx={{ fontSize: 35 }} />
                        Shift Details
                    </Typography>
                    <Chip
                        icon={shift?.is_active ? <CheckCircle /> : <PendingActions />}
                        label={shift?.is_active ? "Approved" : "Pending"}
                        color={shift?.is_active ? "success" : "warning"}
                        sx={{ 
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                                color: 'inherit'
                            }
                        }}
                    />
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Schedule sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Shift Name
                                    </Typography>
                                    <Typography variant="body1">
                                        {shift?.shift_name}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AccessTime sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Shift Time
                                    </Typography>
                                    <Typography variant="body1">
                                        {shift?.shift_start_time} - {shift?.shift_end_time}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Timer sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Total Hours
                                    </Typography>
                                    <Typography variant="body1">
                                        {Math.round(parseFloat(shift?.total_work_time.toString() || '0') / 3600)} hours
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Person sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Created By
                                    </Typography>
                                    <Typography variant="body1">
                                        ID: {shift?.created_by}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ 
                                mt: 2, 
                                display: 'flex', 
                                gap: 1,
                                '& .MuiButton-root': {
                                    minWidth: '100px',
                                    py: 0.5,
                                    px: 1.5,
                                    fontSize: '0.8125rem'
                                }
                            }}>
                                {hasPermission('assign:shift') && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        startIcon={<Assignment sx={{ fontSize: 16 }} />}
                                        onClick={() => navigate(`/shifts/assign/${id}`)}
                                    >
                                        Assign
                                    </Button>
                                )}
                                {hasPermission('approve:approval') && !shift?.is_active && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="medium"
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'success.main',
                                                color: 'white'
                                            },
                                            backgroundColor: 'green !important',
                                            color: 'white !important'
                                        }}
                                        startIcon={<CheckCircle sx={{ fontSize: 16 }} />}
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Approve
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Dialog
                open={isModalOpen}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Shift Action</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2, fontWeight: 500 }}>
                        Are you sure you want to submit this request? This action cannot be undone.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            multiline
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add your comments here..."
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleApprove}
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
                        startIcon={<CheckCircle sx={{ color: 'white !important' }} />}
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
                        startIcon={<Close sx={{ color: 'white !important' }} />}
                    >
                        Reject
                    </Button>
                    <Button 
                        onClick={handleClose} 
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

export default ViewShift;