import * as Yup from 'yup';
import { Field } from '../../types/form.types';

export const DepartmentFormFields: Field[] = [
    {
        name: 'name',
        label: 'Department Name',
        type: 'text',
        required: true,
        validation: Yup.string().required('Department name is required')
    },
    {
        name: 'organization',
        label: 'Organisation',
        type: 'select',
        required: true,
        validation: Yup.string().required('Organisation name is required'),
        options: []
    },
    {
        name: 'integrate_with_ai_camera',
        label: 'Integrated with AI camera',
        type: 'checkbox',
        required: true,
        validation: Yup.boolean().required('AI camera integration is required')
    }
];
