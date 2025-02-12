import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useCreateUserMutation, useUpdateUserMutation } from '../../services/UserApi';
import { UserFormFields } from '../../components/user/userFormFields';
import { Organisation, useGetOrganisationsQuery } from '../../services/OrganisationApi';
import { useGetDepartmentsQuery } from '../../services/DepartmentApi';

interface UserFormProps {
  onSuccess?: () => void;
}

interface UserFormValues {
  id?: string;
  [key: string]: any;
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const { userId } = useParams();
  const location = useLocation();
  const initialData = location.state?.userData;
  const [editUser, { isLoading: isEditLoading }] = useUpdateUserMutation();
  const [createUser, { isLoading: isCreateLoading }] = useCreateUserMutation();
  const navigate = useNavigate();

  // Fetch organizations and departments for dropdowns
  const { data: organizations, isLoading: isOrgsLoading } = useGetOrganisationsQuery({});
  const { data: departments, isLoading: isDepsLoading } = useGetDepartmentsQuery({});

  const organizationOptions = organizations?.results?.map((org: Organisation) => ({
    label: org.name,
    value: org.id
  })) || [];

  const departmentOptions = departments?.results?.map((dep: any) => ({
    label: dep.name,
    value: dep.id
  })) || [];

  // Modify initial data to match the form structure
  const modifiedInitialData = React.useMemo(() => {
    if (!initialData) {
      return null;
    }

    return {
      ...initialData,
      organization: typeof initialData.organization === 'string'
        ? organizationOptions.find(option => option.label === initialData.organization)?.value
        : initialData.organization,
      department: typeof initialData.department === 'string'
        ? departmentOptions.find(option => option.label === initialData.department)?.value
        : initialData.department
    };
  }, [initialData, organizationOptions, departmentOptions]);

  // Update form fields with dynamic options
  const formFields = React.useMemo(() => {
    return UserFormFields.map(field => {
      if (field.name === 'organization') {
        return {
          ...field,
          options: organizationOptions
        };
      }
      if (field.name === 'department') {
        return {
          ...field,
          options: departmentOptions
        };
      }
      return field;
    });
  }, [organizationOptions, departmentOptions]);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'photo' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (initialData && userId) {
        const response = await editUser({
          id: userId,
          formData
        }).unwrap();
        console.log('User updated successfully:', response);
        onSuccess?.();
      } else {
        const response = await createUser(formData).unwrap();
        console.log('User created successfully:', response);
        navigate('/users');
      }
    } catch (error) {
      console.error('Error handling user:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {initialData ? 'Edit User' : 'Create User'}
      </Typography>
      {(isEditLoading || isCreateLoading || isOrgsLoading || isDepsLoading) ? (
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
    </Box>
  );
};

export default UserForm;
