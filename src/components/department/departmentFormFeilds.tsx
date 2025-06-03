import * as Yup from 'yup';
import { Field } from '../../types/form.types';

export const DepartmentFormFields: Field[] = [
    {
        name: 'organization',
        label: 'Organisation',
        type: 'select',
        required: true,
        validation: Yup.string().required('Organisation name is required'),
        disabled: true,
        options: [],
    },
    {
        name: 'departments',
        label: 'Department',
        type: 'array',
        required: true,
        validation: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Department name is required')
            })
        ).min(1, 'At least one department is required')
         .max(5, 'Maximum 5 departments allowed'),
        arrayFields: [
            {
                name: 'name',
                label: 'Department Name',
                type: 'text',
                required: true,
                placeholder: 'Enter department name',
                validation: Yup.string().required('Department name is required')
            }
        ]
    },
];
