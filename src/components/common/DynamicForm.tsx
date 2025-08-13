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
  createTheme,
  Alert
} from "@mui/material";
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import { DynamicFormProps, Field } from "../../types/form.types";
import { useTheme } from "@mui/material/styles";
import PhotoUploadModal from "../gatePass/PhotoUploadModal";
import * as Yup from 'yup';

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
  const [fileError, setFileError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const muiTheme = useTheme();


  // Create validation schema from fields
  const createValidationSchema = () => {
    const schemaObject: Record<string, any> = {};

    fields.forEach(field => {
      if (field.validation) {
        schemaObject[field.name] = field.validation;
      }
    });

    return Yup.object().shape(schemaObject);
  };

  // Validate a single field
  const validateField = async (fieldName: string, value: any) => {
    const schema = createValidationSchema();
    try {
      await schema.validateAt(fieldName, { [fieldName]: value });
      return null;
    } catch (error: any) {
      return error.message;
    }
  };

  // Validate all fields
  const validateAllFields = async (data: Record<string, any>) => {
    const schema = createValidationSchema();
    try {
      await schema.validate(data, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error: any) {
      const errors: Record<string, string> = {};
      if (error.inner) {
        error.inner.forEach((err: any) => {
          errors[err.path] = err.message;
        });
      }
      return { isValid: false, errors };
    }
  };

  const validateFile = (file: File, fieldName: string, fieldLabel: string): string | null => {
    // Check file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, PNG, and JPG files are allowed';
    }

    // Skip size validation for photo fields
    const isPhotoField = fieldName === 'photo' || fieldLabel.toLowerCase() === 'photo';
    if (!isPhotoField) {
      // Check file size (256KB to 400KB)
      // const minSize = 256 * 1024; // 256KB in bytes
      const maxSize = 400 * 1024; // 400KB in bytes
      if (file.size > maxSize) {
        return 'File size must be less than 400KB';
      }
    }

    return null;
  };

  // Allow only digits, max 10, update form data
  const handlePhoneNumberInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string
  ) => {
    let value = e.target.value;

    // Keep only digits
    value = value.replace(/\D/g, '');

    // Truncate to 10 digits max
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };


  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
    const { name, value, type } = e.target;
    setFileError(null); // Reset file error on new input

    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [name]: true }));

    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        // Get the field object to access the label
        const field = fields.find(f => f.name === name);
        const error = validateFile(file, name, field?.label || '');

        if (error) {
          setFileError(error);
          // Reset the file input
          (e.target as HTMLInputElement).value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          setFormData(prev => {
            const newData = {
              ...prev,
              [name]: file
            };
            onChange?.(newData);
            return newData;
          });
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    const newValue = type === "checkbox" || type === "switch"
      ? (e.target as HTMLInputElement).checked
      : value;

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: newValue
      };
      onChange?.(newData);
      return newData;
    });

    // Validate the field
    const error = await validateField(name, newValue);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  };

  const handleSelectChange = async (e: SelectChangeEvent<any>) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [name]: true }));

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      onChange?.(newData);
      return newData;
    });

    // Validate the field
    const error = await validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    fields.forEach(field => {
      allTouched[field.name] = true;
    });
    setTouchedFields(allTouched);

    // Validate all fields
    const { isValid, errors } = await validateAllFields(formData);

    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    // Clear errors if validation passes
    setFieldErrors({});
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
    console.log('Array Field Change:', { fieldName, index, value });
    setFormData(prev => {
      // Parse the field path
      const [arrayName, , fieldKey] = fieldName.split('.');

      // Get the current array
      const currentArray = [...(prev[arrayName] || [])];

      // Ensure the object at the index exists
      if (!currentArray[index]) {
        currentArray[index] = {};
      }

      // Update the specific field in the array item
      currentArray[index] = {
        ...currentArray[index],
        [fieldKey]: Object.values(value)[0]
      };

      const newData = {
        ...prev,
        [arrayName]: currentArray
      };

      console.log('Updated Form Data:', newData);
      if (onChange) onChange(newData);
      return newData;
    });
  };

  const renderArrayField = (field: Field) => {
    const arrayValue = formData[field.name] || [];
    const hasError = touchedFields[field.name] && fieldErrors[field.name];
    const errorMessage = fieldErrors[field.name];
    console.log('Rendering Array Field:', { fieldName: field.name, value: arrayValue });

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
        {hasError && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            {errorMessage}
          </Typography>
        )}
      </Box>
    );
  };

  const renderFileInput = (field: Field) => {
    const isPhotoField = field.name === 'photo' || field.label.toLowerCase() === 'photo';
    const hasError = touchedFields[field.name] && fieldErrors[field.name];
    const errorMessage = fieldErrors[field.name];

    return (
      <Box>
        {!formData[field.name] ? (
          <Box>
            <TextField
              fullWidth
              type="file"
              name={field.name}
              label={field.label}
              onChange={handleInputChange}
              disabled={field.disabled}
              required={field.required}
              error={!!hasError}
              InputLabelProps={{ shrink: true }}
              sx={commonStyles}
              inputProps={{
                accept: isPhotoField ? 'image/png,image/jpeg' : '.pdf,.png,.jpg,.jpeg'
              }}
            />
            {(fileError || hasError) && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {fileError || errorMessage}
              </Alert>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, ml: 1 }}>
              {isPhotoField ?
                'Accepted file types: PNG, JPG' :
                'Accepted file types: PDF, PNG, JPG (256KB to 400KB)'}
            </Typography>
          </Box>
        ) : (
          isPhotoField ? (
            // Photo field UI with preview
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
                {formData[field.name].name}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => {
                  setFormData(prev => ({ ...prev, [field.name]: null }));
                  setFileError(null);
                }}
              >
                Change Photo
              </Button>
            </Box>
          ) : (
            // Simple UI for other file types
            <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                    {formData[field.name].name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Size: {(formData[field.name].size / 1024).toFixed(1)}KB
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, [field.name]: null }));
                    setFileError(null);
                  }}
                >
                  Change
                </Button>
              </Box>
            </Box>
          )
        )}
      </Box>
    );
  };

  const renderField = (field: Field) => {
    const hasError = touchedFields[field.name] && fieldErrors[field.name];
    const errorMessage = fieldErrors[field.name];

    if (
      field.type === "text" &&
      (field.name.includes("phone") ||
        field.name.includes("mobile") ||
        field.name.includes("contact") ||
        field.name.includes("emergency"))
    ) {
      return (
        <TextField
          name={field.name}
          label={field.label}
          value={formData[field.name] || ''}
          onChange={(e) => handlePhoneNumberInput(e, field.name)}
          required={field.required}
          error={!!(touchedFields[field.name] && fieldErrors[field.name])}
          helperText={touchedFields[field.name] && fieldErrors[field.name] ? fieldErrors[field.name] : field.helperText}
          fullWidth
          disabled={field.disabled}
        />

      );
    }


    switch (field.type) {
      case "array":
        return renderArrayField(field);

      case "select":
        return (
          <FormControl fullWidth sx={commonStyles} error={!!hasError}>
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
                  disabled={(option as any).disabled}
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
            {!hasError && field.helperText && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {field.helperText}
              </Typography>
            )}
            {hasError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errorMessage}
              </Typography>
            )}
          </FormControl>
        );

      case "checkbox":
        return (
          <Box>
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
            {hasError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errorMessage}
              </Typography>
            )}
          </Box>
        );

      case "radio":
        return (
          <FormControl component="fieldset" error={!!hasError}>
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
            {hasError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errorMessage}
              </Typography>
            )}
          </FormControl>
        );

      case "switch":
        return (
          <Box>
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
            {hasError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errorMessage}
              </Typography>
            )}
          </Box>
        );

      case "file":
        return renderFileInput(field);


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
          <FormControl fullWidth sx={commonStyles} error={!!hasError}>
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
                <MenuItem key={String(option.value)} value={option.value} disabled={(option as any).disabled}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {!hasError && field.helperText && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {field.helperText}
              </Typography>
            )}
            {hasError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errorMessage}
              </Typography>
            )}
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
              error={!!hasError}
              helperText={hasError ? errorMessage : field.helperText}
              InputLabelProps={{
                shrink: true,
                required: false
              }}
              inputProps={{
                step: 300 // 5 min steps, adjust as needed
              }}
            />
          </FormControl>
        );

      case "photo-upload":
        return (
          <Box>
            {!formData[field.name] ? (
              <Button
                variant="contained"
                onClick={() => {
                  setActivePhotoField(field.name);
                  setOpenModal(true);
                }}
                sx={{ mb: 1 }}
              >
                Upload Photo
              </Button>
            ) : (
              // Photo field UI with preview
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
                  {formData[field.name].name}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    setActivePhotoField(field.name);
                    setOpenModal(true);
                  }}
                >
                  {formData[field.name].name === "webcam-photo.jpg" ? "Retake" : "Change Photo"}
                </Button>
              </Box>
            )}
            {hasError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errorMessage}
              </Typography>
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

      case 'multidate':
        return (
          <FormControl fullWidth sx={{ ...commonStyles, mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>{field.label}</Typography>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={null}
                  onChange={(newDate) => {
                    if (newDate) {
                      const dateStr = dayjs(newDate).format('YYYY-MM-DD');
                      const currentDates = formData[field.name] || [];
                      const newDates = currentDates.includes(dateStr)
                        ? currentDates.filter((date: string) => date !== dateStr)
                        : [...currentDates, dateStr];

                      setFormData(prev => {
                        const newData = {
                          ...prev,
                          [field.name]: newDates
                        };
                        onChange?.(newData);
                        return newData;
                      });
                    }
                  }}
                  slots={{
                    day: (dayProps) => {
                      const dateStr = dayjs(dayProps.day).format('YYYY-MM-DD');
                      const isSelected = (formData[field.name] || []).includes(dateStr);

                      return (
                        <PickersDay
                          {...dayProps}
                          selected={isSelected}
                          sx={{
                            '&.Mui-selected': {
                              backgroundColor: '#ff0000 !important',
                              color: 'white !important',
                              '&:hover': {
                                backgroundColor: '#cc0000 !important',
                              }
                            }
                          }}
                        />
                      );
                    }
                  }}
                />
                {hasError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errorMessage}
                  </Typography>
                )}
              </Box>
            </LocalizationProvider>
          </FormControl>
        );

      case 'date':
        if (field.name === 'date_of_birth') {
          // Calculate 18 years ago
          const today = new Date();
          const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
          return (
            <TextField
              fullWidth
              name={field.name}
              label={field.label}
              type="date"
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              required={field.required}
              disabled={field.disabled}
              sx={commonStyles}
              helperText={field.helperText}
              InputLabelProps={{ shrink: true, required: false }}
              inputProps={{
                max: maxDate.toISOString().split('T')[0],
                placeholder: 'YYYY-MM-DD',
              }}
              onFocus={e => {
                // Set the default value to 18 years ago if empty
                if (!formData[field.name]) {
                  const eighteenAgo = maxDate.toISOString().split('T')[0];
                  e.currentTarget.value = eighteenAgo;
                }
              }}
            />
          );
        }
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
              error={!!hasError}
              helperText={hasError ? errorMessage : field.helperText}
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
              error={!!hasError}
              helperText={hasError ? errorMessage : field.helperText}
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
