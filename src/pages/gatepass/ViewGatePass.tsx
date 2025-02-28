import { Grid, Typography, Paper, Box, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from "../../hooks/useAuth";
import { useApproveGuestPassMutation } from "../../services/gatePassApi";


const ViewGatePass = () => {
    const location = useLocation();
    const {hasPermission} = useAuth();
    const visitorPass = location.state?.gatepass;
    const [approveGuestPass] = useApproveGuestPassMutation();
    console.log(visitorPass, 'visitorPass');

    return (
        <Box sx={{ p: 3, maxWidth: 1200 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PersonIcon sx={{ fontSize: 35 }} />
                    Visitor Pass Details
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Visitor Name
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.name}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <BusinessIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Organization to Visit
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.organization_to_visit}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Visit Time
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.visit_date} ({visitorPass?.visit_start_time} - {visitorPass?.visit_end_time})
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Person to Meet
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {visitorPass?.person_to_meet || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <BusinessIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Department to Visit
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.department_to_visit}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                {visitorPass?.is_approved === false && hasPermission('approve_guest_pass') && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={async () => {
                                try {
                                    await approveGuestPass(visitorPass?.id);
                                } catch (error) {
                                    console.error('Error approving gate pass:', error);
                                }
                            }}
                        >
                            Approve Gate Pass
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ViewGatePass; 