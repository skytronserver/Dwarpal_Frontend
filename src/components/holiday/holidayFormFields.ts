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
        name: 'holiday_type',
        label: 'Holiday Type',
        type: 'select',
        required: true,
        options: [
            { label: 'Public', value: 'public' },
            { label: 'Company', value: 'company' },
        ],
    },
    {
        name: 'holiday_dates',
        label: 'Holiday Dates',
        type: 'multidate',
        required: true,
        validation: Yup.array()
            .of(Yup.string())
            .min(1, 'At least one holiday date is required')
            .required('Holiday dates are required'),
    },
]; 