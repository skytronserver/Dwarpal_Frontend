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
        name: 'visit_start_time',
        label: 'Start Time',
        type: 'time',
        required: true,
        validation: Yup.string().required('Start time is required'),
    },
    {
        name: 'visit_end_time',
        label: 'End Time',
        type: 'time',
        required: true,
        validation: Yup.string().required('End time is required'),
    },
    {
        name: 'organization_to_visit',
        label: 'Organisation',
        type: 'select',
        required: true,
        validation: Yup.number().required('Organisation is required'),
    },
    {
        name: 'department_to_visit',
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
    },{
        name:'assigned_approver',
        label:'Assigned Approver',
        type:'select',
        required:true,
        validation:Yup.number().required('Assigned approver is required'),
    }
]
