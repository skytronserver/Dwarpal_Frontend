import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress } from '@mui/material';
import { HolidayFormFields } from '../../components/holiday/holidayFormFields';
import { useCreateHolidayMutation, useEditHolidayMutation, useGetHolidayByIdQuery } from '../../services/holidayApi';

interface HolidayFormProps {
    onSuccess?: () => void;
}

interface HolidayFormValues {
    id?: string;
    holiday_name: string;
    holiday_from_date: string;
    holiday_to_date: string;
    description: string;
    is_verified?: boolean;
    [key: string]: any;
}

const HolidayForm: React.FC<HolidayFormProps> = ({ onSuccess }) => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const initialData = location.state?.holidayData;
    
    const { data: holidayData, isLoading: isLoadingHoliday } = useGetHolidayByIdQuery(
         parseInt(id!),
        { skip: !id }
    );
    const [createHoliday, { isLoading: isCreateLoading }] = useCreateHolidayMutation();
    const [editHoliday, { isLoading: isEditLoading }] = useEditHolidayMutation();

    const handleSubmit = async (values: HolidayFormValues) => {
        try {
            const formData = new FormData();
            
            formData.append('holiday_name', values.holiday_name);
            formData.append('holiday_from_date', values.holiday_from_date);
            formData.append('holiday_to_date', values.holiday_to_date);
            formData.append('description', values.description);
            
            if (values.is_verified !== undefined) {
                formData.append('is_verified', values.is_verified ? 'True' : 'False');
            }

            if (id) {
                await editHoliday({
                    id: parseInt(id),
                    data: formData
                }).unwrap();
                onSuccess?.();
            } else {
                await createHoliday(formData).unwrap();
                navigate('/holidays');
            }
        } catch (error) {
            console.error('Error handling holiday:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {id ? 'Edit Holiday' : 'Create Holiday'}
            </Typography>
            {(isEditLoading || isCreateLoading || isLoadingHoliday) ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <DynamicForm
                    fields={HolidayFormFields}
                    onSubmit={handleSubmit}
                        initialValues={holidayData || initialData || {}}
                />
            )}
        </Box>
    );
};

export default HolidayForm;
