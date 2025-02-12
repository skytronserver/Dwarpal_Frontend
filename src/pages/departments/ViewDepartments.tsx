import { Grid, Typography, Paper, Box } from "@mui/material"
import { useLocation } from "react-router-dom";
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const ViewDepartment = () => {
    const location = useLocation();
    const department = location.state?.department;


    return (
        <Box sx={{ p: 3, maxWidth: 1200 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ApartmentIcon sx={{ fontSize: 35 }} />
                    Department Details
                </Typography>

                <Grid container spacing={3}>    
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <ApartmentIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Department Name
                                    </Typography>
                                    <Typography variant="body1">
                                        {department.name}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <BusinessIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Organisation Name
                                    </Typography>
                                    <Typography variant="body1">
                                        {department.organization}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CameraAltIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Intregrated with AI camera
                                    </Typography>
                                    <Typography variant="body1">
                                        {department.integrate_with_ai_camera ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>  
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}

export default ViewDepartment
