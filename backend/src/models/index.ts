import { Sequelize } from 'sequelize';
import dbConfig from '../../config/database';

// Import models
import User from './user';
import LabResult from './labResult';
import Document from './document';
import TrendData from './trendData';

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database as string,
  dbConfig.username as string,
  dbConfig.password as string,
  {
    host: dbConfig.host as string,
    port: dbConfig.port as number,
    dialect: 'postgres',
    logging: dbConfig.logging as boolean | ((sql: string) => void),
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

// Initialize models
User.initialize(sequelize);
LabResult.initialize(sequelize);
Document.initialize(sequelize);
TrendData.initialize(sequelize);

// Setup associations
User.associate({ LabResult, Document, TrendData });
LabResult.associate({ User, Document });
Document.associate({ User, LabResult });
TrendData.associate({ User });

// Export models
export { User, LabResult, Document, TrendData };

// Export the sequelize connection
export { sequelize };

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

export default sequelize;
