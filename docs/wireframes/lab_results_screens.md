# Lab Results Management Screens

## Lab Results Dashboard/List View

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK    Lab Results   |  ☰  👤 ⋮      │
├─────────────────────────────────────────────┤
│                                             │
│  Lab Results                                │
│                                             │
│  ┌─────────┐ ┌────────────┐ ┌────────────┐  │
│  │ All     │ │ Filter ▼   │ │ Sort ▼     │  │
│  └─────────┘ └────────────┘ └────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ ⚠️ Cholesterol           05/15/2025 │    │
│  │ 240 mg/dL          ↗ +15 from last  │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ ✓ Blood Glucose           05/10/2025│    │
│  │ 95 mg/dL            ↘ -5 from last  │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ ✓ Hemoglobin A1C         04/25/2025│    │
│  │ 5.7%                 ↘ -0.1 from last│   │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ ⚠️ Blood Pressure        04/15/2025 │    │
│  │ 135/85 mmHg         ↗ +5/+3 from last│   │
│  └─────────────────────────────────────┘    │
│                                             │
│       ⋮                                     │
│                                             │
│            [ Load More ]                    │
│                                             │
│                                             │
│  ⊕                                          │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- List view showing recent lab results
- Warning indicators (⚠️) for values outside reference range
- Check marks (✓) for normal values
- Each result shows test name, date, value, and trend from previous result
- Filter option to view specific test types or date ranges
- Sort option (newest/oldest/alphabetical/etc.)
- Floating action button (⊕) for adding new lab result
- Pagination or "Load More" option for viewing additional results

## Add New Lab Result Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK    New Lab Result |  ☰  👤 ⋮     │
├─────────────────────────────────────────────┤
│                                             │
│  Add New Lab Result                         │
│                                             │
│  Test Information                           │
│  ┌─────────────────────────────────────┐    │
│  │ Test Type*                     ▼    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Test Date*           📅 05/20/2025  │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Lab/Provider Name                   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Test Results                               │
│  ┌─────────────────────────────────────┐    │
│  │ Result Value*                       │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Unit                           ▼    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Reference Range                            │
│  ┌─────────────────────────────────────┐    │
│  │ Minimum                             │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Maximum                             │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Notes                                      │
│  ┌─────────────────────────────────────┐    │
│  │                                     │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │     ATTACH DOCUMENT OR IMAGE   📎    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  * Required fields                          │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │              SAVE                   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │             CANCEL                  │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Form divided into logical sections
- Required fields marked with asterisk (*)
- Date picker for test date
- Dropdown for test type with common tests
- Unit dropdown pre-filled based on test type selection
- Option to attach document or image of lab result
- Clear call-to-action buttons
- Form validation on required fields

## Lab Result Detail Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK    Result Detail  |  ☰  👤 ⋮     │
├─────────────────────────────────────────────┤
│                                             │
│  Cholesterol                                │
│  May 15, 2025                               │
│                                             │
│  ⚠️ 240 mg/dL                               │
│  Above normal range (125-200 mg/dL)         │
│                                             │
│  Trend                                      │
│  ┌─────────────────────────────────────┐    │
│  │   [Small trend chart or graph]      │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│  View full history                          │
│                                             │
│  Additional Information                     │
│  Lab/Provider: Memorial Hospital            │
│  Notes: Fasting test, 12 hours              │
│                                             │
│  Documents                                  │
│  ┌─────────────────────────────────────┐    │
│  │ Lab_Result_05152025.pdf       👁️    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │              EDIT                   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │             DELETE                  │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Prominent display of test name, date, and value
- Clear indicator for abnormal values with reference range
- Small trend visualization with option to view full history
- Additional metadata about the test
- Document attachments with view option
- Edit and Delete actions
- Warning design for values outside normal range

## Document Upload Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK    Upload Document |  ☰  👤 ⋮    │
├─────────────────────────────────────────────┤
│                                             │
│  Upload Lab Document                        │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Document Title*                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Document Date*        📅 05/15/2025 │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Document Type                  ▼    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Related Test (Optional)        ▼    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │                                     │    │
│  │      Drag files here or click       │    │
│  │          to select files            │    │
│  │                                     │    │
│  │               📄 📸                │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Supported formats: PDF, JPG, PNG           │
│  Maximum size: 10 MB                        │
│                                             │
│  * Required fields                          │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │             UPLOAD                  │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │             CANCEL                  │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Clear document upload area
- Option to relate document to existing test result
- Support for both photos and PDF documents
- Clear file restrictions and size limits
- Required fields marked with asterisk

## Lab Result Visualization Screen

```
┌─────────────────────────────────────────────┐
│ CLEARBOOK    Trend Analysis |  ☰  👤 ⋮     │
├─────────────────────────────────────────────┤
│                                             │
│  Cholesterol Trend                          │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Test Type                      ▼    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Time Period                    ▼    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │                                     │    │
│  │        [Line chart showing          │    │
│  │         trend over time]            │    │
│  │                                     │    │
│  │                                     │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Statistics                                 │
│  Average: 215 mg/dL                         │
│  Minimum: 190 mg/dL (Jan 15, 2025)          │
│  Maximum: 240 mg/dL (May 15, 2025)          │
│  Trend: ↗ Increasing                        │
│                                             │
│  Reference Range: 125-200 mg/dL             │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │           EXPORT DATA               │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │           VIEW ALL RESULTS          │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Notes
- Interactive chart showing trends over time
- Options to select different test types and time periods
- Summary statistics
- Reference range indicator on chart
- Options to export data or view all related results
- Clear visualization of trends with color coding for values above/below reference range
