import { useParams } from "react-router-dom";
import { Person, Business, Badge, Work, Phone } from "@mui/icons-material";
import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { useGetUserByIdQuery, useApproveUserMutation } from "../../services/UserApi";
import { useAuth } from "../../hooks/useAuth";


const ViewUser = () => {
    const { id } = useParams();
    const { data: response, isLoading } = useGetUserByIdQuery(Number(id));
    const user = (response as any)?.data || {};
    const [approveUser] = useApproveUserMutation();
    const { hasPermission } = useAuth();
    console.log(user, 'user');
    if (isLoading) {
        return <Box sx={{ p: 3 }}>Loading...</Box>;
    }

    if (!user) {
        return <Box sx={{ p: 3 }}>User not found</Box>;
    }


    return (
        <Box sx={{ p: 3, maxWidth: 1200 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Person sx={{ fontSize: 35 }} />
                    User Details
                </Typography>
                {hasPermission('approve:user') && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => approveUser(user.id)}
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                >
                    Approve
                </Button>
                )}
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Person sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Name
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.name}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Badge sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Employee Code
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.employee_code}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Business sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Organization
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.organization || 'Not Assigned'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Work sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Department
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.department?.name || 'Not Assigned'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Badge sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Role
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.role}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Work sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Designation
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.designation || 'Not Assigned'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Person sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Blood Group
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.blood_group || 'Not Specified'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Phone sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Emergency Contact
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.emergency_contact || 'Not Specified'}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Badge sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.is_approved ? 'Approved' : 'Not Approved'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ViewUser;
