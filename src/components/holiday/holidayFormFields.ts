import * as Yup from 'yup';
import { Field } from '../../types/form.types';

export const HolidayFormFields: Field[] = [
    {
        name: 'holiday_name',
        label: 'Holiday Name',
        type: 'text',
        required: true,
        validation: Yup.string()
            .min(2, 'Holiday name must be at least 2 characters')
            .max(100, 'Holiday name must not exceed 100 characters')
            .required('Holiday name is required'),
    },
    {
        name: 'holiday_from_date',
        label: 'Start Date',
        type: 'date',
        required: true,
        validation: Yup.string()
            .required('Start date is required'),
    },
    {
        name: 'holiday_to_date',
        label: 'End Date',
        type: 'date',
        required: true,
        validation: Yup.string()
            .required('End date is required'),
    },
    {
        name: 'description',
        label: 'Description',
        type: 'text',
        required: true,
        validation: Yup.string()
            .min(3, 'Description must be at least 3 characters')
            .max(200, 'Description must not exceed 200 characters')
            .required('Description is required'),
    },
    {
        name: 'is_verified',
        label: 'Is Verified',
        type: 'checkbox',
        required: false,
        validation: Yup.boolean(),
    }
]; 