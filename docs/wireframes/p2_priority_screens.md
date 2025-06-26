# Priority P2 Feature Screens

This document contains wireframes for P2 priority features:
- Password change functionality (#7)
- Deletion of specific records (#19)
- Account deletion (#20)

## Password Change Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK    Change Password |  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│  Change Password                            │
│                                             │
│  For security, please enter your current    │
│  password before setting a new one.         │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Current Password             👁️     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ New Password                 👁️     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Password Strength: ■■■□□ Moderate          │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Confirm New Password         👁️     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Password requirements:                     │
│  • At least 8 characters                    │
│  • Include numbers and symbols              │
│  • Mix of upper and lowercase letters       │
│                                             │
│  ✓ At least 8 characters                    │
│  ✓ Includes numbers                         │
│  ✗ Includes symbols                         │
│  ✓ Has upper and lowercase letters          │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │           UPDATE PASSWORD           │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │             CANCEL                  │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Enhanced from basic password change screen in profile_screens.md
- Added password strength indicator
- Real-time validation feedback for password requirements
- Clear security-oriented messaging
- Eye icons for toggling password visibility
- Clear call-to-action buttons

## Password Change Success Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK                    |  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│                 ✓                           │
│                                             │
│         Password Updated                    │
│                                             │
│  Your password has been successfully        │
│  updated.                                   │
│                                             │
│  A confirmation email has been sent to      │
│  your registered email address.             │
│                                             │
│  For security reasons, you'll need to       │
│  log in again on all your devices.          │
│                                             │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │            CONTINUE                 │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Confirmation of successful password change
- Security information about email notification and session invalidation
- Simple continue button to return to previous screen

## Delete Specific Record Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK    Delete Result   |  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│  Delete Lab Result                          │
│                                             │
│  You are about to delete:                   │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │                                     │    │
│  │  Cholesterol                        │    │
│  │  May 15, 2025                       │    │
│  │  240 mg/dL                          │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ⚠️ This action cannot be undone            │
│                                             │
│  The following data will be permanently     │
│  deleted:                                   │
│  • Test result value and date               │
│  • Associated notes                         │
│  • Trend data for this record               │
│                                             │
│  Documents linked to this result will       │
│  remain in your document library.           │
│                                             │
│  [ ] I understand this is permanent         │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │            DELETE RECORD            │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │             CANCEL                  │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Clear identification of the specific record being deleted
- Warning about permanent deletion
- Detailed list of what will be deleted
- Clear information about what will NOT be deleted (linked documents)
- Confirmation checkbox to prevent accidental deletion
- Visually distinct delete button (e.g., red)
- Prominent cancel button

## Delete Record Success Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK                    |  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│                 ✓                           │
│                                             │
│         Record Deleted                      │
│                                             │
│  The lab result has been permanently        │
│  removed from your records.                 │
│                                             │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │       RETURN TO LAB RESULTS         │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Simple confirmation that deletion was successful
- Clear call-to-action to return to lab results screen

## Account Deletion Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK    Delete Account  |  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│  ⚠️ Delete Account                          │
│                                             │
│  WARNING: This action cannot be undone.     │
│                                             │
│  Deleting your account will permanently     │
│  remove all your data from our systems,     │
│  including:                                 │
│                                             │
│  • All lab results and trends               │
│  • Uploaded documents                       │
│  • Profile information                      │
│  • Account settings                         │
│                                             │
│  Before proceeding, consider:               │
│  • Exporting your data                      │
│  • Downloading any important documents      │
│                                             │
│  To confirm deletion, please enter your     │
│  password:                                  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Password                     👁️     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [ ] I understand that all my data will     │
│      be permanently deleted.                │
│                                             │
│  [ ] I understand this action cannot be     │
│      reversed.                              │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │       DELETE MY ACCOUNT             │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │             CANCEL                  │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Enhanced from basic account deletion screen in profile_screens.md
- Multiple confirmation checkboxes for extra protection
- Suggestions for data preservation before deletion
- Password verification for security
- Clear warning messaging and icon
- Visually distinct delete button (e.g., red)
- Prominent cancel option

## Account Deletion Confirmation Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK    Confirm Deletion|  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│  Final Confirmation                         │
│                                             │
│  Are you absolutely sure you want to        │
│  delete your account?                       │
│                                             │
│  This will delete:                          │
│  • 12 lab results                           │
│  • 3 uploaded documents                     │
│  • All your profile information             │
│                                             │
│  We're sorry to see you go.                 │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         YES, DELETE ACCOUNT         │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ NO, KEEP MY ACCOUNT AND DATA        │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Final confirmation with specific data summary
- Shows actual count of records to be deleted
- Clear, specific button text for both options
- "Keep account" option more prominent than delete
- Friendly messaging

## Account Deletion Success Screen

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│                 ✓                           │
│                                             │
│         Account Deleted                     │
│                                             │
│  Your account and all associated data       │
│  have been deleted.                         │
│                                             │
│  A confirmation email has been sent to      │
│  the email address previously associated    │
│  with your account.                         │
│                                             │
│  Thank you for using Clearbook.             │
│                                             │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         RETURN TO HOME              │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Simple confirmation that deletion was successful
- Information about confirmation email
- Clean design with no navigation elements since the user is now logged out
- Button returns to public home page
