# Clearbook Entity-Relationship Diagram

## ER Diagram (ASCII)

```
+----------------+          +----------------+          +----------------+
|      User      |          |   Lab Result   |          |    Document    |
+----------------+          +----------------+          +----------------+
| id (PK)        |<-1------*| id (PK)        |<-1------0| id (PK)        |
| email          |          | user_id (FK)   |          | user_id (FK)   |
| password_hash  |          | document_id (FK)|          | lab_result_id  |
| first_name     |          | test_name      |          | file_name      |
| last_name      |          | test_date      |          | file_path      |
| date_of_birth  |          | result_value   |          | file_type      |
| gender         |          | unit           |          | file_size      |
| phone          |          | reference_range|          | description    |
| created_at     |          | lab_name       |          | upload_date    |
| updated_at     |          | notes          |          | updated_at     |
| last_login     |          | is_abnormal    |          |                |
| reset_token    |          | created_at     |          |                |
| onboarding     |          | updated_at     |          |                |
+----------------+          +-------^--------+          +----------------+
                                   |
                                   |
                                   |
                                   |
                                   |
                           +-------v---------+
                           |    Trend Data   |
                           +------------------+
                           | id (PK)          |
                           | user_id (FK)     |
                           | test_name        |
                           | start_date       |
                           | end_date         |
                           | count            |
                           | min_value        |
                           | max_value        |
                           | average          |
                           | median           |
                           | std_deviation    |
                           | created_at       |
                           | updated_at       |
                           +------------------+
```

## Legend

- `PK`: Primary Key
- `FK`: Foreign Key
- `1`: One relationship
- `*`: Many relationship
- Lines show relationships between entities:
  - `<-1------*` represents a one-to-many relationship
  - `<-1------0` represents a one-to-zero-or-one relationship (lab result to document)

## Relationship Descriptions

1. **User to Lab Results**: One-to-Many
   - A user can have multiple lab results
   - Each lab result belongs to exactly one user

2. **User to Documents**: One-to-Many (not shown directly in diagram)
   - A user can upload multiple documents
   - Each document belongs to exactly one user

3. **Lab Results to Documents**: One-to-Optional-One
   - A lab result may have at most one document attached (optional)
   - A document must be associated with exactly one lab result
   - The `document_id` in `lab_results` can be NULL, indicating no document
   - The `lab_result_id` in `documents` is NOT NULL and UNIQUE

4. **Lab Results to Trend Data**: One-to-Many
   - Trend data is calculated based on multiple lab results
   - Trend data is aggregated by test name and date ranges

## Database Design Considerations

1. **Scalability**: The schema is designed to scale with increasing numbers of lab results and documents per user.

2. **Performance**: Appropriate indexes will be created for frequent queries, particularly on foreign keys and commonly filtered fields.

3. **Data Integrity**: Foreign key constraints ensure referential integrity between related tables.

4. **Security**: User data isolation is ensured through user_id foreign keys on all relevant tables.

5. **Extensibility**: The schema allows for future expansion, such as adding support for medication tracking or doctor visit notes.
