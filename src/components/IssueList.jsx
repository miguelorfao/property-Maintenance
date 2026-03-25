import React, { useState } from "react";
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
  Tabs,
  Tab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const IssueList = ({
  issues,
  properties,
  onUpdateStatus,
  onDelete,
  selectedPropertyId,
  onClearFilter,
  currentUser,
  readOnly = false,
}) => {
  const [tab, setTab] = useState("open");

  const getPropertyName = (id) =>
    properties.find((p) => p.id === id)?.name || "Unknown";

  const getRecordedByName = (issue) => {
    if (issue.username) return issue.username;
    if (issue.userEmail) return issue.userEmail.split("@")[0];
    return issue.userId || "Unknown";
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    const parsed = new Date(dateTime);
    return isNaN(parsed) ? "-" : parsed.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "error";
      case "pending":
        return "warning";
      case "closed":
        return "success";
      default:
        return "default";
    }
  };

  const filteredByProperty = selectedPropertyId
    ? issues.filter((issue) => issue.propertyId === selectedPropertyId)
    : issues;
  const filteredIssues = filteredByProperty.filter(
    (issue) => issue.status === tab,
  );

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Maintenance Issues
        {selectedPropertyId && (
          <Typography variant="subtitle1" component="span" sx={{ ml: 2 }}>
            for {getPropertyName(selectedPropertyId)} ({filteredIssues.length})
          </Typography>
        )}
      </Typography>
      {selectedPropertyId && (
        <Button onClick={onClearFilter} variant="outlined" sx={{ mb: 2 }}>
          Show All Issues
        </Button>
      )}
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab
          label={`Open (${issues.filter((i) => i.status === "open").length})`}
          value="open"
        />
        <Tab
          label={`Pending (${issues.filter((i) => i.status === "pending").length})`}
          value="pending"
        />
        <Tab
          label={`Closed (${issues.filter((i) => i.status === "closed").length})`}
          value="closed"
        />
      </Tabs>
      {filteredIssues.length === 0 ? (
        <Typography color="textSecondary">No {tab} issues.</Typography>
      ) : (
        <List>
          {filteredIssues.map((issue) =>
            (() => {
              return (
                <ListItem
                  key={issue.id}
                  divider
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    pb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", width: "100%", mb: 1 }}>
                    <ListItemText
                      primary={issue.description}
                      secondary={
                        <>
                          <div>
                            Property: {getPropertyName(issue.propertyId)}
                          </div>
                          <div>Priority: {issue.priority}</div>
                          <div>
                            Check-in: {formatDateTime(issue.checkInTime)} |
                            Check-out: {formatDateTime(issue.checkOutTime)}
                          </div>
                          <div>
                            Hours Worked:{" "}
                            {issue.hoursWorked != null
                              ? issue.hoursWorked
                              : "-"}
                          </div>
                          <div>Recorded by: {getRecordedByName(issue)}</div>
                        </>
                      }
                      sx={{ flex: 1 }}
                    />
                    <Chip
                      label={issue.status}
                      color={getStatusColor(issue.status)}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={issue.status}
                        disabled={readOnly}
                        onChange={(e) =>
                          onUpdateStatus(issue.id, e.target.value)
                        }
                        aria-label="Update issue status"
                      >
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton
                      edge="end"
                      aria-label="delete issue"
                      disabled={readOnly}
                      onClick={() => onDelete(issue.id)}
                      title="Delete issue"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  {readOnly && (
                    <Typography variant="caption" color="text.secondary">
                      This account can view issues only and cannot change them.
                    </Typography>
                  )}
                </ListItem>
              );
            })(),
          )}
        </List>
      )}
    </Box>
  );
};

export default IssueList;
