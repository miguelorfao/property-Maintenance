import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

const Dashboard = ({ properties, issues }) => {
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
