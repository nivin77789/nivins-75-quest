# Admin Setup Guide

This guide explains how to set up admin users in your Cult.fit clone application using Firebase.

## Creating an Admin User

To grant admin access to a user, you need to add a document to the `userRoles` collection in Firestore.

### Steps:

1. **Go to Firebase Console**
   - Navigate to [Firebase Console](https://console.firebase.google.com/)
   - Select your project

2. **Open Firestore Database**
   - Click on "Firestore Database" in the left sidebar
   - Click on "Start collection" if this is your first collection

3. **Create the userRoles Collection**
   - Collection ID: `userRoles`
   - Click "Next"

4. **Add an Admin User Document**
   - Document ID: `<user-uid>` (Use the UID of the user you want to make admin)
   - Add field:
     - Field: `role`
     - Type: `string`
     - Value: `admin`
   - Click "Save"

### Finding User UID:

You can find a user's UID in two ways:

**Method 1: Firebase Console**
1. Go to Authentication in Firebase Console
2. Click on "Users" tab
3. Find the user and copy their UID

**Method 2: From App**
1. Have the user log in to the app
2. Open browser console (F12)
3. Run: `console.log(auth.currentUser.uid)`

### Example Firestore Structure:

```
userRoles (collection)
  └── abc123xyz456 (document - user UID)
      └── role: "admin"
```

## Admin Features

Once a user has the admin role, they will see:

1. **Admin Panel** link in the sidebar
2. Access to `/admin` route
3. Platform statistics dashboard
4. User management capabilities (coming soon)

## Security Notes

- Admin roles are stored in a separate `userRoles` collection for security
- Access is verified server-side (not just client-side)
- Only users with `role: "admin"` can access admin features
- Regular users cannot modify their own roles

## Removing Admin Access

To remove admin access:
1. Go to Firestore Database
2. Navigate to `userRoles` collection
3. Delete the document with the user's UID
   OR
4. Change the `role` field to something else like `"user"`
