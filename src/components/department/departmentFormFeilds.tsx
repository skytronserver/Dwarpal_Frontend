import * as Yup from 'yup';
import { Field } from '../../types/form.types';

export const DepartmentFormFields: Field[] = [
    {
        name: 'organization_id',
        label: 'Organisation',
        type: 'select',
        required: true,
        validation: Yup.string().required('Organisation name is required'),
        disabled: true,
        options: [],
    },
    {
        name: 'name',
        label: 'Department Name',
        type: 'text',
        required: true,
        placeholder: 'Enter department name',
        validation: Yup.string().required('Department name is required')
    }
];
