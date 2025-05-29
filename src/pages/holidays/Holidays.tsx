import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGetHolidaysQuery } from "../../services/holidayApi";
import { enUS } from 'date-fns/locale/en-US';
import { useState } from 'react';
import { Box, Typography, Paper, Modal, Button, List, ListItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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
    const { data, isLoading, error } = useGetHolidaysQuery({ search: '', page: 1, page_size: 10 });
    const navigate = useNavigate();
    const { hasRole } = useAuth();

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
            <Typography variant="h4" sx={{ mb: 2 }}>Holidays Calendar</Typography>
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
                                )}
                            </Box>
                        </Paper>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default Holidays;