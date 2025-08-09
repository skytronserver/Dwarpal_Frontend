import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import {
  Box, CircularProgress, Grid, List, ListItem, ListItemText, Paper, Typography,
  TextField, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useGetUserByIdQuery } from '../../services/UserApi';
import { useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useGetUsersQuery } from '../../services/UserApi';
import { useAuth } from '../../hooks/useAuth';
import { useSuccessToast, useErrorToast } from '../../components/Toast';
import { HRFormFields } from '../../components/hr/hrFormFields';
import { HrFormValues, useCreateHrMutation } from '../../services/hrServices';

interface HRFormProps {
  onSuccess?: () => void;
}



const HRForm: React.FC<HRFormProps> = ({ onSuccess }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  const isCreateMode = location.pathname.includes('/new');
  const validEditId = !isCreateMode && id ? parseInt(id) : undefined;

  const skip = undefined as any;

  const { data: userData, isLoading: isUserLoading } = useGetUserByIdQuery(
    validEditId || skip,
    { skip: !validEditId }
  );

  // const [editUser, { isLoading: isEditLoading }] = useUpdateUserMutation();
  // const [createUser, { isLoading: isCreateLoading }] = useCreateHrMutation();
  const [createHr, { isLoading: isHrLoading }] = useCreateHrMutation();
  const navigate = useNavigate();

  const { data: organizations, isLoading: isOrgsLoading } = useGetOrganisationsQuery({});
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery({ search: searchQuery, page: 1, page_size: 10 });

  const organizationOptions = organizations?.results?.map((org: any) => ({
    label: org.client_name,
    value: org.id
  })) || [];

  const modifiedInitialData = React.useMemo(() => {
    const initialData = userData || location.state?.userData;
    if (!initialData) {
      return {
        role: 'HR',
        department: 'HR Department',
        organization: user?.organization
      };
    }
    return {
      ...initialData,
      organization: initialData.organization?.id || initialData.organization || initialData.organization_id || user?.organization,
      department: 'HR Department',
      shift: initialData.shift?.id || initialData.shift,
      role: 'HR'
    };
  }, [userData, location.state, user]);

  const [values, setValues] = React.useState<HrFormValues | undefined>(modifiedInitialData);

  const formFields = React.useMemo(() => {
    const baseFields = HRFormFields.map(field => {
      if (field.name === 'role') {
        return {
          ...field,
          value: 'HR',
          defaultValue: 'HR'
        };
      }
      if (field.name === 'organization') {
        const orgValue = values?.organization || user?.organization;
        console.log('Organization value:', orgValue, 'Auth Org:', user?.organization); // Debug log
        return {
          ...field,
          options: organizationOptions,
          value: orgValue,
          defaultValue: orgValue
        };
      }
      if (field.name === 'department') {
        return {
          ...field,
          value: 'HR Department',
          defaultValue: 'HR Department'
        };
      }
      return field;
    });

    return baseFields;
  }, [organizationOptions, values?.organization, user]);


  // const handleFormChange = (newValues: HRFormValues) => {
  //   setValues(newValues);
  // };

  const handleSubmit = async (values: HrFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'role') {
          if ((key === 'photo' || key === 'kyc_document' || key === 'pan_upload' || key === 'id_proof_document') && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (validEditId) {
        // const response = await editUser({
        //   id: validEditId,
        //   formData
        // }).unwrap();
        // showSuccessToast(response?.message || '');
        // onSuccess?.();
      } else {
        const response = await createHr(formData).unwrap();
        showSuccessToast(response?.message || '');
        setValues(modifiedInitialData);
      }
    } catch (error: any) {
      console.error('Error handling HR:', error);
      showErrorToast(error?.data?.message || '');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Typography variant="h5" gutterBottom>
            {isCreateMode ? 'Create HR' : 'Edit HR'}
          </Typography>
          {(isUserLoading || isOrgsLoading || isHrLoading) ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <DynamicForm
              fields={formFields}
              onSubmit={handleSubmit}
              initialValues={modifiedInitialData}
            />
          )}
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              HR Users
            </Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search HR users..."
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
            {isUsersLoading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {users?.results?.map((user: any) => (
                  <ListItem
                    component="div"
                    key={user.id}
                    onClick={() => navigate(`/users/${user.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <ListItemText
                      primary={`${user.name}`}
                      secondary={`${user.email || 'No email'}`}
                    />
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

export default HRForm; 