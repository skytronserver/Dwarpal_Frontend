import React from 'react';
import { useNavigate } from 'react-router-dom';
import GuestPassSettingsForm from '../../components/gatePass/GuestPassSettingsForm';
import { useSuccessToast, useErrorToast } from '../../components/Toast';
import { useGuestPassSettingsMutation } from '../../services/gatePassApi';

const GuestPassSettings: React.FC = () => {
    const navigate = useNavigate();
    const showSuccessToast = useSuccessToast();
    const showErrorToast = useErrorToast();
    const [guestPassSettings] = useGuestPassSettingsMutation();
    const handleSubmit = async (values: any) => {
        try {
            const response = await guestPassSettings(values).unwrap();
            console.log('Guest pass settings saved successfully:', response);
            showSuccessToast(response?.message || '');
            navigate('/reports/guest-pass');
        } catch (error: any) {
            console.error('Error saving settings:', error);
            showErrorToast(error?.data?.detail || '');
        }
    };

    const handleCancel = () => {
        navigate('/reports/guest-pass');
    };

    return (
        <GuestPassSettingsForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
};

export default GuestPassSettings; 