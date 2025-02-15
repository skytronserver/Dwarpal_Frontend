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
  SelectChangeEvent
} from "@mui/material";
import { DynamicFormProps, Field } from "../../types/form.types";

const DynamicForm = ({fields, onSubmit ,initialValues}: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" 
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

  const renderField = (field: Field) => {
    switch (field.type) {
      case "select":
        return (
          <FormControl fullWidth>
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
          />
        );

      case "radio":
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              name={field.name}
              value={formData[field.name] || field.defaultValue || ""}
              onChange={handleInputChange}
            >
              {field.options?.map((option: { label: string; value: any }) => (
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

      case "file":
        return (
          <TextField
            fullWidth
            type="file"
            name={field.name}
            label={field.label}
            onChange={handleInputChange}
            required={field.required}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              accept: field.accept || "image/*,.pdf,.doc,.docx"
            }}
          />
        );

        case "multiselect":
          return (
            <FormControl fullWidth>
              <InputLabel>{field.label}</InputLabel>
              <Select
                multiple
                name={field.name}
                value={formData[field.name] || field.defaultValue || []}
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

      default:
        return (
          <TextField
            fullWidth
            name={field.name}
            label={field.label}
            type={field.type}
            value={formData[field.name] || field.defaultValue || ""}
            onChange={handleInputChange}
            required={field.required}
          />
        );
    }
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {fields.map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                {renderField(field)}
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
    </Box>
  );
};

export default DynamicForm;