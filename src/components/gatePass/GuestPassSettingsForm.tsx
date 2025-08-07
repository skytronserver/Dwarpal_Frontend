import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import DynamicForm from '../common/DynamicForm';
import * as Yup from 'yup';
import { Field } from '../../types/form.types';

// Predefined settings configurations
const PREDEFINED_SETTINGS = {
    regular_visitor: {
        guest_category: 'regular',
        visitor_hours_start: '09:00',
        visitor_hours_end: '17:00',
        visiting_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        holiday_restrictions: false
    },
    vip_visitor: {
        guest_category: 'vip',
        visitor_hours_start: '08:00',
        visitor_hours_end: '20:00',
        visiting_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        holiday_restrictions: true
    },
    contractor: {
        guest_category: 'contractor',
        visitor_hours_start: '08:00',
        visitor_hours_end: '18:00',
        visiting_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        holiday_restrictions: false
    },
    service_provider: {
        guest_category: 'service_provider',
        visitor_hours_start: '10:00',
        visitor_hours_end: '16:00',
        visiting_days: ['monday', 'wednesday', 'friday'],
        holiday_restrictions: false
    }
};

const GuestPassSettingsFormFields: Field[] = [
    {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: false,
        validation: Yup.string(),
    },
    {
        name: 'guest_category',
        label: 'Guest Category',
        type: 'select',
        required: true,
        validation: Yup.string().required('Guest category is required'),
        options: [
            { label: 'Vendor', value: 'Vendor' },
            { label: 'Interviewee', value: 'Interviewee' },
            { label: 'Contractor', value: 'Contractor' },
            { label: 'Visitor', value: 'Visitor' }
        ]
    },
    {
        name: 'visitor_hours_start',
        label: 'Visitor Hours Start',
        type: 'time',
        required: true,
        validation: Yup.string().required('Start time is required')
    },
    {
        name: 'visitor_hours_end',
        label: 'Visitor Hours End',
        type: 'time',
        required: true,
        validation: Yup.string().required('End time is required')
    },
    {
        name: 'visiting_days',
        label: 'Visiting Days',
        type: 'multi-select',
        required: true,
        validation: Yup.array().min(1, 'Select at least one day').required('Visiting days are required'),
        options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' }
        ]
    },
    {
        name: 'holiday_restrictions',
        label: 'Holiday Restrictions',
        type: 'checkbox',
        required: false,
        helperText: 'Allow visits on holidays'
    }
];

type SettingKey = keyof typeof PREDEFINED_SETTINGS;

interface FormValues {
    predefined_setting?: SettingKey;
    guest_category: string;
    visitor_hours_start: string;
    visitor_hours_end: string;
    visiting_days: string[];
    holiday_restrictions: boolean;
}

interface GuestPassSettingsFormProps {
    initialValues?: any;
    onSubmit: (values: any) => void;
    onCancel?: () => void;
}

const GuestPassSettingsForm: React.FC<GuestPassSettingsFormProps> = ({
    initialValues,
    onSubmit,
    onCancel
}) => {
    const [formValues, setFormValues] = useState<FormValues>(initialValues || {});

    const handleFormChange = (values: FormValues) => {
        setFormValues(values);
        
        if (values.predefined_setting && PREDEFINED_SETTINGS[values.predefined_setting]) {
            const selectedSetting = PREDEFINED_SETTINGS[values.predefined_setting];
            setFormValues(prev => ({
                ...prev,
                ...selectedSetting
            }));
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" sx={{ mb: 4 }}>
                    Guest Pass Settings
                </Typography>
                <DynamicForm
                    fields={GuestPassSettingsFormFields}
                    initialValues={formValues}
                    onSubmit={onSubmit}
                    // onChange={handleFormChange}
                />
            </Paper>
        </Box>
    );
};

export default GuestPassSettingsForm; 