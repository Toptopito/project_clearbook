import { Sequelize } from 'sequelize';
import User from '../../models/user';
import { createTestDb } from '../setup';

describe('User Model', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    // Create a new in-memory database for testing
    sequelize = createTestDb();
    
    // Initialize the User model with the test database
    User.initialize(sequelize);
    
    // Sync the model with the database (create the table)
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection
    await sequelize.close();
  });

  it('should create a user with valid data', async () => {
    // Create test user data
    const userData = {
      email: 'test@example.com',
      password_hash: 'hashedpassword123',
      first_name: 'John',
      last_name: 'Doe',
      date_of_birth: new Date('1990-01-01'),
      gender: 'Male',
      phone: '123-456-7890',
      created_at: new Date(),
      updated_at: new Date(),
      onboarding_completed: false
    };

    // Create a new user
    const user = await User.create(userData);

    // Assertions
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user.first_name).toBe('John');
    expect(user.last_name).toBe('Doe');
    expect(user.onboarding_completed).toBe(false); // Default value
  });

  it('should not create a user without required fields', async () => {
    // Create test user with missing required fields
    const userData = {
      email: 'incomplete@example.com',
      // Missing password_hash
      first_name: 'Jane',
      // Missing last_name
      created_at: new Date(),
      updated_at: new Date(),
      onboarding_completed: false
    };

    // Attempt to create a new user and expect it to fail
    await expect(User.create(userData as any)).rejects.toThrow();
  });

  it('should not create a user with invalid email', async () => {
    // Create test user with invalid email
    const userData = {
      email: 'not-an-email',
      password_hash: 'hashedpassword123',
      first_name: 'Invalid',
      last_name: 'Email',
      created_at: new Date(),
      updated_at: new Date(),
      onboarding_completed: false
    };

    // Attempt to create a new user and expect it to fail
    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should update user data correctly', async () => {
    // Create test user
    const user = await User.create({
      email: 'update@example.com',
      password_hash: 'hashedpassword123',
      first_name: 'Before',
      last_name: 'Update',
      created_at: new Date(),
      updated_at: new Date(),
      onboarding_completed: false
    });

    // Update user data
    user.first_name = 'After';
    user.phone = '555-123-4567';
    await user.save();

    // Fetch the updated user
    const updatedUser = await User.findByPk(user.id);

    // Assertions
    expect(updatedUser).toBeDefined();
    expect(updatedUser!.first_name).toBe('After');
    expect(updatedUser!.last_name).toBe('Update'); // Unchanged
    expect(updatedUser!.phone).toBe('555-123-4567');
  });

  it('should enforce unique email constraint', async () => {
    // Create first user
    await User.create({
      email: 'duplicate@example.com',
      password_hash: 'hashedpassword123',
      first_name: 'First',
      last_name: 'User',
      created_at: new Date(),
      updated_at: new Date(),
      onboarding_completed: false
    });

    // Try to create second user with same email
    const duplicateUser = {
      email: 'duplicate@example.com', // Same email
      password_hash: 'anotherpassword',
      first_name: 'Second',
      last_name: 'User',
      created_at: new Date(),
      updated_at: new Date(),
      onboarding_completed: false
    };

    // Attempt should fail due to unique constraint
    await expect(User.create(duplicateUser)).rejects.toThrow();
  });
});
