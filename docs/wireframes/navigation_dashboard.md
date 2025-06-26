# Navigation and Dashboard Screens

## Mobile Navigation

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│                                             │
│           [Main Screen Content]             │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│    🏠    📊    📄    👤                   │
│  Home   Labs   Docs  Profile                │
└─────────────────────────────────────────────┘
```

### Design Notes
- Bottom navigation bar for mobile devices
- Four main sections: Home/Dashboard, Lab Results, Documents, Profile
- Simple icons with labels for clear navigation
- Current section highlighted

## Desktop/Tablet Navigation

```
┌────────┬────────────────────────────────────┐
│        │                                    │
│   C    │                                    │
│   L    │                                    │
│   E    │                                    │
│   A    │                                    │
│   R    │         [Main Screen               │
│   B    │            Content]                │
│   O    │                                    │
│   O    │                                    │
│   K    │                                    │
│        │                                    │
├────────┤                                    │
│  🏠   │                                    │
│ Home   │                                    │
├────────┤                                    │
│  📊   │                                    │
│ Labs   │                                    │
├────────┤                                    │
│  📄   │                                    │
│ Docs   │                                    │
├────────┤                                    │
│  👤   │                                    │
│ Profile│                                    │
├────────┤                                    │
│ ⚙️    │                                    │
│ Settings│                                   │
└────────┴────────────────────────────────────┘
```

### Design Notes
- Side navigation bar for desktop/tablet devices
- App name/logo at the top
- Same core sections as mobile
- Additional space for settings and other options
- Current section highlighted

## Dashboard/Home Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK       Dashboard    |  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│  Welcome back, John                         │
│                                             │
│  Summary                                    │
│  ┌─────────────────────┐ ┌───────────────┐  │
│  │  12                 │ │  3            │  │
│  │  Lab Results        │ │  Documents    │  │
│  │                     │ │               │  │
│  └─────────────────────┘ └───────────────┘  │
│                                             │
│  Recent Lab Results                         │
│  ┌─────────────────────────────────────┐    │
│  │ ⚠️ Cholesterol           05/15/2025 │    │
│  │ 240 mg/dL                           │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ ✓ Blood Glucose           05/10/2025│    │
│  │ 95 mg/dL                            │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  View all lab results                       │
│                                             │
│  Key Trends                                 │
│  ┌─────────────────────────────────────┐    │
│  │                                     │    │
│  │  [Miniature trend visualization]    │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Quick Actions                              │
│  ┌───────────────┐ ┌─────────────────────┐  │
│  │ + Add Result  │ │ 📄 Upload Document  │  │
│  └───────────────┘ └─────────────────────┘  │
│  ┌───────────────┐ ┌─────────────────────┐  │
│  │ 📊 View Trends│ │ 📤 Export Data     │  │
│  └───────────────┘ └─────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Personalized welcome message
- Summary tiles showing key metrics
- Recent lab results with warning indicators for abnormal values
- Small trends visualization for key metrics
- Quick action buttons for common tasks
- Clean layout with clear sections

## Menu Overlay

```
┌─────────────────────────────────────────────┐
│ ╳ Menu                                      │
├─────────────────────────────────────────────┤
│                                             │
│  👤 John Doe                                │
│  john.doe@example.com                       │
│                                             │
├─────────────────────────────────────────────┤
│  🏠 Dashboard                               │
│                                             │
│  📊 Lab Results                             │
│    └─ View All Results                      │
│    └─ Add New Result                        │
│    └─ Trends & Analysis                     │
│                                             │
│  📄 Documents                               │
│    └─ View All Documents                    │
│    └─ Upload Document                       │
│                                             │
│  👤 Profile                                 │
│    └─ View Profile                          │
│    └─ Edit Profile                          │
│                                             │
│  ⚙️ Settings                                │
│    └─ Account Settings                      │
│    └─ Notifications                         │
│    └─ Privacy & Security                    │
│                                             │
│  ℹ️ Help & Support                          │
│                                             │
│  🚪 Logout                                  │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Full menu overlay when hamburger menu is clicked
- User information at the top
- Expanded navigation with sub-items
- Close button (╳) to dismiss the menu
- Logout option at the bottom for easy access

## Notification Panel

```
┌─────────────────────────────────────────────┐
│ ╳ Notifications                             │
├─────────────────────────────────────────────┤
│                                             │
│  Today                                      │
│  ┌─────────────────────────────────────┐    │
│  │ ⚠️ Abnormal Result Alert            │    │
│  │ Your Cholesterol is above normal    │    │
│  │ range.                              │    │
│  │                        1h ago       │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 📄 Document Uploaded                │    │
│  │ Lab_Result_05152025.pdf was         │    │
│  │ successfully uploaded.              │    │
│  │                        3h ago       │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Yesterday                                  │
│  ┌─────────────────────────────────────┐    │
│  │ 📊 Trend Alert                      │    │
│  │ Your Blood Glucose is showing a     │    │
│  │ positive trend.                     │    │
│  │                        1d ago       │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │        MARK ALL AS READ             │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Notification panel slides in when notification bell is clicked
- Notifications grouped by date
- Different icons for different notification types
- Time indicators for each notification
- Option to mark all as read
- Close button (╳) to dismiss the panel
