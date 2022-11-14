import dotenv from "dotenv";

dotenv.config();

export default {
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  COOKIE_SECRET_KEY: process.env.COOKIE_SECRET_KEY,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};
