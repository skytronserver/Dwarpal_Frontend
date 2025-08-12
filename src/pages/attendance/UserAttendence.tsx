import { Grid, Typography, Paper, Box, Card, CardContent, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Divider, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useGetUserAttendanceQuery } from "../../services/UserApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

const formatMonthYear = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  // Check if it's midnight (00:00:00) - our dummy time
  if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
    return '00:00:00';
  }
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const UserAttendence = () => {
  const { data, isLoading, error } = useGetUserAttendanceQuery(1);

  console.log(data, 'data');

  if (isLoading) return <div>Loading...</div>;
  
  if (error) {
    const errorMessage = (error as FetchBaseQueryError).status 
      ? `Server error: ${(error as FetchBaseQueryError).status}` 
      : (error as SerializedError).message || 'Unknown error occurred';
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error loading attendance data
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          {errorMessage}
        </Typography>
      </Box>
    );
  }
  // Create default attendance record when attendance array is empty
  const createDefaultAttendanceRecord = () => {
    const today = new Date();
    const dummyDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(),0, 0, 0, 0);
    
    return {
      date: today.toISOString().split('T')[0],
      official_in_time: dummyDateTime.toISOString(),
      official_out_time: dummyDateTime.toISOString(),
      in_times: [],
      out_times: [],
      total_work_time: '0h 0m',
      status: 'No Data'
    };
  };

  // Use actual data with fallback for empty attendance
  const attendanceData = data ? {
    ...data,
    attendance: data.attendance && data.attendance.length > 0 
      ? data.attendance 
      : [createDefaultAttendanceRecord()]
  } : {
    user: 'Unknown User',
    department: 'Unknown Department',
    attendance: [createDefaultAttendanceRecord()],
    summary: {
      total_present: 0,
      total_late: 0,
      total_absent: 0
    }
  };

  const hasRealData = data && data.attendance && data.attendance.length > 0;

  // Transform API data for the UI
  const workHoursTrend = attendanceData.attendance.map(record => ({
    date: record.date,
    hours: record.total_work_time ? parseFloat(record.total_work_time.split('h')[0]) || 0 : 0
  }));

  // Create check-in/out activity data for visualization
  const activityData = attendanceData.attendance[0] ? [
    { type: 'Check-ins', count: attendanceData.attendance[0].in_times?.length || 0, color: '#4caf50' },
    { type: 'Check-outs', count: attendanceData.attendance[0].out_times?.length || 0, color: '#f44336' }
  ] : [
    { type: 'Check-ins', count: 0, color: '#4caf50' },
    { type: 'Check-outs', count: 0, color: '#f44336' }
  ];

  console.log(attendanceData, 'attendanceData');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
        Employee Attendance Dashboard
      </Typography>

      {/* Employee Profile Header */}
      <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={2}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)', fontSize: '2rem' }}>
              {attendanceData.user.split(' ').map(n => n[0]).join('')}
            </Avatar>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
              {attendanceData.user}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BusinessIcon sx={{ mr: 1 }} />
              <Typography variant="h6">{attendanceData.department}</Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {formatDate(attendanceData.attendance[0].date)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {attendanceData.attendance[0].total_work_time}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Total Work Time
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarTodayIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Present Days</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {attendanceData?.summary.total_present || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Late Days</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {attendanceData?.summary.total_late || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventBusyIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Absent Days</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {attendanceData?.summary.total_absent || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Activity Count</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {attendanceData.attendance[0] ? (attendanceData.attendance[0].in_times?.length || 0) + (attendanceData.attendance[0].out_times?.length || 0) : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Daily Activity Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ mr: 1 }} />
              Daily Activity Overview
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count">
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Official Work Hours</Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LoginIcon sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">Official Check-in</Typography>
                  <Typography variant="h6">
                    {formatTime(attendanceData.attendance[0].official_in_time)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LogoutIcon sx={{ mr: 2, color: 'error.main' }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">Official Check-out</Typography>
                  <Typography variant="h6">
                    {formatTime(attendanceData.attendance[0].official_out_time)}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                <Typography variant="body2" color="textSecondary">Status</Typography>
                <Chip 
                  label={attendanceData.attendance[0].status} 
                  color={attendanceData.attendance[0].status === 'Present' ? 'success' : 
                         attendanceData.attendance[0].status === 'Late' ? 'warning' : 'error'}
                  size="medium"
                  sx={{ mt: 1, fontWeight: 'bold' }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Detailed Time Logs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', color: 'success.main' }}>
              <LoginIcon sx={{ mr: 1 }} />
              Check-in Times ({attendanceData.attendance[0].in_times?.length || 0})
            </Typography>
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {(attendanceData.attendance[0].in_times || []).map((time, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon>
                    <LoginIcon sx={{ color: 'success.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={formatTime(time)}
                    secondary={`Entry #${index + 1}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 1 }} />
              Check-out Times ({attendanceData.attendance[0].out_times?.length || 0})
            </Typography>
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {(attendanceData.attendance[0].out_times || []).map((time, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: 'error.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={formatTime(time)}
                    secondary={`Exit #${index + 1}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Summary Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>Attendance Summary</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>First Check-in</TableCell>
                <TableCell>Last Check-out</TableCell>
                <TableCell>Total Entries</TableCell>
                <TableCell>Total Exits</TableCell>
                <TableCell>Work Duration</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData?.attendance.map((record) => (
                <TableRow key={record.date}>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {formatDate(record.date)}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatTime(record.official_in_time)}</TableCell>
                  <TableCell>{formatTime(record.official_out_time)}</TableCell>
                  <TableCell>
                    <Chip label={record.in_times?.length || 0} color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={record.out_times?.length || 0} color="error" size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {record.total_work_time}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={record.status} 
                      color={
                        record.status === 'Present' ? 'success' : 
                        record.status === 'Late' ? 'warning' : 'error'
                      }
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default UserAttendence; 