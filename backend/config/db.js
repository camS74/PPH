// backend/config/db.js
import dotenv from "dotenv";
import pg from "pg";

dotenv.config(); // ✅ Ensure the .env file is loaded

const { Pool } = pg; // Destructure to get Pool constructor

console.log("🧪 Connecting to:", process.env.DATABASE_URL); // Debug: Show the DATABASE_URL

// Set up the connection pool using the DATABASE_URL from .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,  // Set to true if you are using SSL for PostgreSQL connection
});

// Test the connection
pool.connect()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err));

export default pool;
