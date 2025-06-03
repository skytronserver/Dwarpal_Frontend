import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { OrganisationFormFields } from '../../components/organisation/organisationFormFeilds';
import { 
    Typography, Box, CircularProgress, List, ListItem, ListItemText, Paper, Grid,
    TextField, InputAdornment, IconButton 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useCreateOrganisationMutation, useEditOrganisationMutation, useGetOrganisationByIdQuery, useGetOrganisationsQuery } from '../../services/OrganisationApi';

interface OrganisationFormProps {
    onSuccess?: () => void;
}

interface OrganisationFormValues {
    id?: string;
    [key: string]: any;
}

const OrganisationForm: React.FC<OrganisationFormProps> = ({ onSuccess }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');
    const { data: orgList, isLoading: isOrgListLoading } = useGetOrganisationsQuery({ search: searchQuery, page: 1, page_size: 10 });
    const { data, isLoading: isDataLoading } = useGetOrganisationByIdQuery(
        parseInt(id as string),
        { skip: !id }
    );
    const isEditMode = Boolean(id && id !== ':id' && !isNaN(parseInt(id)));
    const organisationData = data?.data;
    const [editOrganisation, { isLoading: isEditLoading }] = useEditOrganisationMutation();
    const [createOrganisation, { isLoading: isCreateLoading }] = useCreateOrganisationMutation();

    const handleSubmit = async (values: OrganisationFormValues) => {
        console.log('Submit triggered with values:', values);

        const orgs = new FormData();
        Object.keys(values).forEach(key => {
            if (values[key] !== null && values[key] !== undefined) {
                if (typeof values[key] === 'boolean') {
                    orgs.append(key, values[key] ? 'True' : 'False');
                } else {
                    orgs.append(key, values[key]);
                }
            }
        });

        try {
            if (isEditMode) {
                console.log('Executing edit operation with ID:', id);
                await editOrganisation({
                    id: parseInt(id!),
                    data: orgs
                }).unwrap();
                onSuccess?.();
            } else {
                console.log('Executing create operation');
                await createOrganisation(orgs).unwrap();
                navigate('/organisations');
            }
        } catch (error) {
            console.error('Error handling organisation:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    <Typography variant="h5" gutterBottom>
                        {isEditMode ? 'Edit Clients' : 'Create Clients'}
                    </Typography>
                    {(isEditLoading || isCreateLoading || isDataLoading) ? (
                        <Box display="flex" justifyContent="center" my={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <DynamicForm
                            fields={OrganisationFormFields}
                            onSubmit={handleSubmit}
                            initialValues={organisationData}
                        />
                    )}
                </Grid>
                <Grid item xs={3}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Clients
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search organizations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchQuery ? (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setSearchQuery('')}>
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null
                                }}
                            />
                        </Box>
                        {isOrgListLoading ? (
                            <Box display="flex" justifyContent="center" p={2}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                                {orgList?.results.map((org) => (
                                    <ListItem
                                        component="div"
                                        key={org.id}
                                        onClick={() => navigate(`/organisations/${org.id}`)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <ListItemText primary={org.name} secondary={org.address} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default OrganisationForm;