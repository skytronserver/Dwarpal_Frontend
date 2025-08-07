import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Typography, Box, CircularProgress } from '@mui/material';
// import { useAuth } from '../../hooks/useAuth'; // Uncomment when role-based features are needed
import DynamicForm from '../../components/common/DynamicForm';
import { SubscriptionFormFields } from '../../components/subscription/subscriptionFormFields';
import { useSuccessToast, useErrorToast } from '../../components/Toast';
import { SubscriptionFormValues, useCreateSubscriptionMutation } from '../../services/subscriptionService';

interface SubscriptionFormProps {
  onSuccess?: () => void;
}



const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ onSuccess }) => {
  // const { hasRole } = useAuth(); // Uncomment when role-based features are needed
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const showSuccessToast = useSuccessToast();
  const showErrorToast = useErrorToast();
  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();

  const isCreateMode = location.pathname.includes('/new');
  const validEditId = !isCreateMode && id ? parseInt(id) : undefined;

  const handleSubmit = async (values: SubscriptionFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'privileges') {
            // Convert array to JSON string for privileges
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (validEditId) {
        // TODO: Add edit subscription API integration
        showSuccessToast('Subscription updated successfully!');
      } else {
        const response = await createSubscription(formData).unwrap();
        console.log(response);
        showSuccessToast('Subscription created successfully!');
        
      }
    } catch (error: any) {
      console.error('Error handling subscription:', error);
      showErrorToast(error?.data?.message || `Failed to ${validEditId ? 'update' : 'create'} subscription`);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {validEditId ? 'Edit Subscription' : 'Create Subscription'}
      </Typography>
      <DynamicForm
        fields={SubscriptionFormFields}
        onSubmit={handleSubmit}
        initialValues={{}}
      />
    </Box>
  );
};

export default SubscriptionForm;
