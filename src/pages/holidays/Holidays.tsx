import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGetHolidaysQuery, useEditHolidayMutation, useApproveHolidayMutation } from "../../services/holidayApi";
import { enUS } from 'date-fns/locale/en-US';
import { useState } from 'react';
import { Box, Typography, Paper, Modal, Button, List, ListItem, CircularProgress, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewListIcon from '@mui/icons-material/ViewList';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useSuccessToast, useErrorToast } from '../../components/Toast';

const locales = {
    'en-US': enUS
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface HolidayFromApi {
    id: number;
    holiday_name: string;
    holiday_type?: string;
    dates?: string[];
    holiday_from_date?: string;
    holiday_to_date?: string;
    is_approved?: boolean;
    approved_by?: number | null;
    approved_at?: string | null;
    is_active: boolean;
    is_deleted?: boolean;
    created_at?: string;
    updated_at?: string;
    created_by: number;
    updated_by?: number;
}

interface CalendarEvent {
    id: string;
    holidayId: number;
    title: string;
    start: Date;
    end: Date;
    is_approved: boolean;
    is_active: boolean;
    createdBy: number;
    name: string;
    holidayType?: string;
    approvedBy?: number | null;
    approvedAt?: string | null;
}

const Holidays = () => {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [holidayToApprove, setHolidayToApprove] = useState<number | null>(null);
    const [view, setView] = useState<'calendar' | 'list'>('calendar');
    const { data, isLoading, error } = useGetHolidaysQuery({ search: '', page: 1, page_size: 100 });
    const [editHoliday] = useEditHolidayMutation();
    const navigate = useNavigate();
    const { hasRole, hasPermission } = useAuth();
    const [approvalComment, setApprovalComment] = useState('');
    const [approveHoliday] = useApproveHolidayMutation();
    const showSuccessToast = useSuccessToast();
    const showErrorToast = useErrorToast();
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const [rowEditName, setRowEditName] = useState<string>('');
    const [modalEditName, setModalEditName] = useState<string>('');
    const events: CalendarEvent[] = (data?.results || []).flatMap((holiday: HolidayFromApi) => {
        const result: CalendarEvent[] = [];
        const isApproved = Boolean(holiday.is_approved);

        // 1) Prefer explicit from/to range if provided
        if (holiday.holiday_from_date || holiday.holiday_to_date) {
            const start = new Date(holiday.holiday_from_date || holiday.holiday_to_date!);
            const end = new Date(holiday.holiday_to_date || holiday.holiday_from_date!);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            result.push({
                id: `${holiday.id}-range`,
                holidayId: holiday.id,
                title: holiday.holiday_name,
                start,
                end,
                is_approved: isApproved,
                is_active: Boolean(holiday.is_active),
                createdBy: holiday.created_by,
                name: holiday.holiday_name,
                holidayType: holiday.holiday_type,
                approvedBy: holiday.approved_by ?? null,
                approvedAt: holiday.approved_at ?? null,
            });
            return result;
        }

        // 2) Otherwise map dates[] entries if available
        if (holiday.dates && holiday.dates.length > 0) {
            holiday.dates.forEach((dateStr, index) => {
                const d = new Date(dateStr);
                d.setHours(0, 0, 0, 0);
                result.push({
                    id: `${holiday.id}-${index}`,
                    holidayId: holiday.id,
                    title: holiday.holiday_name,
                    start: d,
                    end: d,
                    is_approved: isApproved,
                    is_active: Boolean(holiday.is_active),
                    createdBy: holiday.created_by,
                    name: holiday.holiday_name,
                    holidayType: holiday.holiday_type,
                    approvedBy: holiday.approved_by ?? null,
                    approvedAt: holiday.approved_at ?? null,
                });
            });
            return result;
        }

        // 3) Fallback: created_at as a single-day event
        if (holiday.created_at) {
            const d = new Date(holiday.created_at);
            d.setHours(0, 0, 0, 0);
            result.push({
                id: `${holiday.id}-created`,
                holidayId: holiday.id,
                title: holiday.holiday_name,
                start: d,
                end: d,
                is_approved: isApproved,
                is_active: Boolean(holiday.is_active),
                createdBy: holiday.created_by,
                name: holiday.holiday_name,
                holidayType: holiday.holiday_type,
                approvedBy: holiday.approved_by ?? null,
                approvedAt: holiday.approved_at ?? null,
            });
        }
        return result;
    });
    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setModalEditName(event.name);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
        setIsModalOpen(false);
    };

    const handleEditClick = (id: number) => {
        navigate(`/holidays/new/${id}`);
        handleCloseModal();
    };

    const startRowEdit = (e: React.MouseEvent, holidayId: number, currentName: string) => {
        e.stopPropagation();
        setEditingRowId(holidayId);
        setRowEditName(currentName);
    };

    const cancelRowEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingRowId(null);
        setRowEditName('');
    };

    const saveRowEdit = async (e: React.MouseEvent, holidayId: number) => {
        e.stopPropagation();
        try {
            const formData = new FormData();
            formData.append('holiday_name', rowEditName);
            await editHoliday({ id: holidayId, data: formData }).unwrap();
            showSuccessToast('Holiday name updated');
            setEditingRowId(null);
            setRowEditName('');
        } catch (err: any) {
            showErrorToast(err?.data?.message || 'Failed to update holiday');
        }
    };

    const saveModalEdit = async () => {
        if (!selectedEvent) return;
        try {
            const formData = new FormData();
            formData.append('holiday_name', modalEditName);
            await editHoliday({ id: selectedEvent.holidayId, data: formData }).unwrap();
            showSuccessToast('Holiday name updated');
            setSelectedEvent({ ...selectedEvent, name: modalEditName, title: modalEditName });
        } catch (err: any) {
            showErrorToast(err?.data?.message || 'Failed to update holiday');
        }
    };

    const handleViewChange = (
        event: React.MouseEvent<HTMLElement>,
        newView: 'calendar' | 'list' | null,
    ) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    const handleApproveClick = (id: number) => {
        setHolidayToApprove(id);
        setIsApproveModalOpen(true);
    };

    const handleApproveConfirm = async () => {
        if (holidayToApprove) {
            try {
                await approveHoliday(holidayToApprove).unwrap();
                showSuccessToast('Holiday approved successfully');
            } catch (error: any) {
                console.error('Error approving holiday:', error);
                showErrorToast(error?.data?.message || 'Error approving holiday');
            }
        }
        setIsApproveModalOpen(false);
        setHolidayToApprove(null);
        setApprovalComment('');
    };

    const handleApproveCancel = () => {
        setIsApproveModalOpen(false);
        setHolidayToApprove(null);
        setApprovalComment('');
    };

    const handleReject = async () => {
        if (holidayToApprove) {
            try {
                const formData = new FormData();
                formData.append('is_active', 'false');
                if (approvalComment) {
                    formData.append('comment', approvalComment);
                }
                await editHoliday({ id: holidayToApprove, data: formData }).unwrap();
                window.location.reload();
            } catch (error) {
                console.error('Error rejecting holiday:', error);
            }
        }
        setIsApproveModalOpen(false);
        setHolidayToApprove(null);
        setApprovalComment('');
    };

    if (isLoading) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading holidays...</Typography>
            </Box>
        );
    }

    if (error) {
        const errorMessage = 'error' in error ? error.error : 'An error occurred while loading holidays';
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" color="error">{errorMessage}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100vh', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Holidays Calendar</Typography>
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleViewChange}
                    aria-label="view mode"
                >
                    <ToggleButton value="calendar" aria-label="calendar view">
                        <CalendarMonthIcon />
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="list view">
                        <ViewListIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {view === 'calendar' ? (
                <Paper sx={{ height: 600, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#2e7d32', borderRadius: 0.5 }} />
                            <Typography variant="caption">Approved</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#f57c00', borderRadius: 0.5 }} />
                            <Typography variant="caption">Pending</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#9e9e9e', borderRadius: 0.5 }} />
                            <Typography variant="caption">Inactive</Typography>
                        </Box>
                    </Box>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        views={['month', 'week', 'day']}
                        defaultView="month"
                        onSelectEvent={handleEventClick}
                        eventPropGetter={(event: CalendarEvent) => ({
                                style: {
                                backgroundColor: !event.is_active ? '#9e9e9e' : (event.is_approved ? '#2e7d32' : '#f57c00'),
                                color: '#fff',
                                    border: 'none',
                                    borderRadius: '3px',
                                padding: '2px 4px',
                                    cursor: 'pointer',
                                opacity: !event.is_active ? 0.85 : 1,
                                },
                        })}
                    />
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Holiday Name</TableCell>
                                <TableCell>From Date</TableCell>
                                <TableCell>To Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(events || []).map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>
                                        {editingRowId === event.holidayId ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <TextField
                                                    value={rowEditName}
                                                    onChange={(e) => setRowEditName(e.target.value)}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                <Button size="small" variant="contained" onClick={(e) => saveRowEdit(e, event.holidayId)}>Save</Button>
                                                <Button size="small" variant="text" onClick={cancelRowEdit}>Cancel</Button>
                                            </Box>
                                        ) : (
                                            <Typography>{event.name}</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>{format(event.start, 'MMMM do, yyyy')}</TableCell>
                                    <TableCell>{format(event.end, 'MMMM do, yyyy')}</TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                color: !event.is_active ? 'text.secondary' : (event.is_approved ? 'success.main' : 'warning.main'),
                                                fontWeight: 600,
                                            }}
                                        >
                                            {!event.is_active ? 'Inactive' : (event.is_approved ? '✓ Approved' : '⏳ Pending')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>User {event.createdBy}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEventClick(event)}
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            {editingRowId !== event.holidayId && (
                                                <Button size="small" onClick={(e) => startRowEdit(e, event.holidayId, event.name)}>Rename</Button>
                                            )}
                                            {hasPermission('approve:approval') && !event.is_approved && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleApproveClick(event.holidayId)}
                                                    color="success"
                                                >
                                                    <CheckCircleIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="holiday-details-modal"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box>
                    {selectedEvent && (
                        <Paper sx={{
                            width: 400,
                            maxHeight: '90vh',
                            overflow: 'auto',
                            p: 4,
                            borderRadius: 2,
                            outline: 'none',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            '&:focus': { outline: 'none' }
                        }}>
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: 'error.main',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {selectedEvent.name}
                                    </Typography>
                                    <Chip
                                        label={!selectedEvent.is_active ? 'Inactive' : (selectedEvent.is_approved ? 'Approved' : 'Pending')}
                                        color={!selectedEvent.is_active ? 'default' : (selectedEvent.is_approved ? 'success' : 'warning')}
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <TextField
                                        label="Holiday name"
                                        size="small"
                                        value={modalEditName}
                                        onChange={(e) => setModalEditName(e.target.value)}
                                        fullWidth
                                    />
                                    <Button variant="contained" onClick={saveModalEdit}>Save</Button>
                                </Box>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 2,
                                mt: 3,
                                borderTop: '1px solid',
                                borderColor: 'grey.200',
                                pt: 3
                            }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleCloseModal}
                                    sx={{
                                        borderRadius: 2,
                                        px: 3
                                    }}
                                >
                                    Close
                                </Button>
                                {hasRole(['ADMIN']) && (
                                    <>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleEditClick(selectedEvent.holidayId)}
                                            sx={{
                                                borderRadius: 2,
                                                px: 3
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        {!selectedEvent.is_approved && (
                                            <Button     
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleApproveClick(selectedEvent.holidayId)}
                                                sx={{
                                                    borderRadius: 2,
                                                    px: 3,
                                                    '&:hover': {
                                                        backgroundColor: 'success.main',
                                                        color: 'white'
                                                    },
                                                    backgroundColor: 'green !important',
                                                    color: 'white !important'
                                                }}
                                            >
                                                Approve
                                            </Button>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Paper>
                    )}
                </Box>
            </Modal>

            <Dialog
                open={isApproveModalOpen}
                onClose={handleApproveCancel}
                aria-labelledby="approve-confirmation-dialog"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="approve-confirmation-dialog">
                    Holiday Action
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2, fontWeight: 500 }}>
                        Are you sure you want to submit this request? This action cannot be undone.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            multiline
                            rows={3}
                            value={approvalComment}
                            onChange={(e) => setApprovalComment(e.target.value)}
                            placeholder="Add your comments here..."
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleApproveConfirm}
                        color="success"
                        variant="contained"
                        size="small"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'success.main',
                                color: 'white'
                            },
                            backgroundColor: 'green !important',
                            color: 'white !important'
                        }}
                        startIcon={<CheckCircleIcon sx={{ color: 'white !important' }} />}
                    >
                        Approve
                    </Button>
                    <Button
                        onClick={handleReject}
                        color="error"
                        variant="outlined"
                        size="small"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'error.main',
                                color: 'white'
                            },
                            backgroundColor: 'red !important',
                            color: 'white !important'
                        }}
                        startIcon={<CloseIcon sx={{ color: 'white !important' }} />}
                    >
                        Reject
                    </Button>
                    <Button 
                        onClick={handleApproveCancel} 
                        color="inherit"
                        size="small"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Holidays;