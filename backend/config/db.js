// backend/config/db.js
import dotenv from "dotenv";
import pg from "pg";

dotenv.config(); // ✅ This must be here
const { Pool } = pg;

console.log("🧪 Connecting to:", process.env.DATABASE_URL); // debug line

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

pool.connect()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err));

export default pool;
