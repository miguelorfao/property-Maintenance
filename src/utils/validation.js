/**
 * Input validation and sanitization utilities
 */

// Sanitize string inputs to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input
    .replace(/[<>]/g, (char) => (char === "<" ? "&lt;" : "&gt;"))
    .trim();
};

// Validate property name
export const validatePropertyName = (name) => {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Property name is required" };
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return {
      valid: false,
      error: "Property name must be at least 2 characters",
    };
  }
  if (trimmed.length > 100) {
    return {
      valid: false,
      error: "Property name must not exceed 100 characters",
    };
  }
  return { valid: true };
};

// Validate property type
export const validatePropertyType = (type) => {
  const validTypes = ["flat", "shop"];
  if (!validTypes.includes(type)) {
    return { valid: false, error: "Invalid property type" };
  }
  return { valid: true };
};

// Validate address
export const validateAddress = (address) => {
  if (!address || typeof address !== "string") {
    return { valid: false, error: "Address is required" };
  }
  const trimmed = address.trim();
  if (trimmed.length < 5) {
    return { valid: false, error: "Address must be at least 5 characters" };
  }
  if (trimmed.length > 200) {
    return { valid: false, error: "Address must not exceed 200 characters" };
  }
  return { valid: true };
};

// Validate issue description
export const validateDescription = (description) => {
  if (!description || typeof description !== "string") {
    return { valid: false, error: "Description is required" };
  }
  const trimmed = description.trim();
  if (trimmed.length < 5) {
    return { valid: false, error: "Description must be at least 5 characters" };
  }
  if (trimmed.length > 500) {
    return {
      valid: false,
      error: "Description must not exceed 500 characters",
    };
  }
  return { valid: true };
};

// Validate priority
export const validatePriority = (priority) => {
  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(priority)) {
    return { valid: false, error: "Invalid priority level" };
  }
  return { valid: true };
};

// Validate hours worked
export const validateHoursWorked = (hours) => {
  const numHours = Number(hours);
  if (isNaN(numHours) || numHours < 0) {
    return { valid: false, error: "Hours must be a positive number" };
  }
  if (numHours > 24) {
    return { valid: false, error: "Hours cannot exceed 24 per day" };
  }
  return { valid: true };
};

// Validate hourly rate
export const validateRate = (rate) => {
  const numRate = Number(rate);
  if (isNaN(numRate) || numRate <= 0) {
    return { valid: false, error: "Rate must be a positive number" };
  }
  if (numRate > 1000) {
    return { valid: false, error: "Rate seems unusually high (max 1000)" };
  }
  return { valid: true };
};

// Validate bank sort code (UK format: XX-XX-XX)
export const validateSortCode = (sortCode) => {
  if (!sortCode) return { valid: true }; // Optional
  const regex = /^\d{2}-\d{2}-\d{2}$/;
  if (!regex.test(sortCode)) {
    return { valid: false, error: "Sort code must be in format XX-XX-XX" };
  }
  return { valid: true };
};

// Validate bank account number
export const validateAccountNumber = (accountNumber) => {
  if (!accountNumber) return { valid: true }; // Optional
  if (!/^\d{8}$/.test(accountNumber)) {
    return { valid: false, error: "Account number must be 8 digits" };
  }
  return { valid: true };
};

// Validate dates (check-in/check-out)
export const validateCheckInOut = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return {
      valid: false,
      error: "Both check-in and check-out times are required",
    };
  }
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime())) {
    return { valid: false, error: "Invalid check-in date" };
  }
  if (isNaN(checkOutDate.getTime())) {
    return { valid: false, error: "Invalid check-out date" };
  }
  if (checkOutDate <= checkInDate) {
    return {
      valid: false,
      error: "Check-out time must be after check-in time",
    };
  }

  const maxHours = 24;
  const diffHours = (checkOutDate - checkInDate) / (1000 * 60 * 60);
  if (diffHours > maxHours) {
    return {
      valid: false,
      error: `Time period cannot exceed ${maxHours} hours`,
    };
  }

  return { valid: true };
};

// Batch validation for property form
export const validatePropertyForm = (data) => {
  const errors = {};

  const nameValidation = validatePropertyName(data.name);
  if (!nameValidation.valid) errors.name = nameValidation.error;

  const typeValidation = validatePropertyType(data.type);
  if (!typeValidation.valid) errors.type = typeValidation.error;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Batch validation for issue form
export const validateIssueForm = (data) => {
  const errors = {};

  const descriptionValidation = validateDescription(data.description);
  if (!descriptionValidation.valid)
    errors.description = descriptionValidation.error;

  const priorityValidation = validatePriority(data.priority);
  if (!priorityValidation.valid) errors.priority = priorityValidation.error;

  if (data.checkInTime && data.checkOutTime) {
    const dateValidation = validateCheckInOut(
      data.checkInTime,
      data.checkOutTime,
    );
    if (!dateValidation.valid) {
      errors.times = dateValidation.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
