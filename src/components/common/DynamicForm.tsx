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
  DialogActions,
  Chip,
  ThemeProvider,
  createTheme
} from "@mui/material";
import { DynamicFormProps, Field } from "../../types/form.types";
import { useTheme } from "@mui/material/styles";
import PhotoUploadModal from "../gatePass/PhotoUploadModal";

// Create a theme with overrides to remove required field asterisks
const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          display: 'none'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        asterisk: {
          display: 'none'
        }
      }
    }
  }
});

const DynamicForm = ({ fields, onSubmit, initialValues, onChange }: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});
  const [openModal, setOpenModal] = useState(false);
  const [activePhotoField, setActivePhotoField] = useState<string | null>(null);
  const muiTheme = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" || type === "switch"
      ? (e.target as HTMLInputElement).checked
      : type === "file"
        ? (e.target as HTMLInputElement).files?.[0] || null
        : value;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: newValue
      };
      onChange?.(newData);
      return newData;
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      onChange?.(newData);
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const commonStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: muiTheme.palette.background.paper,
      '&:hover': {
        backgroundColor: muiTheme.palette.background.paper,
        '& fieldset': {
          borderColor: muiTheme.palette.primary.main,
        }
      },
      '&.Mui-focused': {
        '& fieldset': {
          borderColor: muiTheme.palette.primary.main,
        }
      }
    },
    '& .MuiInputLabel-root': {
      color: muiTheme.palette.text.primary,
      '&.Mui-focused': {
        color: muiTheme.palette.primary.main,
      }
    },
    '& .MuiInputBase-input': {
      fontSize: '0.95rem',
    }
  };

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleArrayFieldAdd = (fieldName: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), {}]
    }));
  };

  const handleArrayFieldRemove = (fieldName: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleArrayFieldChange = (fieldName: string, index: number, value: any) => {
    setFormData(prev => {
      const newArray = [...prev[fieldName]];
      newArray[index] = { ...newArray[index], ...value };
      return {
        ...prev,
        [fieldName]: newArray
      };
    });
  };

  const renderArrayField = (field: Field) => {
    const arrayValue = formData[field.name] || [];
    
    return (
      <Box sx={{ mb: 2 }}>
        {arrayValue.map((item: any, index: number) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              {field.arrayFields?.map((arrayField) => (
                <Box key={arrayField.name}>
                  {renderField({
                    ...arrayField,
                    name: `${field.name}.${index}.${arrayField.name}`,
                    value: item[arrayField.name],
                    onChange: (value: any) => handleArrayFieldChange(field.name, index, { [arrayField.name]: value })
                  })}
                </Box>
              ))}
            </Box>
            {arrayValue.length > 1 && (
              <Button 
                color="error" 
                onClick={() => handleArrayFieldRemove(field.name, index)}
                sx={{ mt: 1 }}
                size="small"
                variant="outlined"
              >
                Remove
              </Button>
            )}
          </Box>
        ))}
        {arrayValue.length < 5 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => handleArrayFieldAdd(field.name)}
              sx={{ mt: 1 }}
              size="small"
              color="primary"
            >
              Add More {field.label}
            </Button>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
              {5 - arrayValue.length} more {field.label.toLowerCase()}{arrayValue.length === 4 ? '' : 's'} can be added
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "array":
        return renderArrayField(field);

      case "select":
        return (
          <FormControl fullWidth sx={commonStyles}>
            <InputLabel required={false}>{field.label}</InputLabel>
            <Select
              name={field.name}
              value={formData[field.name] || field.defaultValue || ""}
              onChange={handleSelectChange}
              required={field.required}
              disabled={field.disabled}
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
                  color: muiTheme.palette.primary.main,
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
            <FormLabel sx={{ color: muiTheme.palette.text.primary }}>{field.label}</FormLabel>
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
                        color: muiTheme.palette.primary.main,
                        '&.Mui-checked': {
                          color: muiTheme.palette.primary.main,
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
                    color: muiTheme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 131, 97, 0.08)',
                    },
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: muiTheme.palette.primary.main,
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
            {!formData[field.name] ? (
              <TextField
                fullWidth
                type="file"
                name={field.name}
                label={field.label}
                onChange={handleInputChange}
                disabled={field.disabled}
                required={field.required}
                InputLabelProps={{ shrink: true }}
                sx={commonStyles}
                inputProps={{
                  accept: field.accept || 'image/*'
                }}
              />
            ) : (
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <img
                  src={URL.createObjectURL(formData[field.name])}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {formData[field.name]?.name}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => setFormData(prev => ({ ...prev, [field.name]: null }))}
                >
                  Change
                </Button>
              </Box>
            )}
            <p style={{ color: 'grey', fontSize: '12px',marginLeft:'2px',marginTop:'2px' }}>File size must be than 256KB to 400KB</p>
          </Box>
        );

      case "multi-select":
        const selectedValues = formData[field.name] || field.defaultValue || [];
        const handleDelete = (valueToDelete: string | number) => {
          const newValues = selectedValues.filter((value: string | number) => value !== valueToDelete);
          setFormData(prev => ({ ...prev, [field.name]: newValues }));
          if (onChange) {
            onChange({ ...formData, [field.name]: newValues });
          }
        };

        return (
          <FormControl fullWidth sx={commonStyles}>
            <InputLabel required={false}>{field.label}</InputLabel>
            <Select
              multiple
              name={field.name}
              value={selectedValues}
              onChange={handleSelectChange}
              required={field.required}
              disabled={field.disabled}
              label={field.label}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Array.isArray(selected) && selected.map((value) => {
                    const label = field.options?.find(opt => opt.value === value)?.label;
                    return (
                      <Chip
                        key={String(value)}
                        label={label}
                        onDelete={() => handleDelete(value)}
                        onMouseDown={(event) => event.stopPropagation()}
                        deleteIcon={<span style={{ color: 'black' }}>×</span>}
                        sx={{
                          '& .MuiChip-deleteIcon': {
                            color: 'black',
                            '&:hover': {
                              color: 'black'
                            }
                          }
                        }}
                      />
                    );
                  })}
                </Box>
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

      case "time":
        return (
          <FormControl fullWidth sx={commonStyles}>
            <TextField
              fullWidth
              name={field.name}
              label={field.label}
              type="time"
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              required={field.required}
              disabled={field.disabled}
              sx={commonStyles}
              InputLabelProps={{
                shrink: true,
                required: false
              }}
              inputProps={{
                step: 300 // 5 min steps, adjust as needed
              }}
              helperText={field.helperText}
            />
          </FormControl>
        );

      case "photo-upload":
        return (
          <Box>
            <Button
              variant="contained"
              onClick={() => {
                setActivePhotoField(field.name);
                setOpenModal(true);
              }}
              sx={{ mb: 1 }}
            >
              {formData[field.name] ? "Change Photo" : "Upload Photo"}
            </Button>
            {formData[field.name] && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Photo selected: {formData[field.name]?.name}
                </Typography>
              </Box>
            )}
            <PhotoUploadModal
              open={openModal && activePhotoField === field.name}
              onClose={() => {
                setOpenModal(false);
                setActivePhotoField(null);
              }}
              onPhotoSelect={(photo) => {
                if (photo) {
                  setFormData(prev => {
                    const newData = {
                      ...prev,
                      [field.name]: photo
                    };
                    onChange?.(newData);
                    return newData;
                  });
                }
              }}
            />
          </Box>
        );

      default:
        return (
          <Box>
            <TextField
              fullWidth
              name={field.name}
              label={field.label}
              type={field.type}
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              required={field.required}
              disabled={field.disabled}
              sx={commonStyles}
              helperText={field.helperText}
              InputLabelProps={{
                shrink: field.type === 'date' ? true : undefined,
                required: false
              }}
              inputProps={{
                placeholder: field.type === 'date' ? 'YYYY-MM-DD' : undefined
              }}
            />
          </Box>
        );
    }
  };

  const switchFields = fields.filter(field => field.type === "switch");
  const nonSwitchFields = fields.filter(field => field.type !== "switch");

  return (
    <ThemeProvider theme={theme}>
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: '16px',
          p: { xs: 2, sm: 3, md: 4 },
          backgroundColor: muiTheme.palette.background.paper,
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
                  backgroundColor: muiTheme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: muiTheme.palette.primary.dark,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>

        {switchFields.length > 0 && (
          <Dialog 
            open={openModal} 
            onClose={handleModalClose}
            PaperProps={{
              sx: {
                borderRadius: '16px',
                minWidth: '360px',
                backgroundColor: muiTheme.palette.background.paper,
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
                  width: 10,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  backgroundColor: muiTheme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: muiTheme.palette.primary.dark,
                  }
                }}
              >
                Done
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Paper>
    </ThemeProvider>
  );
};

export default DynamicForm;
