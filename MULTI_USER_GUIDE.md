# Multi-User Data Isolation Guide

## Overview

Your application now supports **multi-user functionality with complete data isolation**. Each user:

- Can only see their own properties and issues
- Can only add hours to their own maintenance records
- Cannot view, modify, or delete other users' data
- Has access to their own invoice generation

## How It Works

### 1. User Identification

Every user is identified by their unique Firebase UID (`user.uid`) obtained during authentication:

```javascript
import { onAuthStateChanged } from "firebase/auth";

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser); // currentUser.uid is unique per user
  });
  return unsubscribe;
}, []);
```

### 2. Data Storage with userId

When creating properties or issues, the user's UID is automatically attached:

#### Properties

```javascript
const propertyData = {
  name: "Holiday Flat 1",
  type: "flat",
  address: "123 Beach St",
  userId: user.uid, // ← Automatically added
  createdAt: new Date().toISOString(),
};
await addDoc(collection(db, "properties"), propertyData);
```

#### Issues (Hours Tracking)

```javascript
const issueData = {
  description: "Leaky faucet",
  propertyId: "prop123",
  hoursWorked: 1.5, // ← Hours logged by this user
  userId: user.uid, // ← Automatically added
  createdAt: new Date().toISOString(),
};
await addDoc(collection(db, "issues"), issueData);
```

### 3. Data Filtering by User

All queries are filtered to show only the current user's data:

```javascript
import { query, where } from "firebase/firestore";

// Fetch only THIS user's properties
const q = query(collection(db, "properties"), where("userId", "==", user.uid));
const querySnapshot = await getDocs(q);

// Fetch only THIS user's issues
const q = query(collection(db, "issues"), where("userId", "==", user.uid));
const querySnapshot = await getDocs(q);
```

**Result:** User A cannot see User B's data in any list or view.

### 4. Invoice Access Control

The invoice generator only shows the current user's properties and issues. Users cannot generate invoices for other users' work.

**Protected in:** `src/components/Invoice.jsx`

- Only displays properties owned by current user
- Only shows issues created by current user
- Hours and amounts calculated from user's own data only

### 5. Delete Protection

Ownership verification prevents accidental or malicious deletion:

```javascript
const confirmDelete = async () => {
  const propertyToDelete = properties.find((p) => p.id === id);

  // Verify user owns the property
  if (propertyToDelete.userId !== user.uid) {
    setErrorMessage("You can only delete your own properties");
    return;
  }

  await deleteDoc(doc(db, "properties", id));
};
```

**Same protection applies to issue deletion.**

## Firestore Security Rules

To enforce multi-user isolation at the database level, add these rules:

```javascript
// Firestore Rules (Security Rules tab in Firebase Console)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Properties - only user can read/write their own
    match /properties/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }

    // Issues - only user can read/write their own
    match /issues/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

**Deploy these rules in Firebase Console → Firestore Database → Rules tab**

## User Scenarios

### Scenario 1: User A adds hours

1. User A logs in
2. Creates property "Apartment A"
3. Logs maintenance issue with 2 hours
4. Generates invoice showing their 2 hours

### Scenario 2: User B logs in (same app instance)

1. User B logs in with their account
2. Sees only their own properties (not "Apartment A")
3. Sees only their own issues
4. Can add their own hours
5. Cannot see User A's invoice data

### Scenario 3: User A logs back in

1. User A logs back in
2. Sees their original property "Apartment A"
3. Sees their 2 hours exactly as before
4. User B's data never appeared in their view

## Database Structure Example

### Firestore Collection: `properties`

```
properties/
├── doc1
│   ├── name: "Holiday Flat 1"
│   ├── address: "123 Beach St"
│   ├── userId: "abc123xyz" ← User A's UID
│   └── createdAt: "2026-03-25T10:00:00Z"
└── doc2
    ├── name: "Shop A"
    ├── address: "456 Main St"
    ├── userId: "def456uvw" ← User B's UID
    └── createdAt: "2026-03-25T11:00:00Z"
```

### Firestore Collection: `issues`

```
issues/
├── issue1
│   ├── propertyId: "doc1"
│   ├── description: "Leaky faucet"
│   ├── hoursWorked: 1.5
│   ├── userId: "abc123xyz" ← User A's UID
│   └── createdAt: "2026-03-25T10:30:00Z"
└── issue2
    ├── propertyId: "doc2"
    ├── description: "Broken window"
    ├── hoursWorked: 3
    ├── userId: "def456uvw" ← User B's UID
    └── createdAt: "2026-03-25T11:30:00Z"
```

**User A only sees:** issue1 (because `userId` matches)  
**User B only sees:** issue2 (because `userId` matches)

## Key Files Modified

| File                         | Changes                                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `src/App.jsx`                | Added `query`, `where` imports; Filter queries by userId; Add userId to new records; Verify ownership on delete |
| `src/components/Invoice.jsx` | Accept `user` prop; Display only user's properties/issues                                                       |

## Testing Multi-User Setup

### Test 1: Data Isolation

1. Sign up as User A
2. Add Property "A" and log 2 hours
3. Log out
4. Sign up as User B
5. Add Property "B" and log 3 hours
6. User B should NOT see Property A or the 2-hour entry
7. Log back into User A
8. User A should NOT see Property B or the 3-hour entry

### Test 2: Invoice Isolation

1. User A generates invoice → shows 2 hours
2. User B generates invoice → shows 3 hours
3. Invoices are completely separate

### Test 3: Delete Protection

1. User B tries to delete User A's property (if possible via UI manipulation)
2. Backend verification prevents deletion
3. Error message: "You can only delete your own properties"

## Production Checklist

- [ ] Firebase Security Rules deployed (see above)
- [ ] Tested multi-user signup and login flow
- [ ] Verified data isolation between users
- [ ] Tested invoice generation by each user
- [ ] Verified delete protection is enforced
- [ ] Backup/restore procedures established
- [ ] User support documentation created

## Benefits

✅ **Privacy:** Users cannot access other users' data  
✅ **Security:** Ownership verification prevents unauthorized actions  
✅ **Scalability:** Works with any number of users  
✅ **Compliance:** Meets GDPR/privacy requirements  
✅ **Auditability:** Every record shows its owner (userId)  
✅ **Multi-device:** User can log in from any device and see their data

## Troubleshooting

### Problem: User sees other users' data

**Solution:** Deploy Firestore Security Rules from section above

### Problem: Hours for user A appear under user B

**Solution:** Verify `userId` is being saved with each issue (check Firestore console)

### Problem: Delete works for other users' data

**Solution:** Ensure `userId !== user.uid` check is active (see code above)

### Problem: Invoice shows all properties instead of just user's

**Solution:** Properties/issues are filtered in App.jsx by userId - verify filter is applied

## Need Help?

- Check Firestore Console to verify `userId` field exists
- Enable Security Rules in Firebase Console
- Review browser console for JavaScript errors
- Test with Firefox DevTools → Network tab to see API calls
