/* eslint-disable no-undef */
import { config } from "dotenv";

config({path: "./.env"});

const { PORT, DATABASE_URL } = process.env;

export { PORT, DATABASE_URL };