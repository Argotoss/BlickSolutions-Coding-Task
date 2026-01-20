import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { HttpError } from "./errors";

const app = express();

app.use(cors());
app.use(express.json());

app.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
  if (!error) {
    next();
    return;
  }

  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof HttpError ? error.message : "Internal server error";
  response.status(statusCode).json({ message });
});

export { app };
