import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DynamicForm from '../../components/common/DynamicForm';
import { Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useCreateShiftMutation, useEditShiftMutation, useGetShiftByIdQuery, useGetShiftsQuery } from '../../services/shiftApi';
import ShiftFormFields from '../../components/shift/ShiftFormFeilds';
import { useSuccessToast, useErrorToast } from '../../components/Toast';

interface ShiftFormProps {
    onSuccess?: () => void;
}

interface ShiftFormValues {
    id?: string;
    [key: string]: any;
}

const calculateTotalWorkTime = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return '';

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);

    // Handle overnight shifts
    if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} hours ${minutes} minutes`;
};

const calculateWorkingHours = (values: ShiftFormValues): { normal: string; holiday: string } => {
    const totalTime = calculateTotalWorkTime(values.shift_start_time, values.shift_end_time);
    
    // Parse working days if it's a string
    let workingDays: string[] = [];
    if (typeof values.working_days === 'string') {
        try {
            workingDays = JSON.parse(values.working_days);
        } catch {
            workingDays = values.working_days.split(',').map(day => day.trim());
        }
    } else if (Array.isArray(values.working_days)) {
        workingDays = values.working_days;
    }
    
    if (!totalTime || !workingDays.length) return { normal: '', holiday: '' };

    // Robustly extract hours and minutes
    const hoursMatch = totalTime.match(/(\d+) hours?/);
    const minutesMatch = totalTime.match(/(\d+) minutes?/);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    const normalDays = workingDays.filter(day => 
        !['Saturday', 'Sunday'].includes(day)
    ).length;
    
    const holidayDays = workingDays.filter(day => 
        ['Saturday', 'Sunday'].includes(day)
    ).length;

    const normalMinutes = (hours * 60 + minutes) * normalDays;
    const holidayMinutes = (hours * 60 + minutes) * holidayDays;

    return {
        normal: `${Math.floor(normalMinutes / 60)} hours ${normalMinutes % 60} minutes`,
        holiday: `${Math.floor(holidayMinutes / 60)} hours ${holidayMinutes % 60} minutes`
    };
};

const ShiftForm: React.FC<ShiftFormProps> = ({ onSuccess }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const showSuccessToast = useSuccessToast();
    const showErrorToast = useErrorToast();

    const { data: shiftData, isLoading: isLoadingShift } = useGetShiftByIdQuery(
        parseInt(id!),
        { skip: !id }
    );
    const { data: shiftsList, isLoading: isLoadingShifts } = useGetShiftsQuery({ page: 1, page_size: 10 });
    const isEditMode = Boolean(id && id !== ':id' && !isNaN(parseInt(id)));
    const [editShift, { isLoading: isEditLoading }] = useEditShiftMutation();
    const [createShift, { isLoading: isCreateLoading }] = useCreateShiftMutation();

    const handleSubmit = async (values: ShiftFormValues) => {
        // Check for duplicate shifts
        const isDuplicate = shiftsList?.results?.some((shift: any) => {
            if (shift.id === values.id) return false; // Skip current shift in edit mode
            return (
                shift.shift_start_time === values.shift_start_time &&
                shift.shift_end_time === values.shift_end_time &&
                JSON.stringify(shift.working_days) === JSON.stringify(values.working_days)
            );
        });

        if (isDuplicate) {
            showErrorToast('A shift with the same working hours and days already exists');
            return;
        }

        const shifts = new FormData();
        Object.keys(values).forEach(key => {
            if (values[key] !== null && values[key] !== undefined) {
                if (typeof values[key] === 'boolean') {
                    shifts.append(key, values[key] ? 'True' : 'False');
                } else if (Array.isArray(values[key])) {
                    shifts.append(key, JSON.stringify(values[key]));
                } else {
                    shifts.append(key, values[key]);
                }
            }
        });
        
        try {
            if (isEditMode) {
                await editShift({ 
                    id: parseInt(id!), 
                    data: shifts 
                }).unwrap();
                onSuccess?.();
                showSuccessToast('Shift updated successfully');
            } else {
                await createShift(shifts).unwrap();
                navigate('/shifts');
                showSuccessToast('Shift created successfully');
            }
        } catch (error: any) {
            console.error('Error handling shift:', error);
            showErrorToast(error?.data?.message || '');
        }
    };

    const handleFormChange = (values: Record<string, any>) => {
        const { shift_start_time, shift_end_time, working_days } = values;
        if (shift_start_time && shift_end_time) {
            const totalWorkTime = calculateTotalWorkTime(shift_start_time, shift_end_time);
            values.total_work_time = totalWorkTime;

            if (working_days) {
                const { normal, holiday } = calculateWorkingHours(values);
                values.normal_working_hours = normal;
                values.holiday_working_hours = holiday;
            }
        }
    };

    return (
        <>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    {isEditMode ? 'Edit Shift' : 'Create Shift'}
                </Typography>
                {(isEditLoading || isCreateLoading || isLoadingShift) ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <DynamicForm
                        fields={ShiftFormFields}
                        onSubmit={handleSubmit}
                        initialValues={shiftData}
                        onChange={handleFormChange}
                    />
                )}
            </Box>
            <Box sx={{ p: 3 }}>
                {/* <Typography variant="h5" sx={{ mb: 2 }}>
                    Existing Shifts
                </Typography> */}
                {isLoadingShifts ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Shift Name</TableCell>
                                    <TableCell>Working Days</TableCell>
                                    <TableCell>Start Time</TableCell>
                                    <TableCell>End Time</TableCell>
                                    <TableCell>Total Work Time</TableCell>
                                    <TableCell>Holiday Shift</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shiftsList?.results?.map((shift: any) => (
                                    <TableRow key={shift.id}>
                                        <TableCell>{shift.shift_name}</TableCell>
                                        <TableCell>{Array.isArray(shift.working_days) ? shift.working_days.join(', ') : shift.working_days}</TableCell>
                                        <TableCell>{shift.shift_start_time}</TableCell>
                                        <TableCell>{shift.shift_end_time}</TableCell>
                                        <TableCell>{shift.total_work_time}</TableCell>
                                        <TableCell>{shift.is_holiday_shift ? 'Yes' : 'No'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </>
    );
};

export default ShiftForm;