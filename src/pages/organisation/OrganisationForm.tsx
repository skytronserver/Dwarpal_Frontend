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
import { useCreateCompanyMutation, ClientFormValues } from '../../services/clientService';
import { useEditOrganisationMutation, useGetOrganisationsQuery, useGetOrganisationByIdQuery } from '../../services/OrganisationApi';
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
    const [createCompany, { isLoading: isCreateLoading }] = useCreateCompanyMutation();
   const handleSubmit = async (values: OrganisationFormValues) => {
  console.log('Submit triggered with valuess:', values);

  try {
    if (isEditMode) {
      // ... your edit logic unchanged
    } else {
      console.log('Executing create operations', values);

      const formData = new FormData();
      const fileKeys = [
        'photo',
        'kyc_document',
        'id_proof_image',
        'pan_upload',
        'pan_file',
        'gst_file'
      ];

      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (fileKeys.includes(key) && value instanceof File) {
            formData.append(key, value);
          } else if (key === 'assigned_permissions' && Array.isArray(value)) {
            formData.append(key, value.join(','));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      await createCompany(formData).unwrap();
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
                                        <ListItemText primary={org.client_name} secondary={org.address} />
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