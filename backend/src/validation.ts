import { isValidObjectId } from "mongoose";
import { HttpError } from "./errors";

export const requireString = (value: unknown, fieldName: string): string => {
  if (typeof value !== "string") {
    throw new HttpError(400, `${fieldName} must be a string`, "INVALID_FIELD");
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new HttpError(400, `${fieldName} cannot be empty`, "INVALID_FIELD");
  }

  return trimmed;
};

export const requireBoolean = (value: unknown, fieldName: string): boolean => {
  if (typeof value !== "boolean") {
    throw new HttpError(400, `${fieldName} must be a boolean`, "INVALID_FIELD");
  }

  return value;
};

export const requireObjectId = (value: string, fieldName: string): void => {
  if (!isValidObjectId(value)) {
    throw new HttpError(400, `${fieldName} must be a valid ObjectId`, "INVALID_ID");
  }
};
