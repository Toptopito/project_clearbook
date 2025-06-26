import { Sequelize, DataTypes } from 'sequelize';
import User from '../../models/user';
import LabResult from '../../models/labResult';
import { createTestDb } from '../setup';

describe('LabResult Model', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    // Create a new in-memory database for testing
    sequelize = createTestDb();
    
    // Initialize the models with the test database
    User.initialize(sequelize);
    LabResult.initialize(sequelize);
    
    // Create a mock Document model to satisfy associations
    const Document = sequelize.define('Document', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      lab_result_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      file_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: false
      },
      upload_date: {
        type: DataTypes.DATE,
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
      tableName: 'documents',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    
    // Create a mock TrendData model to satisfy associations
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
    
    // Set up associations with all mocked models
    const models = { LabResult, User, Document, TrendData };
    User.associate(models);
    LabResult.associate(models);
    
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
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  it('should create a lab result with valid data', async () => {
    // Create test lab result data
    const labResultData = {
      user_id: '12345678-1234-1234-1234-123456789012',
      test_name: 'Complete Blood Count',
      test_date: new Date('2025-01-15'),
      result_value: 7000,
      unit: 'cells/mcL',
      reference_range_low: 4500,
      reference_range_high: 11000,
      lab_name: 'City Medical Lab',
      ordering_doctor: 'Dr. Smith',
      notes: 'Normal range',
      is_abnormal: false,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Create a new lab result
    const labResult = await LabResult.create(labResultData);

    // Assertions
    expect(labResult).toBeDefined();
    expect(labResult.id).toBeDefined();
    expect(labResult.user_id).toBe('12345678-1234-1234-1234-123456789012');
    expect(labResult.test_name).toBe('Complete Blood Count');
    expect(labResult.result_value).toBe(7000);
    expect(labResult.is_abnormal).toBe(false);
  });

  it('should not create a lab result without required fields', async () => {
    // Create test lab result with missing required fields
    const labResultData = {
      user_id: '12345678-1234-1234-1234-123456789012',
      // Missing test_name
      test_date: new Date('2025-01-15'),
      // Missing result_value
      unit: 'mg/dL'
    };

    // Attempt to create a new lab result and expect it to fail
    await expect(LabResult.create(labResultData as any)).rejects.toThrow();
  });

  it('should create a lab result with minimal required fields', async () => {
    // Create test lab result with only required fields
    const labResultData = {
      user_id: '12345678-1234-1234-1234-123456789012',
      test_name: 'HbA1c',
      test_date: new Date('2025-01-10'),
      result_value: 5.7,
      unit: '%',
      is_abnormal: false,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Create a new lab result
    const labResult = await LabResult.create(labResultData);

    // Assertions
    expect(labResult).toBeDefined();
    expect(labResult.test_name).toBe('HbA1c');
    expect(labResult.result_value).toBe(5.7);
    expect(labResult.reference_range_low).toBeFalsy();
    expect(labResult.reference_range_high).toBeFalsy();
    expect(labResult.lab_name).toBeFalsy();
    expect(labResult.ordering_doctor).toBeFalsy();
    expect(labResult.notes).toBeFalsy();
    expect(labResult.is_abnormal).toBe(false); // Default value
  });

  it('should update lab result data correctly', async () => {
    // Create test lab result
    const labResult = await LabResult.create({
      user_id: '12345678-1234-1234-1234-123456789012',
      test_name: 'Lipid Panel',
      test_date: new Date('2025-01-20'),
      result_value: 180,
      unit: 'mg/dL',
      is_abnormal: false,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Update lab result data
    labResult.result_value = 140;
    labResult.is_abnormal = true;
    labResult.notes = 'Updated after review';
    await labResult.save();

    // Fetch the updated lab result
    const updatedLabResult = await LabResult.findByPk(labResult.id);

    // Assertions
    expect(updatedLabResult).toBeDefined();
    expect(updatedLabResult!.result_value).toBe(140);
    expect(updatedLabResult!.is_abnormal).toBe(true);
    expect(updatedLabResult!.notes).toBe('Updated after review');
    expect(updatedLabResult!.test_name).toBe('Lipid Panel'); // The value wasn't changed in the update
  });

  it('should associate lab result with user', async () => {
    // Create test lab result
    const labResult = await LabResult.create({
      user_id: '12345678-1234-1234-1234-123456789012',
      test_name: 'Vitamin D',
      test_date: new Date('2025-01-20'),
      result_value: 45,
      unit: 'ng/mL',
      is_abnormal: false,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Get the associated user (requires proper association setup)
    const user = await labResult.getUser();

    // Assertions
    expect(user).toBeDefined();
    expect(user!.id).toBe('12345678-1234-1234-1234-123456789012');
    expect(user!.email).toBe('test@example.com');
  });
});
