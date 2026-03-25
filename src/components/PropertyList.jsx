import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const PropertyList = ({ properties, onDelete }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Properties ({properties.length})
      </Typography>
      {properties.length === 0 ? (
        <Typography color="textSecondary">No properties added yet.</Typography>
      ) : (
        <List>
          {properties.map((property) => (
            <ListItem key={property.id} divider>
              <ListItemText
                primary={property.name}
                secondary={`${property.type} - ${property.address || "No address"}`}
              />
              <Chip
                label={property.type}
                color={property.type === "flat" ? "primary" : "secondary"}
              />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDelete(property.id)}
                title="Delete property"
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default PropertyList;
