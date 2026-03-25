import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  return new Date(d.setDate(diff));
};

const WeeklyReport = ({ properties, issues, onPropertyClick }) => {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

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
        Weekly Hours Worked by Location
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {`Week from ${weekStart.toLocaleDateString()} to ${new Date(
          weekEnd.getTime() - 1,
        ).toLocaleDateString()}`}
      </Typography>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Total Weekly Hours
          </Typography>
          <Typography variant="h5" component="div">
            {totalWeeklyHours.toFixed(2)}
          </Typography>
          {weeklyHoursByProperty.map((item) => {
            const property = properties.find((p) => p.name === item.name);
            return (
              <Typography key={item.name} variant="body2" sx={{ mt: 1 }}>
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
              </Typography>
            );
          })}
        </CardContent>
      </Card>
    </Box>
  );
};

export default WeeklyReport;
