import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box } from '@mui/material';
import { useErrorToast, useSuccessToast } from '../../components/Toast';

import { individualServiceProviderFormFields } from '../../components/service-provider/individualServiceProviderFormFeilds';
import { individualServiceProviderFormValues, useCreateIndividualMutation } from '../../services/serviceProviderService';

interface ServiceProviderFormProps {
  onSuccess?: () => void;
}


const ServiceProviderForm: React.FC<ServiceProviderFormProps> = ({ onSuccess }) => {
  const { id } = useParams();
  const location = useLocation();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const navigate = useNavigate();
  const [createIndividual] = useCreateIndividualMutation();
  const isCreateMode = location.pathname.includes('/new');
  const validEditId = !isCreateMode && id ? parseInt(id) : undefined;

  const [values, setValues] = React.useState<individualServiceProviderFormValues>(() => ({
    name: '',
    email: '',
    phone: '',
    service_provider_type: '',
    service_type: ''
  }));

  const handleFieldChange = (values: Record<string, any>) => {
    const newValues = {
      ...values
    } as individualServiceProviderFormValues;
    console.log('Field changed:', newValues);
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  };


  const handleSubmit = async (values: individualServiceProviderFormValues) => {
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

      // TODO: Replace with actual API mutations when available
      if (validEditId) {
        // const response = await editServiceProvider({
        //   id: validEditId,
        //   formData
        // }).unwrap();
        // showSuccessToast(response?.message || '');
        onSuccess?.();
      } else {
        const response = await createIndividual(formData).unwrap();
        showSuccessToast(response?.message || 'Sent For Approval');
        navigate('/service-providers');
      }
    } catch (error: any) {
      console.error('Error handling service provider:', error);
      showErrorToast(error?.data?.message || '');
    }
  };



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {validEditId ? 'Edit Individual Service Provider' : 'Create Individual Service Provider'}
      </Typography>
      <DynamicForm
        fields={individualServiceProviderFormFields}
        onSubmit={handleSubmit}
        initialValues={values}
        onChange={handleFieldChange}
      />
    </Box>
  );
};

export default ServiceProviderForm;
