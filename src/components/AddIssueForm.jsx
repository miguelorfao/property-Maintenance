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
} from "@mui/material";

const AddIssueForm = ({ properties, onAdd, onCancel }) => {
  const [propertyId, setPropertyId] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ propertyId, description, priority, checkInTime, checkOutTime });
    setPropertyId("");
    setDescription("");
    setPriority("medium");
    setCheckInTime("");
    setCheckOutTime("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto" }}
    >
      <Typography variant="h5" gutterBottom>
        Report New Issue
      </Typography>
      <FormControl fullWidth margin="normal">
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
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Priority</InputLabel>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        type="datetime-local"
        label="Check-in Time"
        value={checkInTime}
        onChange={(e) => setCheckInTime(e.target.value)}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        type="datetime-local"
        label="Check-out Time"
        value={checkOutTime}
        onChange={(e) => setCheckOutTime(e.target.value)}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" sx={{ mr: 1 }}>
          Report Issue
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default AddIssueForm;
