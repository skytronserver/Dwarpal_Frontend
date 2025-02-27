import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { OrganisationFormFields } from '../../components/organisation/organisationFormFeilds';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useCreateOrganisationMutation, useEditOrganisationMutation, useGetOrganisationByIdQuery } from '../../services/OrganisationApi';

interface OrganisationFormProps {
  onSuccess?: () => void;
}

interface OrganisationFormValues {
  id?: string;
  [key: string]: any;
}

const OrganisationForm: React.FC<OrganisationFormProps> = ({ onSuccess }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading: isDataLoading } = useGetOrganisationByIdQuery(
        parseInt(id as string),
        { skip: !id }
    );
    const isEditMode = Boolean(id && id !== ':id' && !isNaN(parseInt(id)));
    const organisationData = data?.data;
    const [editOrganisation, { isLoading: isEditLoading }] = useEditOrganisationMutation();
    const [createOrganisation, { isLoading: isCreateLoading }] = useCreateOrganisationMutation();
        

    const handleSubmit = async (values: OrganisationFormValues) => {
        console.log('Submit triggered with values:', values);
        
        const orgs = new FormData();
        Object.keys(values).forEach(key => {
            if (values[key] !== null && values[key] !== undefined) {
                if (typeof values[key] === 'boolean') {
                    orgs.append(key, values[key] ? 'True' : 'False');
                } else {
                    orgs.append(key, values[key]);
                }
            }
        });
        
        try {
            if (isEditMode) {
                console.log('Executing edit operation with ID:', id);
                await editOrganisation({ 
                    id: parseInt(id!), 
                    data: orgs 
                }).unwrap();
                onSuccess?.();
            } else {
                console.log('Executing create operation');
                await createOrganisation(orgs).unwrap();
                navigate('/organisations');
            }
        } catch (error) {
            console.error('Error handling organisation:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {isEditMode ? 'Edit Organization' : 'Create Organization'}
            </Typography>
            {(isEditLoading || isCreateLoading || isDataLoading) ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <DynamicForm 
                    fields={OrganisationFormFields} 
                    onSubmit={handleSubmit}
                    initialValues={organisationData} 
                />
            )}
        </Box>
    );
};

export default OrganisationForm;