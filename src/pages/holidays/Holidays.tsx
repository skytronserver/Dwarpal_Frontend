import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGetHolidaysQuery, useEditHolidayMutation } from "../../services/holidayApi";
import { enUS } from 'date-fns/locale/en-US';
import { useState } from 'react';
import { Box, Typography, Paper, Modal, Button, List, ListItem, CircularProgress, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewListIcon from '@mui/icons-material/ViewList';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

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
    holiday_from_date: string;
    holiday_to_date: string;
    holiday_name: string;
    is_active: boolean;
    created_by: number;
}

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    isVerified: boolean;
    createdBy: number;
    name: string;
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

    const events: CalendarEvent[] = data?.results.map((holiday: Holiday) => ({
        id: holiday.id,
        title: `${holiday.holiday_name} ${holiday.is_active ? '✓' : '⏳'}`,
        start: new Date(holiday.holiday_from_date),
        end: new Date(holiday.holiday_to_date),
        isVerified: holiday.is_active,
        createdBy: holiday.created_by,
        name: holiday.holiday_name
    })) || [];

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
                const formData = new FormData();
                formData.append('is_active', 'true');
                if (approvalComment) {
                    formData.append('comment', approvalComment);
                }
                await editHoliday({ id: holidayToApprove, data: formData }).unwrap();
                window.location.reload();
            } catch (error) {
                console.error('Error approving holiday:', error);
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
                                backgroundColor: event.isVerified ? '#2e7d32' : '#ed6c02',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '3px',
                                padding: '2px 4px',
                                cursor: 'pointer',
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
                            {events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>{event.name}</TableCell>
                                    <TableCell>{format(event.start, 'MMMM do, yyyy')}</TableCell>
                                    <TableCell>{format(event.end, 'MMMM do, yyyy')}</TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                color: event.isVerified ? 'success.main' : 'warning.main',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {event.isVerified ? '✓ Verified' : '⏳ Pending'}
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
                                            {hasPermission('approve:approval') && !event.isVerified && (
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
                                    pb: 1
                                }}
                            >
                                {selectedEvent.name}
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
                                        Created by:
                                    </Typography>
                                    <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
                                        {`User ${selectedEvent.createdBy}` || 'Unknown'}
                                    </Typography>
                                </Box>

                                <Typography sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    color: 'text.secondary'
                                }}>
                                    Date(s):
                                </Typography>
                                <List sx={{
                                    bgcolor: 'grey.50',
                                    borderRadius: 1,
                                    mb: 2
                                }}>
                                    <ListItem sx={{ py: 1 }}>
                                        <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
                                            From: {format(selectedEvent.start, 'MMMM do, yyyy')}
                                        </Typography>
                                    </ListItem>
                                    <ListItem sx={{ py: 1 }}>
                                        <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
                                            To: {format(selectedEvent.end, 'MMMM do, yyyy')}
                                        </Typography>
                                    </ListItem>
                                </List>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    bgcolor: 'grey.50',
                                    borderRadius: 1
                                }}>
                                    <Typography sx={{ fontWeight: 600, width: 100, color: 'text.secondary' }}>
                                        Status:
                                    </Typography>
                                    <Typography sx={{
                                        color: selectedEvent.isVerified ? 'success.main' : 'warning.main',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        {selectedEvent.isVerified ? '✓ Verified' : '⏳ Pending Verification'}
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
                                        {!selectedEvent.isVerified && (
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