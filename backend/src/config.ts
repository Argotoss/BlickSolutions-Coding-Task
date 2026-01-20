type AppConfig = {
  mongoUri: string;
  port: number;
  allowedOrigins?: string[];
};

const parsePort = (value: string | undefined): number => {
  const portValue = Number(value ?? 3001);
  return Number.isNaN(portValue) ? 3001 : portValue;
};

const parseAllowedOrigins = (value: string | undefined): string[] | undefined => {
  if (!value) {
    return undefined;
  }

  const origins = value
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return origins.length > 0 ? origins : undefined;
};

const loadConfig = (): AppConfig => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  return {
    mongoUri,
    port: parsePort(process.env.PORT),
    allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGIN),
  };
};

export { loadConfig };
