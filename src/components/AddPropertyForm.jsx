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
import { validatePropertyForm, sanitizeInput } from "../utils/validation";

const AddPropertyForm = ({ onAdd, onCancel }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("flat");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const validation = validatePropertyForm({ name, type, address });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      onAdd({
        name: sanitizeInput(name),
        type,
        address: sanitizeInput(address),
      });
      setName("");
      setType("flat");
      setAddress("");
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
        Add New Property
      </Typography>
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {Object.values(errors).map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </Alert>
      )}
      <TextField
        fullWidth
        label="Property Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        required
        error={!!errors.name}
        helperText={errors.name}
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        margin="normal"
        required
        error={!!errors.address}
        helperText={errors.address}
        disabled={loading}
        multiline
        rows={2}
      />
      <FormControl fullWidth margin="normal" disabled={loading}>
        <InputLabel>Type</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value="flat">Flat</MenuItem>
          <MenuItem value="shop">Shop</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 1 }}
          disabled={loading}
        >
          Add Property
        </Button>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddPropertyForm;
