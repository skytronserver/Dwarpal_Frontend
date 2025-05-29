import { Grid, Typography, Paper, Box, CircularProgress } from "@mui/material"
import { useParams } from "react-router-dom";
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import { useGetOrganisationByIdQuery } from "../../services/OrganisationApi";

const ViewOrganisation = () => {
    const { id } = useParams();
    const { data, isLoading } = useGetOrganisationByIdQuery(Number(id));
    const organisation = data?.data;
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!organisation) {
        return <Box sx={{ p: 3 }}>Organisation not found</Box>;
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1200 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BusinessIcon sx={{ fontSize: 35 }} />
                    Organisation Details
                </Typography>

                <Grid container spacing={3}>    
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <BusinessIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Organisation Name
                                    </Typography>
                                    <Typography variant="body1">
                                        {organisation.name}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <LocationOnIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Address
                                    </Typography>
                                    <Typography variant="body1">
                                        {organisation.address}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <ConfirmationNumberIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        GST Number
                                    </Typography>
                                    <Typography variant="body1">
                                        {organisation.gst_no}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <GroupIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Number of Employees
                                    </Typography>
                                    <Typography variant="body1">
                                        {organisation?.no_of_employees || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <SecurityIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Access Control
                                    </Typography>
                                    <Typography variant="body1">
                                        {organisation.access_control ? "Enabled" : "Disabled"}
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

export default ViewOrganisation
