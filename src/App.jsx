import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "./firebase";
import { theme } from "./utils/theme";
import Login from "./components/Login.jsx";
import PropertyList from "./components/PropertyList.jsx";
import IssueList from "./components/IssueList.jsx";
import AddPropertyForm from "./components/AddPropertyForm.jsx";
import AddIssueForm from "./components/AddIssueForm.jsx";
import Dashboard from "./components/Dashboard.jsx";
import WeeklyReport from "./components/WeeklyReport.jsx";
import Invoice from "./components/Invoice.jsx";

function App() {
  const restrictedIssueReporterEmails = [
    "penny@gmail.com",
    "caferoyal@gmail.com",
    "anchor@gmail.com",
  ];
  const [properties, setProperties] = useState([]);
  const [issues, setIssues] = useState([]);
  const [view, setView] = useState("dashboard");
  const [dbError, setDbError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    id: null,
    type: null,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const isAdmin = user?.email === "admin@gmail.com";
  const isRestrictedIssueReporter = restrictedIssueReporterEmails.includes(
    user?.email || "",
  );

  // Check authentication state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProperties([]);
      setIssues([]);
      setView("dashboard");
      setSuccessMessage("Logged out successfully");
    } catch (error) {
      setErrorMessage("Failed to logout");
    }
  };

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
    if (
      isRestrictedIssueReporter &&
      !["issues", "addIssue"].includes(newView)
    ) {
      setErrorMessage(
        "This account can only report issues and view the issues list.",
      );
      setAnchorEl(null);
      return;
    }

    if (newView === "addProperty" && !isAdmin) {
      setErrorMessage("Only admin@gmail.com can add properties.");
      setAnchorEl(null);
      return;
    }

    if (newView === "weeklyReport" && !isAdmin) {
      setErrorMessage("Only admin@gmail.com can view weekly reports.");
      setAnchorEl(null);
      return;
    }

    setView(newView);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isRestrictedIssueReporter && !["issues", "addIssue"].includes(view)) {
      setView("issues");
    }
  }, [isRestrictedIssueReporter, view]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

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
            status: "pending",
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
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
    fetchIssues();
  }, [user]);

  const addProperty = async (property) => {
    if (!isAdmin) {
      setErrorMessage("Only admin@gmail.com can add properties.");
      return;
    }

    try {
      const propertyData = {
        ...property,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "properties"), propertyData);
      setProperties([...properties, { id: docRef.id, ...propertyData }]);
      setSuccessMessage("Property added successfully");
      setTimeout(() => setView("properties"), 1000);
    } catch (error) {
      console.error("Error adding property:", error);
      setErrorMessage("Failed to add property. Please try again.");
    }
  };

  const addIssue = async (issue) => {
    try {
      const hoursWorked = calculateHoursWorked(
        issue.checkInTime,
        issue.checkOutTime,
      );
      const username =
        user.displayName || user.email?.split("@")[0] || "Unknown";
      const issueData = {
        ...issue,
        status: "open",
        hoursWorked,
        userId: user.uid,
        userEmail: user.email || "",
        username,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "issues"), issueData);
      setIssues([...issues, { id: docRef.id, ...issueData }]);
      setSuccessMessage("Issue reported successfully");
      setTimeout(() => setView("issues"), 1000);
    } catch (error) {
      console.error("Error adding issue:", error);
      setErrorMessage("Failed to report issue. Please try again.");
    }
  };

  const handleDeleteClick = (id, type) => {
    setDeleteConfirm({ open: true, id, type });
  };

  const confirmDelete = async () => {
    const { id, type } = deleteConfirm;
    try {
      if (type === "property") {
        const propertyToDelete = properties.find((p) => p.id === id);
        if (propertyToDelete && propertyToDelete.userId !== user.uid) {
          setErrorMessage("You can only delete your own properties");
          return;
        }
        await deleteDoc(doc(db, "properties", id));
        setProperties(properties.filter((property) => property.id !== id));
        setSuccessMessage("Property deleted successfully");
      } else if (type === "issue") {
        await deleteDoc(doc(db, "issues", id));
        setIssues(issues.filter((issue) => issue.id !== id));
        setSuccessMessage("Issue deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setErrorMessage("Failed to delete. Please try again.");
    } finally {
      setDeleteConfirm({ open: false, id: null, type: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, id: null, type: null });
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

      if (newStatus === "pending" && !checkInTime) {
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

        updateData.closedByUid = user.uid;
        updateData.closedByEmail = user.email;
        updateData.closedAt = now;
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
                closedByUid:
                  newStatus === "closed" ? user.uid : issue.closedByUid,
                closedByEmail:
                  newStatus === "closed" ? user.email : issue.closedByEmail,
                closedAt: newStatus === "closed" ? now : issue.closedAt,
              }
            : issue,
        ),
      );
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  const deleteProperty = async (id) => {
    handleDeleteClick(id, "property");
  };

  const deleteIssue = async (id) => {
    handleDeleteClick(id, "issue");
  };

  // Show login screen if not authenticated or still checking
  if (checkingAuth || !user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLoginSuccess={() => setView("dashboard")} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Maintenance Management
          </Typography>
          <Typography
            variant="body2"
            sx={{ mr: 2, color: "rgba(255,255,255,0.7)" }}
          >
            {user.email}
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
                {!isRestrictedIssueReporter && (
                  <MenuItem onClick={() => handleMenuClick("dashboard")}>
                    Dashboard
                  </MenuItem>
                )}
                {!isRestrictedIssueReporter && (
                  <MenuItem onClick={() => handleMenuClick("properties")}>
                    Properties
                  </MenuItem>
                )}
                <MenuItem onClick={() => handleMenuClick("issues")}>
                  Issues
                </MenuItem>
                {isAdmin && !isRestrictedIssueReporter && (
                  <MenuItem onClick={() => handleMenuClick("addProperty")}>
                    Add Property
                  </MenuItem>
                )}
                <MenuItem onClick={() => handleMenuClick("addIssue")}>
                  Report Issue
                </MenuItem>
                {isAdmin && !isRestrictedIssueReporter && (
                  <MenuItem onClick={() => handleMenuClick("weeklyReport")}>
                    Weekly Report
                  </MenuItem>
                )}
                {isAdmin && !isRestrictedIssueReporter && (
                  <MenuItem onClick={() => handleMenuClick("invoice")}>
                    Invoice
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {!isRestrictedIssueReporter && (
                <Button
                  color="inherit"
                  onClick={() => handleMenuClick("dashboard")}
                >
                  Dashboard
                </Button>
              )}
              {!isRestrictedIssueReporter && (
                <Button
                  color="inherit"
                  onClick={() => handleMenuClick("properties")}
                >
                  Properties
                </Button>
              )}
              <Button color="inherit" onClick={() => setView("issues")}>
                Issues
              </Button>
              {isAdmin && !isRestrictedIssueReporter && (
                <Button
                  color="inherit"
                  onClick={() => handleMenuClick("addProperty")}
                >
                  Add Property
                </Button>
              )}
              <Button
                color="inherit"
                onClick={() => handleMenuClick("addIssue")}
              >
                Report Issue
              </Button>
              {isAdmin && !isRestrictedIssueReporter && (
                <Button
                  color="inherit"
                  onClick={() => handleMenuClick("weeklyReport")}
                >
                  Weekly Report
                </Button>
              )}
              {isAdmin && !isRestrictedIssueReporter && (
                <Button
                  color="inherit"
                  onClick={() => handleMenuClick("invoice")}
                >
                  Invoice
                </Button>
              )}
              <IconButton color="inherit" onClick={handleLogout} title="Logout">
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {dbError && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {dbError}
              </Alert>
            )}
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
                currentUser={user}
                readOnly={isRestrictedIssueReporter}
              />
            )}
            {view === "addProperty" && isAdmin && (
              <AddPropertyForm
                onAdd={addProperty}
                onCancel={() => setView("properties")}
              />
            )}
            {view === "addProperty" && !isAdmin && (
              <Alert severity="warning">
                Only admin@gmail.com can add properties.
              </Alert>
            )}
            {view === "addIssue" && (
              <AddIssueForm
                properties={properties}
                onAdd={addIssue}
                onCancel={() => setView("issues")}
              />
            )}
            {view === "weeklyReport" && isAdmin && (
              <WeeklyReport
                properties={properties}
                issues={issues}
                onPropertyClick={onPropertyClick}
              />
            )}
            {view === "weeklyReport" && !isAdmin && (
              <Alert severity="warning">
                Only admin@gmail.com can view weekly reports.
              </Alert>
            )}
            {view === "invoice" && isAdmin && (
              <Invoice properties={properties} issues={issues} user={user} />
            )}
            {view === "invoice" && !isAdmin && (
              <Alert severity="warning">
                Only admin@gmail.com can view invoices.
              </Alert>
            )}
          </>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this {deleteConfirm.type}? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
