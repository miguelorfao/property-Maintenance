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

const AddPropertyForm = ({ onAdd, onCancel }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("flat");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name, type, address });
    setName("");
    setAddress("");
    setType("flat");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto" }}
    >
      <Typography variant="h5" gutterBottom>
        Add New Property
      </Typography>
      <TextField
        fullWidth
        label="Property Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        required
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value="flat">Flat</MenuItem>
          <MenuItem value="shop">Shop</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        margin="normal"
        required
      />
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" sx={{ mr: 1 }}>
          Add Property
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default AddPropertyForm;
