import * as Yup from 'yup';

export interface Field {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: Array<{ label: string; value: any }>;
    validation?: Yup.Schema;
    defaultValue?: any;
    accept?: string;
    multiple?: boolean;
}
export interface DynamicFormProps {    
    fields: Field[];
    onSubmit: any;
    initialValues?: Record<string, any>;
}