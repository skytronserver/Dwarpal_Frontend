import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AccessTime, Person, Schedule, Timer } from "@mui/icons-material";
import { Box, Paper, Typography, Button, Grid } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

const ViewShift = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const shift = useLocation().state.shift;
    const { hasPermission } = useAuth();

    const handleApprove = () => {
        navigate(`/shifts/assign/${id}`);
        console.log('Shift approved:', id);
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Schedule sx={{ fontSize: 35 }} />
                    Shift Details
                </Typography>

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
                                        {shift.shift_name}
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
                                        {shift.shift_start_time} - {shift.shift_end_time}
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
                                        {Math.round(parseFloat(shift.total_work_time) / 3600)} hours
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
                                        ID: {shift.created_by}
                                    </Typography>
                                </Box>
                            </Box>

                            {hasPermission('assign:shift') && (
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        fullWidth
                                        onClick={handleApprove}
                                    >
                                        Assign Shift
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ViewShift;