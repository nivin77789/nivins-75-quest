# Admin Setup Guide

This guide explains how to set up admin users in your Cult.fit clone application using Firebase.

## Admin Access

The admin panel can be accessed at `/admin` with the following credentials:
- **Username**: admin
- **Password**: admin

This will authenticate using Firebase with the email `admin@admin.com`.

## Setup Instructions

Follow these steps to set up the admin user in Firebase.

## Step 1: Create Firebase Authentication User

1. **Go to Firebase Console**
   - Navigate to [Firebase Console](https://console.firebase.google.com/)
   - Select your project

2. **Open Authentication**
   - Click on "Authentication" in the left sidebar
   - Click on "Users" tab
   - Click "Add user" button

3. **Create Admin User**
   - Email: `admin@admin.com`
   - Password: `admin`
   - Click "Add user"

4. **Copy the User UID**
   - After creating the user, copy their UID from the Users list
   - You'll need this for Step 2

## Step 2: Grant Admin Role

Now add the admin role to the user you just created.

1. **Open Firestore Database**
   - Click on "Firestore Database" in the left sidebar
   - Click on "Start collection" if this is your first collection

3. **Create the userRoles Collection**
   - Collection ID: `userRoles`
   - Click "Next"

4. **Add the Admin Role Document**
   - Document ID: Paste the UID you copied from Step 1
   - Add field:
     - Field: `role`
     - Type: `string`
     - Value: `admin`
   - Click "Save"

That's it! You can now log in at `/admin` with:
- **Username**: admin
- **Password**: admin

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
