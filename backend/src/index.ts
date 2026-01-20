import { app } from "./app";
import { config } from "./config";
import { connectDatabase } from "./database";

const start = async (): Promise<void> => {
  await connectDatabase();
  app.listen(config.port, () => {
    process.stdout.write(`Server listening on port ${config.port}\n`);
  });
};

start().catch((error: unknown) => {
  process.stderr.write(`Failed to start server: ${String(error)}\n`);
  process.exit(1);
});
