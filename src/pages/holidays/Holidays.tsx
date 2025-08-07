import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGetHolidaysQuery, useEditHolidayMutation, useApproveHolidayMutation } from "../../services/holidayApi";
import { enUS } from 'date-fns/locale/en-US';
import { useState } from 'react';
import { Box, Typography, Paper, Modal, Button, CircularProgress, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
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

interface Holiday {
    id: number;
    holiday_name: string;
    holiday_type: string;
    date: string;
    is_approved: boolean;
    approved_by: number | null;
    approved_at: string | null;
    is_active: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
}

interface CalendarEvent {
    id: number;
    title: string;
    allDay: boolean;
    start: Date;
    end: Date;
    is_approved: boolean;
    createdBy: number;
    name: string;
    holidayType: string;
    approvedBy: number | null;
    approvedAt: string | null;
}

interface ApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    current_page: number;
    total_pages: number;
    page_size: number;
    results: Array<{
        id: number;
        holiday_name: string;
        holiday_type: string;
        date: string;
        is_approved: boolean;
        approved_by: number | null;
        approved_at: string | null;
        is_active: boolean;
        is_deleted: boolean;
        created_at: string;
        updated_at: string;
        created_by: number;
        updated_by: number;
    }>;
}

const Holidays = () => {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [holidayToApprove, setHolidayToApprove] = useState<number | null>(null);
    const [view, setView] = useState<'calendar' | 'list'>('calendar');
    const { data, isLoading, error } = useGetHolidaysQuery({ search: '', page: 1, page_size: 10 });
    const [editHoliday] = useEditHolidayMutation();
    const navigate = useNavigate();
    const { hasRole, hasPermission } = useAuth();
    const [approvalComment, setApprovalComment] = useState('');
    const [approveHoliday] = useApproveHolidayMutation();
    const showSuccessToast = useSuccessToast();
    const showErrorToast = useErrorToast();

    const events: CalendarEvent[] = ((data as unknown as ApiResponse)?.results || []).map((holiday) => {
        const eventDate = new Date(holiday.date);
        eventDate.setHours(0, 0, 0, 0);
        
        return {
            id: holiday.id,
            title: `${holiday.holiday_name} (${holiday.holiday_type}) ${holiday.is_approved ? '✓' : '⏳'}`,
            allDay: true,
            start: eventDate,
            end: eventDate,
            is_approved: holiday.is_approved,
            createdBy: holiday.created_by,
            name: holiday.holiday_name,
            holidayType: holiday.holiday_type,
            approvedBy: holiday.approved_by,
            approvedAt: holiday.approved_at
        };
    });

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
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
                setIsApproveModalOpen(false);
                setHolidayToApprove(null);
                setApprovalComment('');
            } catch (error: any) {
                console.error('Error approving holiday:', error);
                showErrorToast(error?.data?.message || 'Error approving holiday');
            }
        }
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
                formData.append('is_approved', 'false');
                if (approvalComment) {
                    formData.append('comment', approvalComment);
                }
                await editHoliday({ id: holidayToApprove, data: formData }).unwrap();
                showSuccessToast('Holiday rejected successfully');
                setIsApproveModalOpen(false);
                setHolidayToApprove(null);
                setApprovalComment('');
            } catch (error: any) {
                console.error('Error rejecting holiday:', error);
                showErrorToast(error?.data?.message || 'Error rejecting holiday');
            }
        }
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
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        views={['month']}
                        defaultView="month"
                        onSelectEvent={handleEventClick}
                        eventPropGetter={(event: CalendarEvent) => {
                            let backgroundColor = '#1976d2';  // blue for public holidays
                            let textColor = '#fff';
                            
                            if (!event.is_approved) {
                                backgroundColor = '#f57c00';  // orange for pending
                            }
                            
                            return {
                                style: {
                                    backgroundColor,
                                    color: textColor,
                                    border: 'none',
                                    borderRadius: '3px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center'
                                },
                            };
                        }}
                        formats={{
                            dateFormat: 'dd',
                            monthHeaderFormat: 'MMMM yyyy',
                            dayHeaderFormat: 'EEEE',
                            dayRangeHeaderFormat: ({ start, end }) => 
                                `${format(start, 'MMMM dd')} - ${format(end, 'dd, yyyy')}`
                        }}
                        popup
                        selectable={false}
                    />
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Holiday Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>{event.name}</TableCell>
                                    <TableCell>{event.holidayType}</TableCell>
                                    <TableCell>{format(event.start, 'MMMM do, yyyy')}</TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                color: event.is_approved ? 'success.main' : 'warning.main',
                                                fontWeight: 600,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                bgcolor: event.is_approved ? 'success.lighter' : 'warning.lighter',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            {event.is_approved ? '✓ Approved' : '⏳ Pending'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>User {event.createdBy}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditClick(event.id)}
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            {hasPermission('approve:approval') && !event.is_approved && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleApproveClick(event.id)}
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
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 3,
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    borderBottom: '2px solid',
                                    borderColor: 'primary.main',
                                    pb: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {selectedEvent.name}
                                <Typography
                                    component="span"
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: selectedEvent.is_approved ? 'success.main' : 'warning.main',
                                        fontWeight: 500,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        bgcolor: selectedEvent.is_approved ? 'success.lighter' : 'warning.lighter',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 1
                                    }}
                                >
                                    {selectedEvent.is_approved ? '✓ Approved' : '⏳ Pending Approval'}
                                </Typography>
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                    p: 2,
                                    bgcolor: 'grey.50',
                                    borderRadius: 1
                                }}>
                                    <Typography sx={{ fontWeight: 600, width: 100, color: 'text.secondary' }}>
                                        Type:
                                    </Typography>
                                    <Typography sx={{
                                        color: 'primary.main',
                                        fontWeight: 500,
                                        textTransform: 'capitalize',
                                        bgcolor: 'primary.lighter',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 1
                                    }}>
                                        {selectedEvent.holidayType}
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                    p: 2,
                                    bgcolor: 'grey.50',
                                    borderRadius: 1
                                }}>
                                    <Typography sx={{ fontWeight: 600, width: 100, color: 'text.secondary' }}>
                                        Holiday Date:
                                    </Typography>
                                    <Typography sx={{ 
                                        color: 'text.primary', 
                                        fontWeight: 500,
                                        bgcolor: 'primary.lighter',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 1
                                    }}>
                                        {format(selectedEvent.start, 'EEEE, MMMM do, yyyy')}
                                    </Typography>
                                </Box>

                                {selectedEvent.is_approved && selectedEvent.approvedBy && selectedEvent.approvedAt && (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                        p: 2,
                                        bgcolor: 'grey.50',
                                        borderRadius: 1
                                    }}>
                                        <Typography sx={{ fontWeight: 600, width: 100, color: 'text.secondary' }}>
                                            Approved:
                                        </Typography>
                                        <Box>
                                            <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
                                                By: User {selectedEvent.approvedBy}
                                            </Typography>
                                            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                                On: {format(new Date(selectedEvent.approvedAt), 'MMM do, yyyy HH:mm')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    bgcolor: 'grey.50',
                                    borderRadius: 1
                                }}>
                                    <Typography sx={{ fontWeight: 600, width: 100, color: 'text.secondary' }}>
                                        Created by:
                                    </Typography>
                                    <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
                                        {`User ${selectedEvent.createdBy}` || 'Unknown'}
                                    </Typography>
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
                                            onClick={() => handleEditClick(selectedEvent.id)}
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
                                                onClick={() => handleApproveClick(selectedEvent.id)}
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