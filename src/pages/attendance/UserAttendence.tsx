import { Grid, Typography, Paper, Box, Card, CardContent, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useGetUserAttendanceQuery } from "../../services/UserApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

const formatMonthYear = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const UserAttendence = () => {
  const { data, isLoading, error } = useGetUserAttendanceQuery(1);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    const errorMessage = (error as FetchBaseQueryError).status 
      ? 'Server error' 
      : (error as SerializedError).message || 'Unknown error';
    return <div>Error: {errorMessage}</div>;
  }

  if (!data?.report.length) {
    return <div>No attendance data available</div>;
  }

  // Transform API data for the UI
  const workHoursTrend = data.report.map(record => ({
    date: record.date,
    hours: parseFloat(record.total_work_time.split('h')[0]) || 0
  }));

  console.log(data, 'data');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Employee Attendance Detail
      </Typography>

      {/* Employee Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">{data.report[0].user}</Typography>
            <Typography color="textSecondary">Department: {data.report[0].department}</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Typography variant="h6">{formatMonthYear(data.report[0].date)}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Present Days</Typography>
              </Box>
              <Typography variant="h4">{data?.summary.total_present || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Late Days</Typography>
              </Box>
              <Typography variant="h4">{data?.summary.total_late || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Work Hours Trend */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>Work Hours Trend</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={workHoursTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="hours" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Attendance Records Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>Daily Attendance Records</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Work Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.report.map((record) => (
                <TableRow key={record.date}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.official_in_time ? new Date(record.official_in_time).toLocaleTimeString() : '-'}</TableCell>
                  <TableCell>{record.official_out_time ? new Date(record.official_out_time).toLocaleTimeString() : '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={record.status} 
                      color={
                        record.status === 'Present' ? 'success' : 
                        record.status === 'Late' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{record.total_work_time}</TableCell>
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