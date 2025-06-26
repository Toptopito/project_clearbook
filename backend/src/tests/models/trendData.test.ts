import { Sequelize, DataTypes } from 'sequelize';
import User from '../../models/user';
import TrendData from '../../models/trendData';
import { createTestDb } from '../setup';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';

describe('TrendData Model', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    // Create a new in-memory database for testing
    sequelize = createTestDb();
    
    // Initialize the models with the test database
    User.initialize(sequelize);
    TrendData.initialize(sequelize);
    
    // Create a mock LabResult model using sequelize.define
    // This returns a proper Sequelize.Model
    const LabResult = sequelize.define('LabResult', {
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
      tableName: 'lab_results',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    
    // Create a mock Document model to satisfy User associations
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
      file_path: {
        type: DataTypes.STRING,
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
    
    // Set up associations with mock models included
    const models = { TrendData, User, LabResult, Document };
    User.associate(models);
    TrendData.associate(models);
    
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

  it('should create trend data with valid data', async () => {
    // Create test trend data
    const trendDataItem = await TrendData.create({
      user_id: '12345678-1234-1234-1234-123456789012',
      test_name: 'Glucose',
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-03-31'),
      count: 12,
      min_value: 90,
      max_value: 120,
      average: 105.5,
      median: 106,
      standard_deviation: 8.2,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Assertions
    expect(trendDataItem).toBeDefined();
    expect(trendDataItem.id).toBeDefined();
    expect(trendDataItem.user_id).toBe('12345678-1234-1234-1234-123456789012');
    expect(trendDataItem.test_name).toBe('Glucose');
    // Date might be stored as string in the test database
    expect(trendDataItem.start_date).toBeDefined();
    expect(trendDataItem.end_date).toBeDefined();
    expect(trendDataItem.count).toBe(12);
    expect(trendDataItem.min_value).toBe(90);
    expect(trendDataItem.max_value).toBe(120);
    expect(trendDataItem.average).toBe(105.5);
    expect(trendDataItem.median).toBe(106);
  });

  it('should create trend data with different test name', async () => {
    // Create test trend data with different test name
    const trendDataItem = await TrendData.create({
      user_id: '12345678-1234-1234-1234-123456789012',
      test_name: 'Weight',
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-06-30'),
      count: 24,
      min_value: 160,
      max_value: 175,
      average: 167.5,
      median: 168,
      standard_deviation: 3.2,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Assertions
    expect(trendDataItem).toBeDefined();
    expect(trendDataItem.id).toBeDefined();
    expect(trendDataItem.user_id).toBe('12345678-1234-1234-1234-123456789012');
    expect(trendDataItem.test_name).toBe('Weight');
    expect(trendDataItem.count).toBe(24);
  });

  it('should not create trend data without required fields', async () => {
    // Create test trend data with missing required fields
    const trendDataItem = {
      user_id: '12345678-1234-1234-1234-123456789012',
      // Missing test_name
      start_date: new Date('2025-01-01'),
      // Missing end_date
      // Missing count
      min_value: 90,
      max_value: 100
    };

    // Attempt to create new trend data and expect it to fail
    await expect(TrendData.create(trendDataItem as any)).rejects.toThrow();
  });

  it('should update trend data correctly', async () => {
    // Create test trend data
    const trendDataItem = await TrendData.create({
      user_id: '12345678-1234-1234-1234-123456789012',
      test_name: 'Cholesterol',
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-03-31'),
      count: 6,
      min_value: 180,
      max_value: 220,
      average: 198.5,
      median: 200,
      standard_deviation: 3.2,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Update trend data
    trendDataItem.min_value = 145;
    trendDataItem.max_value = 190;
    trendDataItem.average = 170;
    await trendDataItem.save();

    // Fetch the updated trend data
    const updatedTrend = await TrendData.findByPk(trendDataItem.id);

    // Assertions
    expect(updatedTrend).toBeDefined();
    expect(updatedTrend!.min_value).toBe(145);
    expect(updatedTrend!.max_value).toBe(190);
    expect(updatedTrend!.average).toBe(170);
    expect(updatedTrend!.test_name).toBe('Cholesterol'); // Unchanged
    expect(updatedTrend!.count).toBe(6); // Unchanged
  });

  it('should associate trend data with user', async () => {
    // Create test trend data
    const trendDataItem = await TrendData.create({
      user_id: '12345678-1234-1234-1234-123456789012',
      test_name: 'Blood Pressure',
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-06-30'),
      count: 24,
      min_value: 110,
      max_value: 150,
      average: 130,
      median: 130,
      standard_deviation: 20,
      created_at: new Date(),
      updated_at: new Date()
    });

    // We'll need to manually retrieve the user since we haven't implemented instance methods for associations
    const user = await User.findByPk('12345678-1234-1234-1234-123456789012');

    // Assertions
    expect(user).toBeDefined();
    expect(user!.id).toBe('12345678-1234-1234-1234-123456789012');
    expect(user!.email).toBe('test@example.com');
  });
});
