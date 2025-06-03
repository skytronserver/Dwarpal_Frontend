import React from 'react';
// import { useNavigate } from 'react-router-dom'; 
import { Typography, Box } from '@mui/material';
import DynamicForm from '../../components/common/DynamicForm';
import { AccountsUserFormFields } from '../../components/accounts/accountsUserFormFields';
// import { useCreateUserMutation } from '../../services/UserApi';
import { useSuccessToast, useErrorToast } from '../../components/Toast';

interface AccountUserFormValues {
  name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  id_proof_number: string;
  id_proof_image: File;
  password: string;
}
const AccountUserForm: React.FC = () => {
  // const navigate = useNavigate();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  // const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (values: AccountUserFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'id_proof_image' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      console.log(formData);
      // const response = await createUser(formData).unwrap();
      showSuccessToast('Account created successfully!');
      // navigate('/login'); // Redirect to login page after successful registration
    } catch (error: any) {
      console.error('Error creating account:', error);
      showErrorToast(error?.data?.message || 'Failed to create account');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Accounts User
      </Typography>
      {/* {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : ( */}
        <DynamicForm
          fields={AccountsUserFormFields}
          onSubmit={handleSubmit}
        />         
    </Box>
  );
};

export default AccountUserForm;
