# User Profile Screens

## Profile View Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK       Profile      |  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│                 👤                          │
│                                             │
│  Personal Information                       │
│                                             │
│  Name: John Doe                             │
│  Email: john.doe@example.com                │
│  Date of Birth: January 15, 1980            │
│  Gender: Male                               │
│                                             │
│  Medical Information                        │
│                                             │
│  Blood Type: O+                             │
│  Height: 180 cm                             │
│  Weight: 75 kg                              │
│  Allergies: None                            │
│                                             │
│  Emergency Contact                          │
│                                             │
│  Name: Jane Doe                             │
│  Relationship: Spouse                       │
│  Phone: +1 (555) 123-4567                   │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │            EDIT PROFILE             │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         ACCOUNT SETTINGS            │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Simple, clean layout
- Organized into logical sections
- Clear buttons for editing profile and accessing account settings
- Minimal but important health information
- Emergency contact information for critical situations

## Edit Profile Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK     Edit Profile   |  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│  Edit Profile                               │
│                                             │
│  Personal Information                       │
│  ┌─────────────────────────────────────┐    │
│  │ First Name                          │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Last Name                           │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Date of Birth          📅           │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Gender                         ▼    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Medical Information                        │
│  ┌─────────────────────────────────────┐    │
│  │ Blood Type                     ▼    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Height (cm)                         │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Weight (kg)                         │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Allergies                           │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Emergency Contact                          │
│  ┌─────────────────────────────────────┐    │
│  │ Name                                │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Relationship                        │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Phone                               │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │              SAVE                   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │             CANCEL                  │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────��───────────────────────┘
```

### Design Notes
- Form mirrors the structure of the profile view
- Date picker for birth date
- Dropdown selections for standardized fields
- Multi-line text area for allergies
- Clear save/cancel actions
- Form validation on required fields

## Account Settings Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK   Account Settings |  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│  Account Settings                           │
│                                             │
│  Email & Password                           │
│  ┌─────────────────────────────────────┐    │
│  │ Change Email Address                │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Change Password                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Notifications                              │
│  [✓] Email notifications                    │
│  [✓] Result reminders                       │
│  [ ] Marketing communications               │
│                                             │
│  Data Management                            │
│  ┌─────────────────────────────────────┐    │
│  │ Export My Data                      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Delete My Account                   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Privacy & Security                         │
│  ┌─────────────────────────────────────┐    │
│  │ Privacy Policy                      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Terms of Service                    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  App Information                            │
│  Version: 1.0.0                             │
│  © 2025 Clearbook Health Records            │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Organized into logical sections
- Clear actions for critical account operations
- Checkboxes for notification preferences
- Dangerous actions (delete account) visually distinct
- App information and copyright displayed at bottom

## Change Password Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK    Change Password |  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│  Change Password                            │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Current Password             👁️     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ New Password                 👁️     │    │
│  └─────────────────────────────────────┘    │
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
- Similar to password reset screen
- Current password required for security
- Password visibility toggle icons
- Clear password requirements
- Prominent update button

## Export Data Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK     Export Data    |  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│  Export My Data                             │
│                                             │
│  Select data to export:                     │
│                                             │
│  [✓] Lab Results                            │
│  [✓] Documents                              │
│  [✓] Profile Information                    │
│                                             │
│  Date Range                                 │
│  ┌─────────────────────────────────────┐    │
│  │ From                       📅       │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ To                         📅       │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Format                                     │
│  (○) CSV                                    │
│  ( ) PDF                                    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │            EXPORT                   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │             CANCEL                  │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Checkboxes to select data categories
- Date range selection
- Format options
- Clear export button

## Delete Account Screen

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
│  To confirm deletion, please enter your     │
│  password:                                  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Password                     👁️     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [ ] I understand this action is permanent  │
│      and cannot be undone.                  │
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
- Warning icon and text to indicate danger
- Clear explanation of what will be deleted
- Password confirmation for security
- Checkbox confirmation to prevent accidental deletion
- Delete button visually distinct (e.g., red)
- Prominent cancel option
