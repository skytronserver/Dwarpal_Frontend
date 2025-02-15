import { Box, Typography, CircularProgress } from "@mui/material";
import DynamicForm from "../../components/common/DynamicForm";
import { AssignShiftFormFields } from "../../components/shift/ShiftFormFeilds";
import { useAssignShiftMutation } from "../../services/shiftApi";

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

    const handleSubmit = async (values: ShiftFormValues) => {
        try {
                console.log(values);

            await assignShift({ 
                id: values.shift_id, 
                data: values 
            }).unwrap();
        } catch (err) {
            console.error('Failed to assign shift:', err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Assign Shift
            </Typography>
            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    Failed to assign shift. Please try again.
                </Typography>
            )}
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
