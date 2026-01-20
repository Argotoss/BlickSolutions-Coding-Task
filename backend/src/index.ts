import { createApp } from "./app";
import { loadConfig } from "./config";
import { connectDatabase } from "./database";

const start = async (): Promise<void> => {
  const config = loadConfig();
  await connectDatabase(config.mongoUri);
  const app = createApp(config.allowedOrigins);
  app.listen(config.port, () => {
    process.stdout.write(`Server listening on port ${config.port}\n`);
  });
};

start().catch((error: unknown) => {
  process.stderr.write(`Failed to start server: ${String(error)}\n`);
  process.exit(1);
});
