import { Sequelize, DataTypes } from 'sequelize';
import User from '../../models/user';
import LabResult from '../../models/labResult';
import Document from '../../models/document';
import { createTestDb } from '../setup';

describe('Document Model', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    // Create a new in-memory database for testing
    sequelize = createTestDb();
    
    // Initialize the models with the test database
    User.initialize(sequelize);
    LabResult.initialize(sequelize);
    Document.initialize(sequelize);
    
    // Create a mock TrendData model to satisfy User associations
    const TrendData = sequelize.define('TrendData', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      test_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'trend_data',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    
    // Set up associations with all models including TrendData mock
    const models = { LabResult, Document, User, TrendData };
    User.associate(models);
    LabResult.associate(models);
    Document.associate(models);
    
    // Sync the models with the database (create the tables)
    await sequelize.sync({ force: true });
    
    // Create test user for foreign key relationships
    await User.create({
      id: '12345678-1234-1234-1234-123456789012',
      email: 'test@example.com',
      password_hash: 'hashedpassword123',
      first_name: 'Test',
      last_name: 'User',
      created_at: new Date(),
      updated_at: new Date(),
      onboarding_completed: false
    });

    // Create a test lab result for optional association
    await LabResult.create({
      id: '98765432-9876-9876-9876-987654321098',
      user_id: '12345678-1234-1234-1234-123456789012',
      test_name: 'Complete Blood Count',
      test_date: new Date('2025-01-15'),
      result_value: 7000,
      unit: 'cells/mcL',
      is_abnormal: false,
      created_at: new Date(),
      updated_at: new Date()
    });
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  it('should create a document with valid data', async () => {
    // Create test document data
    const documentData = {
      user_id: '12345678-1234-1234-1234-123456789012',
      lab_result_id: '98765432-9876-9876-9876-987654321098',
      file_name: 'blood_test_results.pdf',
      file_type: 'application/pdf',
      file_size: 1024,
      file_path: '/uploads/blood_test_results.pdf',
      upload_date: new Date(),
      description: 'Complete blood count lab report',
      created_at: new Date(),
      updated_at: new Date()
    };

    // Create a new document
    const document = await Document.create(documentData);

    // Assertions
    expect(document).toBeDefined();
    expect(document.id).toBeDefined();
    expect(document.user_id).toBe('12345678-1234-1234-1234-123456789012');
    expect(document.lab_result_id).toBe('98765432-9876-9876-9876-987654321098');
    expect(document.file_name).toBe('blood_test_results.pdf');
    expect(document.file_type).toBe('application/pdf');
    expect(document.file_size).toBe(1024);
    expect(document.file_path).toBe('/uploads/blood_test_results.pdf');
    expect(document.description).toBe('Complete blood count lab report');
  });

  it('should create a document without lab result association', async () => {
    // Create test document data without lab_result_id (optional in our model)
    const documentData = {
      user_id: '12345678-1234-1234-1234-123456789012',
      file_name: 'prescription.jpg',
      file_type: 'image/jpeg',
      file_size: 512,
      file_path: '/uploads/prescription.jpg',
      upload_date: new Date(),
      description: 'Medication prescription',
      created_at: new Date(),
      updated_at: new Date(),
      lab_result_id: null
    };

    // Create a new document
    const document = await Document.create(documentData);

    // Assertions
    expect(document).toBeDefined();
    expect(document.id).toBeDefined();
    expect(document.user_id).toBe('12345678-1234-1234-1234-123456789012');
    expect(document.lab_result_id).toBeNull();
    expect(document.file_name).toBe('prescription.jpg');
  });

  it('should not create a document without required fields', async () => {
    // Create test document with missing required fields
    const documentData = {
      user_id: '12345678-1234-1234-1234-123456789012',
      // Missing file_name
      // Missing file_type
      // Missing file_size
      // Missing file_path
      upload_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      lab_result_id: null
    };

    // Attempt to create a new document and expect it to fail
    await expect(Document.create(documentData as any)).rejects.toThrow();
  });

  it('should update document data correctly', async () => {
    // Create test document
    const documentData = {
      user_id: '12345678-1234-1234-1234-123456789012',
      file_name: 'original.pdf',
      file_type: 'application/pdf',
      file_size: 2048,
      file_path: '/uploads/original.pdf',
      upload_date: new Date(),
      description: 'Original document',
      created_at: new Date(),
      updated_at: new Date(),
      lab_result_id: null
    };

    // Create a new document
    const document = await Document.create(documentData);

    // Update document data
    document.file_name = 'updated.pdf';
    document.file_path = '/uploads/updated.pdf';
    document.description = 'Updated document';
    await document.save();

    // Fetch the updated document
    const updatedDocument = await Document.findByPk(document.id);

    // Assertions
    expect(updatedDocument).toBeDefined();
    expect(updatedDocument!.file_name).toBe('updated.pdf');
    expect(updatedDocument!.file_path).toBe('/uploads/updated.pdf');
    expect(updatedDocument!.description).toBe('Updated document');
    expect(updatedDocument!.file_type).toBe('application/pdf'); // Unchanged
    expect(updatedDocument!.file_size).toBe(2048); // Unchanged
  });

  it('should associate document with user', async () => {
    // Create test document
    const document = await Document.create({
      user_id: '12345678-1234-1234-1234-123456789012',
      file_name: 'user_test.pdf',
      file_type: 'application/pdf',
      file_size: 1000,
      file_path: '/uploads/user_test.pdf',
      upload_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      lab_result_id: null
    });

    // Get the associated user
    const user = await document.getUser();

    // Assertions
    expect(user).toBeDefined();
    expect(user!.id).toBe('12345678-1234-1234-1234-123456789012');
    expect(user!.email).toBe('test@example.com');
  });

  it('should support lab result association in model structure', () => {
    // Verify the model has the structure to support lab result associations
    // This is a structure test that doesn't rely on database operations
    
    // Check if the model has the lab_result_id field in its attributes
    expect(Document.getAttributes()).toHaveProperty('lab_result_id');
    
    // Check if the association method is defined on the prototype
    // Sequelize uses snake_case for association methods when the model name is snake_case
    expect(Document.prototype).toHaveProperty('getLab_result');
    
    // Document model properly includes lab_result_id field
    const docInstance = Document.build({
      user_id: '12345678-1234-1234-1234-123456789012',
      file_name: 'test.pdf',
      file_type: 'application/pdf',
      file_size: 1000,
      file_path: '/path/to/test.pdf',
      upload_date: new Date()
    });
    
    // Verify instance can hold lab_result_id
    docInstance.lab_result_id = '98765432-9876-9876-9876-987654321098';
    expect(docInstance.lab_result_id).toBe('98765432-9876-9876-9876-987654321098');
  });
});
