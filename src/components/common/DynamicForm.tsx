import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  InputLabel,
  Select,
  SelectChangeEvent,
  Switch,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { DynamicFormProps, Field } from "../../types/form.types";

const DynamicForm = ({ fields, onSubmit, initialValues }: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});
  const [openModal, setOpenModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" || type === "switch"
        ? (e.target as HTMLInputElement).checked
        : type === "file"
          ? (e.target as HTMLInputElement).files?.[0] || null
          : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const commonStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      backgroundColor: 'white',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: 2,
      },
      '&.Mui-focused': {
        boxShadow: 4,
        borderColor: 'primary.main'
      }
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary'
    }
  };

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const renderField = (field: Field) => {
    switch (field.type) {
      case "select":
        return (
          <FormControl fullWidth sx={commonStyles}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              name={field.name}
              value={formData[field.name] || field.defaultValue || ""}
              onChange={handleSelectChange}
              required={field.required}
              label={field.label}
            >
              {field.options?.map((option) => (
                <MenuItem key={String(option.value)} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                name={field.name}
                checked={formData[field.name] || false}
                onChange={handleInputChange}
              />
            }
            label={field.label}
            sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
          />
        );
      
      case "radio":
        return (
          <FormControl component="fieldset">
            <FormLabel>{field.label}</FormLabel>
            <RadioGroup
              name={field.name}
              value={formData[field.name] || field.defaultValue || ""}
              onChange={handleInputChange}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={String(option.value)}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      
      case "switch":
        return (
          <FormControlLabel
            control={
              <Switch
                name={field.name}
                checked={formData[field.name] || false}
                onChange={handleInputChange}
              />
            }
            label={field.label}
          />
        );
      
      case "file":
        return (
          <Box>
            <TextField
              fullWidth
              type="file"
              name={field.name}
              label={field.label}
              onChange={handleInputChange}
              required={field.required}
              InputLabelProps={{ shrink: true }}
              sx={commonStyles}
              inputProps={{
                accept: field.accept || 'image/*'
              }}
            />
            {formData[field.name] && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Selected file: {formData[field.name]?.name || 'No file selected'}
              </Typography>
            )}
          </Box>
        );
      
      default:
        return (
          <TextField
            fullWidth
            name={field.name}
            label={field.label}
            type={field.type}
            value={field.type !== 'file' ? (formData[field.name] || field.defaultValue || "") : undefined}
            onChange={handleInputChange}
            required={field.required}
            sx={commonStyles}
          />
        );
    }
  };

  const switchFields = fields.filter(field => field.type === "switch");
  const nonSwitchFields = fields.filter(field => field.type !== "switch");

  return (
    <Paper elevation={5} sx={{ borderRadius: 4, p: 5, background: 'linear-gradient(135deg, #f3f4f6 30%, #ffffff 90%)' }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {nonSwitchFields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              {renderField(field)}
            </Grid>
          ))}
          
          {switchFields.length > 0 && (
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                onClick={handleModalOpen}
                sx={{
                  width: '100%',
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                }}
              >
                Select Previledges
              </Button>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                px: 5,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'scale(1.05)'
                },
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>

      <Dialog 
        open={openModal} 
        onClose={handleModalClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: '400px',
            background: 'linear-gradient(135deg, #f3f4f6 30%, #ffffff 90%)',
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          pt: 3,
          px: 4,
          typography: 'h6',
          fontWeight: 'medium',
          color: 'text.primary',
        }}>
          Priviledges
        </DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          <Box sx={{ 
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            {switchFields.map((field) => (
              <Box 
                key={field.name} 
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateX(4px)',
                  }
                }}
              >
                {renderField(field)}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3 }}>
          <Button 
            onClick={handleModalClose}
            variant="contained"
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DynamicForm;
