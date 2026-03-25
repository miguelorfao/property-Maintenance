import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import PropertyList from "./components/PropertyList.jsx";
import IssueList from "./components/IssueList.jsx";
import AddPropertyForm from "./components/AddPropertyForm.jsx";
import AddIssueForm from "./components/AddIssueForm.jsx";
import Dashboard from "./components/Dashboard.jsx";
import WeeklyReport from "./components/WeeklyReport.jsx";

const theme = createTheme();

function App() {
  const [properties, setProperties] = useState([]);
  const [issues, setIssues] = useState([]);
  const [view, setView] = useState("dashboard");
  const [dbError, setDbError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const onPropertyClick = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setView("issues");
  };

  const calculateHoursWorked = (checkInTime, checkOutTime) => {
    if (!checkInTime || !checkOutTime) return null;
    const inTime = new Date(checkInTime);
    const outTime = new Date(checkOutTime);
    if (isNaN(inTime) || isNaN(outTime) || outTime <= inTime) return null;
    const hours = (outTime - inTime) / (1000 * 60 * 60);
    return Number(hours.toFixed(2));
  };

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (newView) => {
    setView(newView);
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const props = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(props);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setDbError(
          "Could not connect to Firestore. Please verify project configuration and ensure Firestore database exists.",
        );
        // Set sample data for demo
        setProperties([
          {
            id: "sample1",
            name: "Holiday Flat 1",
            type: "flat",
            address: "123 Beach St",
          },
          {
            id: "sample2",
            name: "Shop A",
            type: "shop",
            address: "456 Main St",
          },
        ]);
      }
    };
    const fetchIssues = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "issues"));
        const iss = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIssues(iss);
      } catch (error) {
        console.error("Error fetching issues:", error);
        setDbError(
          "Could not connect to Firestore. Please verify project configuration and ensure Firestore database exists.",
        );
        // Set sample data for demo
        setIssues([
          {
            id: "sampleIssue1",
            propertyId: "sample1",
            description: "Leaky faucet",
            status: "open",
            priority: "high",
            checkInTime: "2026-03-25T08:00",
            checkOutTime: "2026-03-25T09:30",
            hoursWorked: 1.5,
          },
          {
            id: "sampleIssue2",
            propertyId: "sample2",
            description: "Broken window",
            status: "in progress",
            priority: "medium",
            checkInTime: "2026-03-25T10:00",
            checkOutTime: "2026-03-25T11:45",
            hoursWorked: 1.75,
          },
          {
            id: "sampleIssue3",
            propertyId: "sample1",
            description: "Leaking tape in kitchen",
            status: "open",
            priority: "high",
          },
        ]);
      }
    };
    fetchProperties();
    fetchIssues();
  }, []);

  const addProperty = async (property) => {
    try {
      const docRef = await addDoc(collection(db, "properties"), property);
      setProperties([...properties, { id: docRef.id, ...property }]);
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  const addIssue = async (issue) => {
    try {
      const hoursWorked = calculateHoursWorked(
        issue.checkInTime,
        issue.checkOutTime,
      );
      const issueData = {
        ...issue,
        status: "open",
        hoursWorked,
      };

      const docRef = await addDoc(collection(db, "issues"), issueData);
      setIssues([...issues, { id: docRef.id, ...issueData }]);
    } catch (error) {
      console.error("Error adding issue:", error);
    }
  };

  const updateIssueStatus = async (id, newStatus) => {
    try {
      const now = new Date().toISOString();

      const issueToUpdate = issues.find((issue) => issue.id === id);
      if (!issueToUpdate) return;

      let checkInTime = issueToUpdate.checkInTime;
      let checkOutTime = issueToUpdate.checkOutTime;
      let hoursWorked = issueToUpdate.hoursWorked;

      const updateData = { status: newStatus };

      if (newStatus === "in progress" && !checkInTime) {
        checkInTime = now;
        updateData.checkInTime = checkInTime;
      }

      if (newStatus === "closed") {
        if (!checkInTime) {
          // If no check-in exists for closed, set check-in to now as a fallback
          checkInTime = now;
          updateData.checkInTime = checkInTime;
        }
        if (!checkOutTime) {
          checkOutTime = now;
          updateData.checkOutTime = checkOutTime;
        }

        const computedHours = calculateHoursWorked(checkInTime, checkOutTime);
        if (computedHours != null) {
          hoursWorked = computedHours;
          updateData.hoursWorked = hoursWorked;
        }
      }

      await updateDoc(doc(db, "issues", id), updateData);

      setIssues(
        issues.map((issue) =>
          issue.id === id
            ? {
                ...issue,
                status: newStatus,
                checkInTime,
                checkOutTime,
                hoursWorked,
              }
            : issue,
        ),
      );
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  const deleteProperty = async (id) => {
    try {
      await deleteDoc(doc(db, "properties", id));
      setProperties(properties.filter((property) => property.id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const deleteIssue = async (id) => {
    try {
      await deleteDoc(doc(db, "issues", id));
      setIssues(issues.filter((issue) => issue.id !== id));
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Maintenance Management
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleMenuClick("dashboard")}>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick("properties")}>
                  Properties
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick("issues")}>
                  Issues
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick("addProperty")}>
                  Add Property
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick("addIssue")}>
                  Report Issue
                </MenuItem>
                <MenuItem onClick={() => handleMenuClick("weeklyReport")}>
                  Weekly Report
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => setView("dashboard")}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={() => setView("properties")}>
                Properties
              </Button>
              <Button color="inherit" onClick={() => setView("issues")}>
                Issues
              </Button>
              <Button color="inherit" onClick={() => setView("addProperty")}>
                Add Property
              </Button>
              <Button color="inherit" onClick={() => setView("addIssue")}>
                Report Issue
              </Button>
              <Button color="inherit" onClick={() => setView("weeklyReport")}>
                Weekly Report
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {view === "dashboard" && (
          <Dashboard
            properties={properties}
            issues={issues}
            onPropertyClick={onPropertyClick}
          />
        )}
        {view === "properties" && (
          <PropertyList properties={properties} onDelete={deleteProperty} />
        )}
        {view === "issues" && (
          <IssueList
            issues={issues}
            properties={properties}
            onUpdateStatus={updateIssueStatus}
            onDelete={deleteIssue}
            selectedPropertyId={selectedPropertyId}
            onClearFilter={() => setSelectedPropertyId(null)}
          />
        )}
        {view === "addProperty" && (
          <AddPropertyForm
            onAdd={addProperty}
            onCancel={() => setView("properties")}
          />
        )}
        {view === "addIssue" && (
          <AddIssueForm
            properties={properties}
            onAdd={addIssue}
            onCancel={() => setView("issues")}
          />
        )}
        {view === "weeklyReport" && (
          <WeeklyReport
            properties={properties}
            issues={issues}
            onPropertyClick={onPropertyClick}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
