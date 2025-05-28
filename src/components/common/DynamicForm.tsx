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
import { useTheme } from "@mui/material/styles";

const DynamicForm = ({ fields, onSubmit, initialValues }: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();

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
      borderRadius: '8px',
      backgroundColor: theme.palette.background.paper,
      '&:hover': {
        backgroundColor: theme.palette.background.paper,
        '& fieldset': {
          borderColor: theme.palette.primary.main,
        }
      },
      '&.Mui-focused': {
        '& fieldset': {
          borderColor: theme.palette.primary.main,
        }
      }
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.primary,
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      }
    },
    '& .MuiInputBase-input': {
      fontSize: '0.95rem',
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
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: '8px',
                    mt: 1,
                    boxShadow: '0 4px 16px rgba(255, 131, 97, 0.08)',
                    border: '1px solid rgba(255, 131, 97, 0.1)',
                  }
                }
              }}
            >
              {field.options?.map((option) => (
                <MenuItem 
                  key={String(option.value)} 
                  value={option.value}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 131, 97, 0.08)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 131, 97, 0.12)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 131, 97, 0.16)',
                      }
                    }
                  }}
                >
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
                sx={{
                  color: theme.palette.primary.main,
                  '& .MuiSvgIcon-root': {
                    border: '2px solid #bdbdbd',
                    borderRadius: '4px',
                  },
                  '&.Mui-checked .MuiSvgIcon-root': {
                    border: '2px solid #000',
                  },
                  '&.Mui-checked': {
                    color: '#000',
                    '& .MuiSvgIcon-root path': {
                      color: '#1976d2',
                      fill: '#1976d2',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(5, 5, 5, 0.08)',
                  },
                  '&.Mui-focusVisible': {
                    backgroundColor: 'rgba(6, 2, 0, 0.12)',
                  }
                }}
              />
            }
            label={field.label}
            sx={{ 
              transition: 'all 0.3s ease', 
              '&:hover': { transform: 'scale(1.05)' } 
            }}
          />
        );
      
      case "radio":
        return (
          <FormControl component="fieldset">
            <FormLabel sx={{ color: theme.palette.text.primary }}>{field.label}</FormLabel>
            <RadioGroup
              name={field.name}
              value={formData[field.name] || field.defaultValue || ""}
              onChange={handleInputChange}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={String(option.value)}
                  value={option.value}
                  control={
                    <Radio 
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(255, 131, 97, 0.08)',
                        }
                      }}
                    />
                  }
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
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 131, 97, 0.08)',
                    },
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
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

      case "multi-select":
        return (
          <FormControl fullWidth sx={commonStyles}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              multiple
              name={field.name}
              value={formData[field.name] || field.defaultValue || []}
              onChange={handleSelectChange}
              required={field.required}
              label={field.label}
              renderValue={(selected) => (
                Array.isArray(selected) 
                  ? selected.map(value => 
                      field.options?.find(opt => opt.value === value)?.label
                    ).join(', ')
                  : ''
              )}
            >
              {field.options?.map((option) => (
                <MenuItem key={String(option.value)} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: '16px',
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2.5}>
          {nonSwitchFields.map((field) => (
            <Grid item xs={12} sm={field.type === 'radio' ? 12 : 6} key={field.name}>
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
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  borderColor: '#e2e8f0',
                  color: '#2c3e50',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }
                }}
              >
                Select Privileges
              </Button>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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
            borderRadius: '16px',
            minWidth: '360px',
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          pt: 2.5,
          px: 3,
          typography: 'h6',
          fontWeight: 600,
          color: '#2c3e50',
        }}>
          Privileges
        </DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Box sx={{ 
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}>
            {switchFields.map((field) => (
              <Box 
                key={field.name} 
                sx={{
                  p: 2,
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                {renderField(field)}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button 
            onClick={handleModalClose}
            variant="contained"
            sx={{
              px: 4,
              py: 1,
             width:10,
              borderRadius: '6px',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DynamicForm;
