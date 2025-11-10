# Admin Setup Guide

This application uses **frontend-only authentication** for the admin panel.

## Admin Access

The admin panel can be accessed at `/admin` with the following credentials:
- **Username**: admin
- **Password**: admin

## ⚠️ Security Warning

**CRITICAL**: This implementation uses frontend-only authentication which is **NOT SECURE** for production use. The credentials and session can be easily bypassed by anyone with basic developer tools knowledge. 

**For production, you should:**
- Use proper backend authentication (Firebase, Auth0, etc.)
- Store admin roles in a secure database with server-side validation
- Never hardcode credentials in the frontend

## How It Works

1. Navigate to `/admin`
2. Enter username: `admin` and password: `admin`
3. The session is stored in `sessionStorage`
4. Access to `/admin/dashboard` is granted

## Logging Out

To log out, simply close the browser tab or clear your browser's session storage.

## No Firebase Setup Required

This simplified version does not require any Firebase configuration for admin authentication. The user management features still use Firebase for storing user profiles.
