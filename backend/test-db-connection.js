import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  console.log("Testing PostgreSQL connection...\n");
  console.log("DATABASE_URL:", process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
  
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const result = await pool.query('SELECT NOW() as time, version() as version');
    console.log("\n PostgreSQL Connection Successful!");
    console.log("\n Server Time:", result.rows[0].time);
    console.log("\n Version:", result.rows[0].version.split(' ').slice(0, 2).join(' '));
    
    const dbResult = await pool.query('SELECT current_database()');
    console.log("🗄️  Database:", dbResult.rows[0].current_database);
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tables.rows.length > 0) {
      console.log("\nExisting Tables:");
      tables.rows.forEach(row => console.log(`   - ${row.table_name}`));
    } else {
      console.log("\nNo tables found (database needs migration)");
    }
    
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error("\nConnection Failed!");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error("\nSuggestion: PostgreSQL server is not running");
      console.error("   • Start PostgreSQL service");
      console.error("   • Check if port 5432 is correct");
    } else if (error.code === '3D000') {
      console.error("\nSuggestion: Database does not exist");
      console.error("   • Create database: CREATE DATABASE codeyatra_db;");
    } else if (error.code === '28P01') {
      console.error("\nSuggestion: Authentication failed");
      console.error("   • Check username and password in .env");
    }
    
    await pool.end();
    process.exit(1);
  }
}

testConnection();
