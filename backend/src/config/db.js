import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env"), override: true });

const connectionString = process.env.DATABASE_URL;

const getDbInfo = () => {
  try {
    if (!connectionString) return null;
    const u = new URL(connectionString);
    return { host: u.hostname, port: u.port, database: u.pathname?.replace(/^\//, "") };
  } catch {
    return null;
  }
};

const isLocalConnectionString = (value) =>
  typeof value === "string" &&
  (value.includes("localhost") || value.includes("127.0.0.1"));

const shouldUseSsl = () => {
  const env = (process.env.PGSSL || process.env.PGSSLMODE || "").toLowerCase();
  if (env === "true" || env === "1" || env === "require") return true;
  if (env === "false" || env === "0" || env === "disable") return false;
  // Default: use SSL for non-local hosts (Render/Neon/Supabase/etc.)
  return connectionString ? !isLocalConnectionString(connectionString) : false;
};

if (!process.env.DATABASE_URL) {
  console.error(
    "❌ DATABASE_URL is not set. Add it to backend/.env (example: postgresql://user:password@localhost:5432/dbname)"
  );
}

const pool = new pg.Pool({
  connectionString,
  ssl: shouldUseSsl() ? { rejectUnauthorized: false } : undefined,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

export const connectDatabase = async () => {
  try {
    const info = getDbInfo();
    if (info) {
      console.log(`🧩 DB target: ${info.host}${info.port ? `:${info.port}` : ""}/${info.database || ""}`);
    }
    console.log("🔍 Testing PostgreSQL connection...");
    await pool.query('SELECT NOW()');
    console.log("✅ PostgreSQL connection successful");
    
    console.log("🔍 Testing Prisma Client connection...");
    await prisma.$connect();
    console.log("✅ Prisma Client connected successfully");
    
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("📝 Please check your DATABASE_URL in .env file");
    console.error("📝 Current DATABASE_URL format: postgresql://user:password@host:port/database");
    return false;
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  await pool.end();
  console.log("Database disconnected");
};

export default prisma;