const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is required");
}

const portValue = Number(process.env.PORT ?? 3001);
const port = Number.isNaN(portValue) ? 3001 : portValue;

export const config = {
  mongoUri,
  port,
};
