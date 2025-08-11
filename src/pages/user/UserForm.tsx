import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { 
  Box, CircularProgress, Grid, Typography
} from '@mui/material';
import { useCreateAdminMutation, useUpdateUserMutation, useGetUserByIdQuery } from '../../services/UserApi';
import { UserFormFields } from '../../components/user/userFormFields';
import { useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useSuccessToast, useErrorToast } from '../../components/Toast';

interface UserFormProps {
  onSuccess?: () => void;
}

interface UserFormValues {
  id?: string;
  role: 'ADMIN';
  [key: string]: any;
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const { id, orgId } = useParams<{ id: string; orgId: string }>();
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
  
  const [editUser, { isLoading: isEditLoading }] = useUpdateUserMutation();
  const [createAdmin, { isLoading: isCreateAdminLoading }] = useCreateAdminMutation();
  const navigate = useNavigate();

  const { data: organizations, isLoading: isOrgsLoading } = useGetOrganisationsQuery({search: '', page: 1, page_size: 100});

  const modifiedInitialData = React.useMemo(() => {
    const initialData = userData || location.state?.userData;
    if (!initialData) {
      return { 
        role: 'ADMIN',
        organization: orgId
      };
    }
    return {
      ...initialData,
      organization: orgId,
      role: 'ADMIN'
    };
  }, [userData, location.state, orgId]);

  const formFields = React.useMemo(() => {
    return UserFormFields.map(field => {
      if (field.name === 'role') {
        return {
          ...field,
          disabled: true,
          defaultValue: 'ADMIN',
          value: 'ADMIN',
          options: [{ label: 'Admin', value: 'ADMIN' }]
        };
      }
      if (field.name === 'organization') {
        const org = organizations?.results?.find(org => org.id.toString() === orgId);
        return {
          ...field,
          disabled: true,
          defaultValue: orgId,
          value: orgId,
          options: org ? [{ 
            label: org.client_name, 
            value: org.id 
          }] : []
        };
      }
      return field;
    });
  }, [organizations, orgId]);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'id_proof_document' || key === 'pan_upload' || key === 'photo') {
            if (value instanceof File) {
              formData.append(key, value);
            }
          } else if (key === 'valid_upto') {
            formData.append(key, value);
          } else if (key !== 'role') {
            formData.append(key, value.toString());
          }
        }
      });
      formData.append('role', 'ADMIN');
      if (orgId) {
        formData.append('organization', orgId);
      }

      if (validEditId) {
        const response = await editUser({
          id: validEditId,
          formData
        }).unwrap();
        showSuccessToast(response?.message || 'Admin updated successfully');
        onSuccess?.();
      } else {
        const response = await createAdmin(formData).unwrap();
        showSuccessToast(response?.message || 'Admin created successfully');
        navigate(`/org/client/${orgId}/users`);
      }
    } catch (error: any) {
      console.error('Error handling admin:', error);
      showErrorToast(error?.data?.message || 'Error processing admin user');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            {isCreateMode ? 'Create Admin' : 'Edit Admin'}
          </Typography>
          {(isEditLoading || isCreateAdminLoading || isUserLoading || isOrgsLoading) ? (
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
      </Grid>
    </Box>
  );
};

export default UserForm;
