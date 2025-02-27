import * as Yup from 'yup';

export interface Field {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    options?: Array<{ label: string; value: any }>;
    validation?: Yup.Schema;
    defaultValue?: any;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    helperText?: string;
    component?: ({ value, onChange }: { value: any; onChange: (value: any) => void }) => JSX.Element;
    showIf?: (values: Record<string, any>) => boolean;
}
export interface DynamicFormProps {    
    fields: Field[];
    onSubmit: any;
    initialValues?: Record<string, any>;
    onChange?: (values: Record<string, any>) => void;
}