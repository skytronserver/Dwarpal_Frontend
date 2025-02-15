import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useCreateShiftMutation, useEditShiftMutation } from '../../services/shiftApi';
import ShiftFormFields from '../../components/shift/ShiftFormFeilds';


interface ShiftFormProps {
  onSuccess?: () => void;
}

interface ShiftFormValues {
  id?: string;
  [key: string]: any;
}

const ShiftForm: React.FC<ShiftFormProps> = ({ onSuccess }) => {
    const { shiftId } = useParams();
    const location = useLocation();
    const initialData = location.state?.shiftData;
    const [editShift, { isLoading: isEditLoading }] = useEditShiftMutation();
    const [createShift, { isLoading: isCreateLoading }] = useCreateShiftMutation();
    const navigate = useNavigate();
        

    const handleSubmit = async (values: ShiftFormValues) => {
        const shifts = new FormData();
        Object.keys(values).forEach(key => {
            if (values[key] !== null && values[key] !== undefined) {
                if (typeof values[key] === 'boolean') {
                    shifts.append(key, values[key] ? 'True' : 'False');
                } else {
                    shifts.append(key, values[key]);
                }
            }
        });
        
        try {
            if (initialData && shiftId) {
                await editShift({ 
                    id: parseInt(shiftId), 
                    data: shifts 
                }).unwrap();
                onSuccess?.();
            } else {
                await createShift(shifts).unwrap();
                navigate('/shifts');
            }
        } catch (error) {
            console.error('Error handling shift:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {initialData ? 'Edit Shift' : 'Create Shift'}
            </Typography>
            {isEditLoading || isCreateLoading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <DynamicForm    
                    fields={ShiftFormFields} 
                    onSubmit={handleSubmit}
                    initialValues={initialData} 
                />
            )}
        </Box>
    );
};

export default ShiftForm;