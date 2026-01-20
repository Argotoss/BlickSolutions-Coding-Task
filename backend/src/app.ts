import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { HttpError } from "./errors";
import { itemsRouter } from "./routes/items";

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (!error) {
    _next();
    return;
  }

  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof HttpError ? error.message : "Internal server error";
  response.status(statusCode).json({ message });
};

const createApp = (allowedOrigins?: string[]): express.Express => {
  const app = express();

  if (allowedOrigins && allowedOrigins.length > 0) {
    app.use(cors({ origin: allowedOrigins }));
  } else {
    app.use(cors());
  }

  app.use(express.json());
  app.use("/items", itemsRouter);
  app.use(errorHandler);

  return app;
};

export { createApp };
