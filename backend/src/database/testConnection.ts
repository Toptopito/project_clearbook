import { sequelize, testConnection } from '../models';

// Test database connection and exit
const runTest = async () => {
  try {
    const connected = await testConnection();
    if (connected) {
      console.log('Database connection test successful!');
      process.exit(0);
    } else {
      console.error('Database connection test failed.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during database connection test:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run the test if this script is executed directly
if (require.main === module) {
  runTest();
}
