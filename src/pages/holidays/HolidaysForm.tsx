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
    holiday_dates: string[];
    holiday_type: string;
    [key: string]: any;
}

const HolidayForm: React.FC<HolidayFormProps> = ({ onSuccess }) => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const initialData = location.state?.holidayData;
    
    const isEditMode = Boolean(id && id !== ':id' && !isNaN(parseInt(id)));
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
            formData.append('holiday_dates', JSON.stringify(values.holiday_dates));
            formData.append('holiday_type', values.holiday_type);

            if (isEditMode) {
                await editHoliday({
                    id: parseInt(id!),
                    data: formData
                }).unwrap();
                onSuccess?.();
            } else {
                console.log(formData);
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
                {isEditMode ? 'Edit Holiday' : 'Create Holiday'}
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
