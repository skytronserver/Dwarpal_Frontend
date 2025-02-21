import * as Yup from 'yup';
import { Field } from '../../types/form.types';
export const GatePassFormFields: Field[] = [
    {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        validation: Yup.string().required('Name is required'),
    },
    {
        name: 'photo',
        label: 'Photo',
        type: 'file',
        required: true,
        validation: Yup.mixed().required('Photo is required'),
    },
    {
        name: 'visit_date',
        label: 'Visit Date',
        type: 'date',
        required: true,
        validation: Yup.date().required('Visit date is required'),
    },
    {
        name: 'start_time',
        label: 'Start Time',
        type: 'time',
        required: true,
        validation: Yup.string().required('Start time is required'),
    },
    {
        name: 'end_time',
        label: 'End Time',
        type: 'time',
        required: true,
        validation: Yup.string().required('End time is required'),
    },
    {
        name: 'organization',
        label: 'Organization',
        type: 'select',
        required: true,
        validation: Yup.number().required('Organization is required'),
    },
    {
        name: 'department',
        label: 'Department',
        type: 'select',
        required: true,
        validation: Yup.number().required('Department is required'),
    },
    {
        name: 'person_to_meet',
        label: 'Person to Meet',
        type: 'text',
        required: true,
        validation: Yup.string().required('Person to meet is required'),
    }
]
