import { Box, Typography, CircularProgress } from "@mui/material";
import DynamicForm from "../../components/common/DynamicForm";
import { AssignShiftFormFields } from "../../components/shift/ShiftFormFeilds";
import { useAssignShiftMutation } from "../../services/shiftApi";
import { useSuccessToast, useErrorToast } from "../../components/Toast";
import { useNavigate } from "react-router-dom";

export interface ShiftFormValues {
  shift_id: number;
  user_id: number;
  weekly_holiday: string[];
  government_holiday_applicable: boolean;
  earned_leave_qty: number;
  paid_leave_qty: number;
  casual_leave_qty: number;
  applicable_from: string;
}

const AssignShiftForm = () => {
    const [assignShift, { isLoading, error }] = useAssignShiftMutation();
    const showSuccessToast = useSuccessToast();
    const showErrorToast = useErrorToast();
    const navigate = useNavigate();

    const handleSubmit = async (values: ShiftFormValues) => {
        try {
            const response = await assignShift({ 
                id: values.shift_id, 
                data: values 
            }).unwrap();
            showSuccessToast('Shift assigned successfully');
            navigate('/shifts');
        } catch (err: any) {
            console.error('Failed to assign shift:', err);
            showErrorToast(err?.data?.message || 'Failed to assign shift');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Assign Shift
            </Typography>
            {isLoading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <DynamicForm 
                    fields={AssignShiftFormFields} 
                    onSubmit={handleSubmit}
                />
            )}
        </Box>
    );
};

export default AssignShiftForm;
