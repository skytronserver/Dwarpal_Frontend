import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress } from '@mui/material';
import { GatePassFormFields } from '../../components/gatePass/gatePassFormFeilds';
interface GatePassFormProps {
  onSuccess?: () => void;
}

interface GatePassFormValues {
  id?: string;
  [key: string]: any;
}

const GatePassForm: React.FC<GatePassFormProps> = ({ onSuccess }) => {
    const { gatepassId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const initialData = location.state?.gatepassData;

    // Temporary mock data for organization options
    const organizationOptions = [
        { label: 'Organization 1', value: '1' },
        { label: 'Organization 2', value: '2' },
    ];

    const formFields = React.useMemo(() => {
        return GatePassFormFields.map(field => {
            if (field.name === 'organization') {
                return {
                    ...field,
                    options: organizationOptions
                };
            }
            return field;
        });
    }, [organizationOptions]);

    const handleSubmit = async (values: GatePassFormValues) => {
        // For now, just log the values and navigate
        console.log('Form Values:', values);
        navigate('/gate-passes');
        onSuccess?.();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {initialData ? 'Edit Gate Pass' : 'Create Gate Pass'}
            </Typography>
            <DynamicForm 
                fields={formFields}
                onSubmit={handleSubmit}
                initialValues={initialData || {}}
            />
        </Box>
    );
};

export default GatePassForm;