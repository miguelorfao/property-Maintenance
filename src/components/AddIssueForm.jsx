import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import { validateIssueForm, sanitizeInput } from "../utils/validation";

const AddIssueForm = ({ properties, onAdd, onCancel }) => {
  const [propertyId, setPropertyId] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const validation = validateIssueForm({ description, priority });
    if (!validation.valid || !propertyId) {
      setErrors({
        ...validation.errors,
        ...(propertyId ? {} : { property: "Please select a property" }),
      });
      return;
    }

    setLoading(true);
    try {
      onAdd({
        propertyId,
        description: sanitizeInput(description),
        priority,
      });
      setPropertyId("");
      setDescription("");
      setPriority("medium");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, mx: "auto" }}
    >
      <Typography variant="h5" gutterBottom>
        Report New Issue
      </Typography>
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {Object.values(errors).map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </Alert>
      )}
      <FormControl
        fullWidth
        margin="normal"
        disabled={loading}
        error={!!errors.property}
      >
        <InputLabel>Property</InputLabel>
        <Select
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          required
        >
          {properties.map((property) => (
            <MenuItem key={property.id} value={property.id}>
              {property.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        multiline
        rows={3}
        required
        error={!!errors.description}
        helperText={errors.description}
        disabled={loading}
      />
      <FormControl
        fullWidth
        margin="normal"
        disabled={loading}
        error={!!errors.priority}
      >
        <InputLabel>Priority</InputLabel>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 1 }}
          disabled={loading}
        >
          Report Issue
        </Button>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddIssueForm;
