// src/config/postgres.ts

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'postgres',
  process.env.POSTGRES_USER || 'postgres',
  process.env.POSTGRES_PASSWORD || 'postgres',
  {
    host: process.env.POSTGRES_HOST || 'postgres', // Use 'postgres' when using Docker Compose
    port: Number(process.env.POSTGRES_PORT) || 5432,
    dialect: 'postgres',
    logging: false, // Disable logging; enable for debugging
  }
);

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully.');

    // Sync all models
    await sequelize.sync({ alter: true }); // Use { force: true } to drop tables and recreate them
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
    process.exit(1); // Exit process with failure
  }
};

export { sequelize, connectPostgres };
