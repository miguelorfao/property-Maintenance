import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

const Dashboard = ({ properties, issues, onPropertyClick }) => {
  const totalProperties = properties.length;
  const totalIssues = issues.length;
  const openIssues = issues.filter((issue) => issue.status === "open").length;
  const inProgressIssues = issues.filter(
    (issue) => issue.status === "in progress",
  ).length;
  const closedIssues = issues.filter(
    (issue) => issue.status === "closed",
  ).length;

  const flats = properties.filter((p) => p.type === "flat").length;
  const shops = properties.filter((p) => p.type === "shop").length;

  const totalHours = issues.reduce(
    (sum, issue) => sum + (Number(issue.hoursWorked) || 0),
    0,
  );

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    return new Date(d.setDate(diff));
  };

  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const hoursByProperty = properties.map((property) => {
    const propertyHours = issues
      .filter((issue) => issue.propertyId === property.id)
      .reduce((sum, issue) => sum + (Number(issue.hoursWorked) || 0), 0);
    return { name: property.name, hours: Number(propertyHours.toFixed(2)) };
  });

  const weeklyHoursByProperty = properties.map((property) => {
    const propertyHours = issues
      .filter((issue) => issue.propertyId === property.id && issue.checkOutTime)
      .filter((issue) => {
        const out = new Date(issue.checkOutTime);
        return out >= weekStart && out < weekEnd;
      })
      .reduce((sum, issue) => sum + (Number(issue.hoursWorked) || 0), 0);
    return { name: property.name, hours: Number(propertyHours.toFixed(2)) };
  });

  const totalWeeklyHours = weeklyHoursByProperty.reduce(
    (sum, item) => sum + item.hours,
    0,
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Properties
              </Typography>
              <Typography variant="h5" component="div">
                {totalProperties}
              </Typography>
              <Typography variant="body2">
                Flats: {flats}, Shops: {shops}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Issues
              </Typography>
              <Typography variant="h5" component="div">
                {totalIssues}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Hours Worked
              </Typography>
              <Typography variant="h5" component="div">
                {totalHours.toFixed(2)}
              </Typography>
              {hoursByProperty.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {hoursByProperty.map((item) => {
                    const property = properties.find(
                      (p) => p.name === item.name,
                    );
                    return (
                      <div key={item.name}>
                        <Typography
                          component="span"
                          sx={{
                            cursor: "pointer",
                            color: "primary.main",
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={() => onPropertyClick(property.id)}
                        >
                          {item.name}
                        </Typography>
                        : {item.hours.toFixed(2)}h
                      </div>
                    );
                  })}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Weekly Hours (all locations)
              </Typography>
              <Typography variant="h5" component="div">
                {totalWeeklyHours.toFixed(2)}
              </Typography>
              {weeklyHoursByProperty.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {weeklyHoursByProperty.map((item) => {
                    const property = properties.find(
                      (p) => p.name === item.name,
                    );
                    return (
                      <div key={item.name}>
                        <Typography
                          component="span"
                          sx={{
                            cursor: "pointer",
                            color: "primary.main",
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={() => onPropertyClick(property.id)}
                        >
                          {item.name}
                        </Typography>
                        : {item.hours.toFixed(2)}h
                      </div>
                    );
                  })}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Open Issues
              </Typography>
              <Typography variant="h5" component="div">
                {openIssues}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h5" component="div">
                {inProgressIssues}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Closed Issues
              </Typography>
              <Typography variant="h5" component="div">
                {closedIssues}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
