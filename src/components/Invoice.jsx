import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const Invoice = ({ properties, issues, user }) => {
  if (user?.email !== "admin@gmail.com") {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Invoice access is restricted to admin@gmail.com
        </Typography>
      </Box>
    );
  }

  const invoiceRef = useRef(null);
  const [companyName, setCompanyName] = useState(
    import.meta.env.VITE_COMPANY_NAME || "Your Company",
  );
  const [address, setAddress] = useState(
    import.meta.env.VITE_COMPANY_ADDRESS || "",
  );
  const [bankHolder, setBankHolder] = useState(
    import.meta.env.VITE_BANK_HOLDER_NAME || "",
  );
  const [sortCode, setSortCode] = useState(
    import.meta.env.VITE_BANK_SORT_CODE || "",
  );
  const [accountNumber, setAccountNumber] = useState(
    import.meta.env.VITE_BANK_ACCOUNT_NUMBER || "",
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [rate, setRate] = useState(50);
  const trackedCloserEmail = "miguelorfao39@gmail.com";

  const invoiceIssues = issues.filter(
    (issue) =>
      issue.status === "closed" && issue.closedByEmail === trackedCloserEmail,
  );

  const filteredInvoiceIssues = selectedPropertyId
    ? invoiceIssues.filter((issue) => issue.propertyId === selectedPropertyId)
    : invoiceIssues;

  const exportPdf = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${selectedPropertyId || "all-properties"}-invoice.pdf`);
  };
  const getHoursForProperty = (propertyId) =>
    filteredInvoiceIssues
      .filter((issue) => issue.propertyId === propertyId)
      .reduce((sum, issue) => sum + (Number(issue.hoursWorked) || 0), 0);

  const data = (
    selectedPropertyId
      ? [properties.find((p) => p.id === selectedPropertyId)]
      : properties
  )
    .filter(Boolean)
    .map((property) => {
      const hours = getHoursForProperty(property.id);
      const amount = Number((hours * rate).toFixed(2));
      return { id: property.id, name: property.name, hours, amount };
    });

  const totalHours = data.reduce((sum, row) => sum + row.hours, 0);
  const totalAmount = Number(
    data.reduce((sum, row) => sum + row.amount, 0).toFixed(2),
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Invoice Generator
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="Company / Personal Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          sx={{ minWidth: 240 }}
        />
        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{ minWidth: 240 }}
        />
        <TextField
          label="Bank Account Holder"
          value={bankHolder}
          onChange={(e) => setBankHolder(e.target.value)}
          sx={{ minWidth: 240 }}
        />
        <TextField
          label="Sort Code"
          value={sortCode}
          onChange={(e) => setSortCode(e.target.value)}
          sx={{ minWidth: 120 }}
        />
        <TextField
          label="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          sx={{ minWidth: 120 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Property</InputLabel>
          <Select
            value={selectedPropertyId}
            label="Property"
            onChange={(e) => setSelectedPropertyId(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {properties.map((property) => (
              <MenuItem key={property.id} value={property.id}>
                {property.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="number"
          label="Hourly Rate"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          InputProps={{ inputProps: { min: 0, step: 0.5 } }}
        />
      </Box>
      <Box ref={invoiceRef} sx={{ p: 2, backgroundColor: "#fff" }}>
        <Box mb={2}>
          <Typography variant="h5" fontWeight="bold">
            {companyName}
          </Typography>
          {address && (
            <Typography variant="body2" color="textSecondary">
              {address}
            </Typography>
          )}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Invoice generated on {new Date().toLocaleDateString()}
          </Typography>
          {selectedPropertyId && (
            <Typography variant="body2" color="textSecondary">
              Property:{" "}
              {properties.find((p) => p.id === selectedPropertyId)?.name || "-"}
            </Typography>
          )}
        </Box>
        <Box mb={2} sx={{ borderTop: "1px solid #ccc", pt: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            Banking Details
          </Typography>
          {bankHolder && (
            <Typography variant="body2">
              Account Holder: {bankHolder}
            </Typography>
          )}
          {sortCode && (
            <Typography variant="body2">Sort Code: {sortCode}</Typography>
          )}
          {accountNumber && (
            <Typography variant="body2">
              Account Number: {accountNumber}
            </Typography>
          )}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Issue</TableCell>
                <TableCell>Property</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Hours</TableCell>
                <TableCell align="right">Rate</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoiceIssues.map((issue) => {
                const propertyName =
                  properties.find((p) => p.id === issue.propertyId)?.name ||
                  "-";
                const amount = Number(
                  (Number(issue.hoursWorked || 0) * rate).toFixed(2),
                );
                return (
                  <TableRow key={issue.id}>
                    <TableCell>{issue.id.slice(0, 8)}</TableCell>
                    <TableCell>{propertyName}</TableCell>
                    <TableCell>{issue.description}</TableCell>
                    <TableCell align="right">
                      {Number(issue.hoursWorked || 0).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">£{rate.toFixed(2)}</TableCell>
                    <TableCell align="right">£{amount.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography fontWeight="bold">Total</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight="bold">
                    {totalHours.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell />
                <TableCell align="right">
                  <Typography fontWeight="bold">
                    £{totalAmount.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            alert(
              `Invoice: £${totalAmount.toFixed(2)} for ${totalHours.toFixed(2)} hours`,
            )
          }
        >
          Generate Invoice
        </Button>
        <Button variant="outlined" color="secondary" onClick={exportPdf}>
          Export PDF
        </Button>
      </Box>
    </Box>
  );
};

export default Invoice;
