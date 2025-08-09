import { Grid, Typography, Paper, Box, CircularProgress } from "@mui/material"
import { useParams } from "react-router-dom";
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useGetDepartmentByIdQuery } from '../../services/DepartmentApi';

const ViewDepartment = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useGetDepartmentByIdQuery(Number(id));
    const department = data?.data;
    const organisation = department?.organization;
    console.log(organisation,department,'department');
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !department) {
        return <Box sx={{ p: 3 }}>
            {error && 'data' in error ? (error.data as any).message : 'Error loading department details'}
        </Box>;
    }

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
                                        {organisation?.client_name}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CameraAltIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Integrated with AI camera
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
