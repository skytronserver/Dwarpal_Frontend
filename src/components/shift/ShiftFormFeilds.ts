import { Field } from "../../types/form.types";
import * as Yup from 'yup';

const ShiftFormFields: Field[] = [
    {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        validation: Yup.string().required('Name is required'),
    },
    {
        name: 'description',
        label: 'Description',
        type: 'text',
        required: true,
        validation: Yup.string().required('Description is required'),
    },
    {
        name: 'start_time',
        label: 'Start Time',
        type: 'time',
        required: true,
        validation: Yup.string().required('Start Time is required'),
    },
    {
        name: 'end_time',
        label: 'End Time',
        type: 'time',
        required: true,
        validation: Yup.string().required('End Time is required'),
    },
    {
        name: 'is_active',
        label: 'Is Active',
        type: 'checkbox',
        required: true,
        validation: Yup.boolean().required('Is Active is required'),
    },
    {
        name: 'is_deleted',
        label: 'Is Deleted',
        type: 'checkbox',
        required: true,
        validation: Yup.boolean().required('Is Deleted is required'),
    },
];  

export default ShiftFormFields;


const AssignShiftFormFields: Field[] = [
    {
        name: 'employee_id',
        label: 'Employee ID',
        type: 'text',
        required: true,
        validation: Yup.string().required('Employee ID is required'),
    },
    {
        name: 'shift_id',
        label: 'Shift ID',
        type: 'number',
        required: true,
        validation: Yup.number().required('Shift ID is required'),
    },
    {
        name: 'weekly_holiday',
        label: 'Weekly Holidays',
        type: 'multiselect',
        options: [
            { label: 'Monday', value: 'Monday' },
            { label: 'Tuesday', value: 'Tuesday' },
            { label: 'Wednesday', value: 'Wednesday' },
            { label: 'Thursday', value: 'Thursday' },
            { label: 'Friday', value: 'Friday' },
            { label: 'Saturday', value: 'Saturday' },
            { label: 'Sunday', value: 'Sunday' }
        ],
        required: true,
        validation: Yup.array().of(Yup.string()).required('Weekly holidays are required'),
    },
    {
        name: 'government_holiday_applicable',
        label: 'Government Holiday Applicable',
        type: 'checkbox',
        required: true,
        validation: Yup.boolean().required('Government holiday applicability is required'),
    },
    {
        name: 'earned_leave_qty',
        label: 'Earned Leave Quantity',
        type: 'number',
        required: true,
        validation: Yup.number().min(0).required('Earned leave quantity is required'),
    },
    {
        name: 'paid_leave_qty',
        label: 'Paid Leave Quantity',
        type: 'number',
        required: true,
        validation: Yup.number().min(0).required('Paid leave quantity is required'),
    },
    {
        name: 'casual_leave_qty',
        label: 'Casual Leave Quantity',
        type: 'number',
        required: true,
        validation: Yup.number().min(0).required('Casual leave quantity is required'),
    },
    {
        name: 'applicable_from',
        label: 'Applicable From',
        type: 'date',
        required: true,
        validation: Yup.date().required('Applicable from date is required'),
    }
];

export { ShiftFormFields, AssignShiftFormFields };       

