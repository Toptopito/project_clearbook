# Clearbook Data Model

This document outlines the data model for the Clearbook personal health records application, including entity relationships and database schema definitions.

## Entity-Relationship Diagram

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│               │       │               │       │               │
│     User      │───1:N─┤  Lab Result   │───1:0─┤   Document    │
│               │       │               │       │               │
└───────┬───────┘       └───────┬───────┘       └───────────────┘
        │                       │
        │                       │
        │                       │
        │               ┌───────┴───────┐
        └────────1:N────┤               │
                        │  Trend Data   │
                        │               │
                        └───────────────┘
```

## Core Entities

### User
Represents a registered user of the application who can store and manage their personal health records.

### Lab Result
Represents a specific lab test result including metadata, values, and interpretation. This is the primary data structure for the application and is required.

### Document
Represents an optional uploaded document (e.g., PDF lab report, doctor's note) that can be associated with a lab result. Documents are supplementary and not required.

### Trend Data
Represents computed trend data and statistics based on lab results for visualization purposes.

## Database Schema

### users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier for the user |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address, used for login |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hash of user's password |
| first_name | VARCHAR(100) | NOT NULL | User's first name |
| last_name | VARCHAR(100) | NOT NULL | User's last name |
| date_of_birth | DATE | | User's date of birth |
| gender | VARCHAR(50) | | User's gender identity |
| phone | VARCHAR(20) | | User's phone number |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When the user account was created |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When the user account was last updated |
| last_login | TIMESTAMP | | When the user last logged in |
| password_reset_token | VARCHAR(255) | | Token for password reset functionality |
| password_reset_expires | TIMESTAMP | | When the password reset token expires |
| onboarding_completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether user has completed onboarding |

### lab_results
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier for the lab result |
| user_id | UUID | FOREIGN KEY (users.id), NOT NULL | Reference to the user who owns this result |
| document_id | UUID | FOREIGN KEY (documents.id), NULL | Reference to an optional associated document |
| test_name | VARCHAR(255) | NOT NULL | Name of the lab test |
| test_date | DATE | NOT NULL | When the test was performed |
| result_value | DECIMAL(10,2) | NOT NULL | Numeric value of the result |
| unit | VARCHAR(50) | NOT NULL | Unit of measurement |
| reference_range_low | DECIMAL(10,2) | | Lower bound of normal range |
| reference_range_high | DECIMAL(10,2) | | Upper bound of normal range |
| lab_name | VARCHAR(255) | | Name of the laboratory |
| ordering_doctor | VARCHAR(255) | | Name of ordering physician |
| notes | TEXT | | Additional notes about the result |
| is_abnormal | BOOLEAN | NOT NULL, DEFAULT FALSE | Flag for values outside reference range |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When the record was created |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When the record was last updated |

### documents
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier for the document |
| user_id | UUID | FOREIGN KEY (users.id), NOT NULL | Reference to the user who owns this document |
| lab_result_id | UUID | FOREIGN KEY (lab_results.id), NOT NULL, UNIQUE | Reference to the lab result this document is associated with |
| file_name | VARCHAR(255) | NOT NULL | Original name of the uploaded file |
| file_path | VARCHAR(255) | NOT NULL | Path/URL to the stored file |
| file_type | VARCHAR(50) | NOT NULL | MIME type of the file |
| file_size | INTEGER | NOT NULL | Size in bytes |
| description | TEXT | | User-provided description |
| upload_date | TIMESTAMP | NOT NULL, DEFAULT NOW() | When the document was uploaded |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When the document was last updated |



### trend_data
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier for the trend data |
| user_id | UUID | FOREIGN KEY (users.id), NOT NULL | Reference to the user |
| test_name | VARCHAR(255) | NOT NULL | Name of the lab test |
| start_date | DATE | NOT NULL | Start date of the trend period |
| end_date | DATE | NOT NULL | End date of the trend period |
| count | INTEGER | NOT NULL | Number of data points |
| min_value | DECIMAL(10,2) | | Minimum value in the period |
| max_value | DECIMAL(10,2) | | Maximum value in the period |
| average | DECIMAL(10,2) | | Average value in the period |
| median | DECIMAL(10,2) | | Median value in the period |
| standard_deviation | DECIMAL(10,2) | | Standard deviation of values |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When the trend data was calculated |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | When the trend data was last updated |

## Relationships

1. **User to Lab Results**: One-to-Many
   - One user can have many lab results
   - Foreign key `user_id` in `lab_results` table

2. **User to Documents**: One-to-Many
   - One user can upload many documents
   - Foreign key `user_id` in `documents` table

3. **Lab Results to Documents**: One-to-One (Optional)
   - A lab result may have at most one document attached (optional)
   - A document must be associated with exactly one lab result
   - Relationship maintained by a nullable `document_id` in `lab_results` and a required `lab_result_id` in `documents`
   - The `lab_result_id` in `documents` is marked as UNIQUE to enforce one document per lab result

4. **User to Trend Data**: One-to-Many
   - One user can have many trend data entries
   - Foreign key `user_id` in `trend_data` table

## Indexes

The following indexes will be created for optimal performance:

```sql
-- User authentication
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_password_reset_token ON users(password_reset_token);

-- Lab result filtering
CREATE INDEX idx_lab_results_user_id ON lab_results(user_id);
CREATE INDEX idx_lab_results_test_name ON lab_results(test_name);
CREATE INDEX idx_lab_results_test_date ON lab_results(test_date);
CREATE INDEX idx_lab_results_is_abnormal ON lab_results(is_abnormal);

-- Document management
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_file_type ON documents(file_type);

-- Document associations with lab results
CREATE INDEX idx_lab_results_document_id ON lab_results(document_id);
CREATE INDEX idx_documents_lab_result_id ON documents(lab_result_id);

-- Trend data queries
CREATE INDEX idx_trend_data_user_id ON trend_data(user_id);
CREATE INDEX idx_trend_data_test_name ON trend_data(test_name);
CREATE INDEX idx_trend_data_date_range ON trend_data(start_date, end_date);
```

## Data Security Considerations

- All personally identifiable information (PII) should be encrypted at rest
- Passwords are stored as bcrypt hashes, never in plaintext
- Database access is restricted through role-based permissions
- Regular backups will be performed with encryption
- User data will be isolated through row-level security mechanisms
