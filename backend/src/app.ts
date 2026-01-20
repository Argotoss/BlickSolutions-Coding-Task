import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { HttpError } from "./errors";
import { ShoppingItemModel } from "./models/shopping-item";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/items", async (_request, response, next) => {
  try {
    const items = await ShoppingItemModel.find().sort({ createdAt: -1 }).lean();
    response.json(items);
  } catch (error: unknown) {
    next(error);
  }
});

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
