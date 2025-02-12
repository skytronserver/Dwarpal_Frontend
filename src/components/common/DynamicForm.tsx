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
  FormLabel
} from "@mui/material";
import { DynamicFormProps, Field } from "../../types/form.types";

const DynamicForm = ({fields, onSubmit ,initialValues}: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" 
        ? checked 
        : type === "file" 
          ? files?.[0] || null 
          : value
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
          <TextField
            select
            fullWidth
            name={field.name}
            label={field.label}
            value={formData[field.name] || field.defaultValue || ""}
            onChange={handleChange}
            required={field.required}
          >
            {field.options?.map((option: { label: string; value: any }) => (
              <MenuItem key={String(option.value)} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );

      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                name={field.name}
                checked={formData[field.name] || false}
                onChange={handleChange}
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
              onChange={handleChange}
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
            onChange={handleChange}
            required={field.required}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              accept: field.accept || "image/*,.pdf,.doc,.docx"
            }}
          />
        );

      default:
        return (
          <TextField
            fullWidth
            name={field.name}
            label={field.label}
            type={field.type}
            value={formData[field.name] || field.defaultValue || ""}
            onChange={handleChange}
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