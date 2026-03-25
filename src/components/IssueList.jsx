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
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const IssueList = ({
  issues,
  properties,
  onUpdateStatus,
  onDelete,
  selectedPropertyId,
  onClearFilter,
}) => {
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

  const filteredIssues = selectedPropertyId
    ? issues.filter((issue) => issue.propertyId === selectedPropertyId)
    : issues;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Maintenance Issues
        {selectedPropertyId && (
          <Typography variant="subtitle1" component="span" sx={{ ml: 2 }}>
            for {getPropertyName(selectedPropertyId)}
          </Typography>
        )}
      </Typography>
      {selectedPropertyId && (
        <Button onClick={onClearFilter} variant="outlined" sx={{ mb: 2 }}>
          Show All Issues
        </Button>
      )}
      <List>
        {filteredIssues.map((issue) => (
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
