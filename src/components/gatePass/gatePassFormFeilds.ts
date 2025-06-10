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
        name: 'contact_number',
        label: 'Contact Number',
        type: 'text',
        required: true,
        validation: Yup.string()
            .matches(/^[0-9]{10,15}$/, 'Enter a valid phone number')
            .required('Contact number is required'),
    },
    {
        name: 'email',
        label: 'Email Address',
        type: 'text',
        required: true,
        validation: Yup.string().email('Enter a valid email').required('Email is required'),
    },
    {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        required: false,
        options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' }
        ],
        validation: Yup.string(),
    },
    {
        name: 'date_of_birth',
        label: 'Date of Birth',
        type: 'date',
        required: false,
        validation: Yup.date(),
    },
    {
        name: 'address',
        label: 'Address',
        type: 'text',
        required: false,
        validation: Yup.string(),
    },
    {
        name: 'district',
        label: 'District',
        type: 'text',
        required: false,
        validation: Yup.string(),
    },
    {
        name: 'state',
        label: 'State',
        type: 'text',
        required: false,
        validation: Yup.string(),
    },
    {
        name: 'pincode',
        label: 'Pincode',
        type: 'text',
        required: false,
        validation: Yup.string(),
    },
    // {
    //     name: 'company_name',
    //     label: 'Company/Organization Name',
    //     type: 'text',
    //     required: false,
    //     validation: Yup.string(),
    // },
    // {
    //     name: 'designation',
    //     label: 'Designation/Role',
    //     type: 'text',
    //     required: false,
    //     validation: Yup.string(),
    // },
    {
        name: 'emergency_contact_number',
        label: 'Emergency Contact Number',
        type: 'text',
        required: false,
        validation: Yup.string().matches(/^[0-9]{10,15}$/, 'Enter a valid phone number'),
    },
    {
        name: 'emergency_contact_name',
        label: 'Emergency Contact Name',
        type: 'text',
        required: false,
        validation: Yup.string(),
    },
    {
        name: 'id_proof_no',
        label: 'ID Proof Number(Voter Id,Passport,Driving lisense or any Govt Id)',
        type: 'text',
        required: true,
        validation: Yup.string().required('ID proof no is required')
      },  {
        name: 'id_proof_document',
        label: 'ID Proof Document(Voter Id,Passport,Driving lisense or any Govt Id)',
        type: 'file',
        required: true,
        validation: Yup.mixed().required('ID proof document is required'),
        accept: '.pdf,.doc,.docx'
      },
    {
        name: 'employee_visitor_type',
        label: 'Guest Setting',
        type: 'select',
        required: true,
        options: [
            { label: 'Guest setting 1', value: 'guest_setting_1' },
            { label: 'Guest setting 2', value: 'guest_setting_2' },
            { label: 'Guest setting 3', value: 'guest_setting_3' },
            { label: 'Guest setting 4', value: 'guest_setting_4' }
        ],
        validation: Yup.string().required('Type is required'),
    },
    {
        name: 'access_validity_start',
        label: 'Access Valid From',
        type: 'date',
        required: false,
        validation: Yup.date(),
    },
    {
        name: 'access_validity_end',
        label: 'Access Valid To',
        type: 'date',
        required: false,
        validation: Yup.date(),
    }, 
    {
        name: 'start_time',
        label: 'Start Time',
        type: 'time',
        required: false,
        validation: Yup.string(),
    },
    {
        name: 'end_time',
        label: 'End Time',
        type: 'time',
        required: false,
        validation: Yup.string(),
    },
    {
        name: 'organization_to_visit',
        label: 'Organization',
        type: 'select',
        disabled: true,
        required: true,
        validation: Yup.number().required('Organization is required'),
    },
    {
        name: 'department_to_visit',
        label: 'Department',
        type: 'multi-select',
        required: true,
        options: [{ label: 'Department 1', value: 1 }, { label: 'Department 2', value: 2    }],
        validation: Yup.array().of(Yup.number()).required('Department is required'),
    },
    {
        name: 'person_to_meet',
        label: 'Person to Meet',
        type: 'text',
        required: true,
        validation: Yup.string().required('Person to meet is required'),
    },
    {
        name: 'purpose',
        label: 'Purpose of Visit',
        type: 'text',
        required: true,
        validation: Yup.string().required('Purpose is required'),
    },
    {
        name: 'notes',
        label: 'Notes / Remarks',
        type: 'text',
        required: false,
        validation: Yup.string(),
    },
  
]
