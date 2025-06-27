// Script to list all users in the database

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { User, UserAttributes } from '../models/user';
import { initDb } from '../db/config';

// Load environment variables
dotenv.config();

async function listUsers() {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'first_name', 'last_name', 'onboarding_completed']
    });
    
    console.log('Users in the database:');
    console.log('----------------------');
    
    if (users.length === 0) {
      console.log('No users found');
    } else {
      users.forEach((user: any, index: number) => {
        console.log(`User #${index + 1}:`);
        console.log(`  ID: ${user.id}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Name: ${user.first_name || 'N/A'} ${user.last_name || 'N/A'}`);
        console.log(`  Onboarding completed: ${user.onboarding_completed ? 'Yes' : 'No'}`);
        console.log('----------------------');
      });
    }
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    process.exit(0);
  }
}

// Run the function
listUsers();
