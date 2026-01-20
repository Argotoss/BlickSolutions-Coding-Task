import type { ShoppingItem } from "./types";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const hasMessage = (value: unknown): value is { message: string } =>
  isRecord(value) && typeof value.message === "string";

const isShoppingItem = (value: unknown): value is ShoppingItem =>
  isRecord(value) &&
  typeof value._id === "string" &&
  typeof value.name === "string" &&
  typeof value.bought === "boolean" &&
  typeof value.createdAt === "string";

const parseShoppingItem = (value: unknown): ShoppingItem => {
  if (!isShoppingItem(value)) {
    throw new Error("Invalid item data");
  }

  return value;
};

const parseShoppingItems = (value: unknown): ShoppingItem[] => {
  if (!Array.isArray(value)) {
    throw new Error("Invalid items data");
  }

  return value.map(parseShoppingItem);
};

const readErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const data: unknown = await response.json();
    if (hasMessage(data)) {
      return data.message;
    }
  }

  const fallback = await response.text();
  return fallback || `Request failed with ${response.status}`;
};

const requestJson = async <ResponseType>(
  path: string,
  options: RequestInit,
  parser: (value: unknown) => ResponseType
): Promise<ResponseType> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message);
  }

  const data: unknown = await response.json();
  return parser(data);
};

const requestNoContent = async (path: string, options: RequestInit): Promise<void> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message);
  }
};

export const fetchItems = (): Promise<ShoppingItem[]> =>
  requestJson("/items", {}, parseShoppingItems);

export const createItem = (name: string): Promise<ShoppingItem> =>
  requestJson(
    "/items",
    {
      method: "POST",
      body: JSON.stringify({ name }),
    },
    parseShoppingItem
  );

export const updateItem = (id: string, bought: boolean): Promise<ShoppingItem> =>
  requestJson(
    `/items/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({ bought }),
    },
    parseShoppingItem
  );

export const deleteItem = (id: string): Promise<void> =>
  requestNoContent(`/items/${id}`, {
    method: "DELETE",
  });
