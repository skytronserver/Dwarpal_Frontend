import React from 'react';
import { Typography, Box } from '@mui/material';
import DynamicForm from '../../components/common/DynamicForm';
import { UserFormFields } from '../../components/Individual/individualUserFormFeilds';
import { useSuccessToast, useErrorToast } from '../../components/Toast';

interface IndividualUserFormValues {
  name: string;
  blood_group: string;
  emergency_contact: string;
  photo?: File;
  password: string;
  kyc_document?: File;
}

const IndividualUserForm: React.FC = () => {
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();

  const handleSubmit = async (values: IndividualUserFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if ((key === 'photo' || key === 'kyc_document') && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      console.log(formData);
      // TODO: Add API integration here
      showSuccessToast('Individual user created successfully!');
    } catch (error: any) {
      console.error('Error creating individual user:', error);
      showErrorToast(error?.data?.message || 'Failed to create individual user');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Individual User
      </Typography>
      <DynamicForm
        fields={UserFormFields}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default IndividualUserForm;
