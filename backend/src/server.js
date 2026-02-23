import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", ".env"), override: true });

const [{ default: app }, { connectDatabase, disconnectDatabase }] = await Promise.all([
  import("./app.js"),
  import("./config/db.js"),
]);

const port = Number(process.env.PORT) || 3000;

const startServer = async () => {
  try {
    // Check database connection
    const isConnected = await connectDatabase();
    
    if (!isConnected) {
      console.error("❌ Failed to connect to database. Please check your DATABASE_URL in .env file");
      process.exit(1);
    }

    // Start the Express server
    const server = app.listen(port, () => {
      console.log(`🚀 API server listening on port ${port}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, closing server gracefully...');
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\nSIGINT received, closing server gracefully...');
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("❌ Error starting server:", error);
    await disconnectDatabase();
    process.exit(1);
  }
};

startServer();
