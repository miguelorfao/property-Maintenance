import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const IssueList = ({ issues, properties, onUpdateStatus, onDelete }) => {
  const getPropertyName = (id) =>
    properties.find((p) => p.id === id)?.name || "Unknown";

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    const parsed = new Date(dateTime);
    return isNaN(parsed) ? "-" : parsed.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "error";
      case "in progress":
        return "warning";
      case "closed":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Maintenance Issues
      </Typography>
      <List>
        {issues.map((issue) => (
          <ListItem key={issue.id} divider>
            <ListItemText
              primary={issue.description}
              secondary={
                <>
                  <div>
                    Property: {getPropertyName(issue.propertyId)} - Priority:{" "}
                    {issue.priority}
                  </div>
                  <div>
                    Check-in: {formatDateTime(issue.checkInTime)} | Check-out:{" "}
                    {formatDateTime(issue.checkOutTime)}
                  </div>
                  <div>
                    Hours Worked:{" "}
                    {issue.hoursWorked != null ? issue.hoursWorked : "-"}
                  </div>
                </>
              }
            />
            <Chip label={issue.status} color={getStatusColor(issue.status)} />
            <FormControl size="small" sx={{ ml: 2, minWidth: 120 }}>
              <Select
                value={issue.status}
                onChange={(e) => onUpdateStatus(issue.id, e.target.value)}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in progress">In Progress</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDelete(issue.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default IssueList;
