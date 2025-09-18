/* eslint-disable no-undef */
import { config } from "dotenv";

config({path: "./.env"});

export const { PORT, DATABASE_URL,DIRECT_URL, JWT_SECRET, JWT_EXPIRES_IN } = process.env || 10000;

