import { Grid, Typography, Paper, Box, Button, Avatar, Link } from "@mui/material";
import { useParams } from "react-router-dom";
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from "../../hooks/useAuth";
import { useApproveGuestPassMutation, useGetGuestPassByIdQuery } from "../../services/gatePassApi";
import { useSuccessToast, useErrorToast } from "../../components/Toast";
import { useLocation } from "react-router-dom";


const ViewGatePass = () => {
    const location = useLocation();
    const {hasPermission} = useAuth();
    const {id} = useParams();
    const { data: passFromLocation, isLoading, error } = useGetGuestPassByIdQuery(Number(id));
    const [approveGuestPass] = useApproveGuestPassMutation();
    const showSuccessToast = useSuccessToast();
    const showErrorToast = useErrorToast();

    // Add dummy data fallback
    // const dummyPass = {
    //     id: 1,
    //     name: "John Doe",
    //     organization_to_visit: "Demo Organization",
    //     visit_date: "2024-03-20",
    //     visit_start_time: "09:00",
    //     visit_end_time: "17:00",
    //     person_to_meet: "Jane Smith",
    //     department_to_visit: "IT Department",
    //     is_approved: false
    // };

    const visitorPass = passFromLocation;
    const baseUrl = import.meta.env.VITE_BASE_URL || "";

    const photoUrl = visitorPass?.photo ? `${baseUrl}${visitorPass.photo}` : undefined;
    const idProofUrl = visitorPass?.id_proof_document ? `${baseUrl}${visitorPass.id_proof_document}` : undefined;

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Failed to load gate pass.</Typography>
            </Box>
        );
    }

console.log(hasPermission('approve_guest_pass'),'odjkdhjiugdfduy');


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
                                <Avatar src={photoUrl} alt={visitorPass?.name} sx={{ width: 56, height: 56 }} />
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
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Mobile Number
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.mobile_number || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.email || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <BusinessIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Organization to Visit (ID)
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.organization_to_visit}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <BusinessIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Department to Visit (ID)
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.department_to_visit}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Visit Date
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.visit_date}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Start - End Time
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.start_time} - {visitorPass?.end_time}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Person to Meet (ID)
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.person_to_meet || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Access Validity
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.access_validity_start} - {visitorPass?.access_validity_end}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Gender / DOB
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.gender || 'N/A'} {visitorPass?.date_of_birth ? `(DOB: ${visitorPass.date_of_birth})` : ''}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Address
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {visitorPass?.address || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        District / State / Pincode
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.district || 'N/A'}{visitorPass?.state ? `, ${visitorPass.state}` : ''}{visitorPass?.pincode ? ` - ${visitorPass.pincode}` : ''}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Emergency Contact Number
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.emergency_contact_number || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        ID Proof No
                                    </Typography>
                                    <Typography variant="body1">
                                        {visitorPass?.id_proof_no || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>
{/* 
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        ID Proof Document
                                    </Typography>
                                    {idProofUrl ? (
                                        <Link href={idProofUrl} target="_blank" rel="noopener">
                                            View Document
                                        </Link>
                                    ) : (
                                        <Typography variant="body1">N/A</Typography>
                                    )}
                                </Box>
                            </Box> */}

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Purpose of Visit
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {visitorPass?.purpose_of_visit || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Notes and Remarks
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {visitorPass?.notes_and_remarks || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                {visitorPass?.is_approved === false && hasPermission('approve_guest_pass') && typeof visitorPass?.id === 'number' && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={async () => {
                                try {
                                    await approveGuestPass(Number(id)).unwrap();
                                    showSuccessToast('Gate pass approved successfully');
                                } catch (error) {
                                    console.error('Error approving gate pass:', error);
                                    showErrorToast('Error approving gate pass');
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