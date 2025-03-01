import { Grid, Typography, Paper, Box, Card, CardContent, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Dummy data for detailed view
const employeeDetails = {
  name: "John Doe",
  employeeId: "EMP001",
  department: "IT",
  month: "March 2024"
};

const dailyRecords = [
  { date: '2024-03-01', checkIn: '09:00', checkOut: '17:30', status: 'Present', workHours: 8.5 },
  { date: '2024-03-02', checkIn: '09:15', checkOut: '17:45', status: 'Late', workHours: 8.5 },
  { date: '2024-03-03', checkIn: '09:00', checkOut: '17:30', status: 'Present', workHours: 8.5 },
  { date: '2024-03-04', checkIn: '-', checkOut: '-', status: 'Absent', workHours: 0 },
  { date: '2024-03-05', checkIn: '09:00', checkOut: '17:30', status: 'Present', workHours: 8.5 },
];

const workHoursTrend = dailyRecords.map(record => ({
  date: record.date,
  hours: record.workHours
}));

const AttendanceDetail = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Employee Attendance Detail
      </Typography>

      {/* Employee Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">{employeeDetails.name}</Typography>
            <Typography color="textSecondary">ID: {employeeDetails.employeeId}</Typography>
            <Typography color="textSecondary">Department: {employeeDetails.department}</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Typography variant="h6">{employeeDetails.month}</Typography>
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
              <Typography variant="h4">19</Typography>
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
              <Typography variant="h4">2</Typography>
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
              {dailyRecords.map((record) => (
                <TableRow key={record.date}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
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
                  <TableCell>{record.workHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AttendanceDetail; 