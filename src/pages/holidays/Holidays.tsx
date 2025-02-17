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
  created_by: string;
  holiday_dates: string;
  is_verified: boolean;
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  isVerified: boolean;
  createdBy: string;
  dates: string;
}

const Holidays = () => {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, isLoading, error } = useGetHolidaysQuery({search: '', page: 1, page_size: 10});

    const events: CalendarEvent[] = data?.results.flatMap((holiday: Holiday) => 
        holiday.holiday_dates.split(',').map(date => ({
            id: holiday.id,
            title: holiday.created_by 
                ? `Holiday by ${holiday.created_by}`
                : 'Unnamed Holiday',
            start: new Date(date.trim()),
            end: new Date(date.trim()),
            isVerified: holiday.is_verified,
            createdBy: holiday.created_by,
            dates: holiday.holiday_dates
        }))
    ) || [];

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setSelectedEvent(null);
        setIsModalOpen(false);
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
            <Paper sx={{ height: 600 }}>
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
                                Holiday Details
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
                                        {selectedEvent.createdBy || 'Unknown'}
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
                                    {selectedEvent.dates.split(',').map((date, index) => (
                                        <ListItem 
                                            key={index}
                                            sx={{
                                                borderBottom: index !== selectedEvent.dates.split(',').length - 1 ? '1px solid' : 'none',
                                                borderColor: 'grey.200',
                                                py: 1
                                            }}
                                        >
                                            <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
                                                {format(new Date(date.trim()), 'MMMM do, yyyy')}
                                            </Typography>
                                        </ListItem>
                                    ))}
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
                                {!selectedEvent.isVerified && (
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            // TODO: Implement edit functionality
                                            console.log('Edit holiday:', selectedEvent);
                                        }}
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