import type { ShoppingItem } from "./types";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const hasMessage = (value: unknown): value is { message: string } =>
  typeof value === "object" &&
  value !== null &&
  "message" in value &&
  typeof (value as { message: unknown }).message === "string";

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

const request = async <ResponseType>(
  path: string,
  options: RequestInit = {}
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

  if (response.status === 204) {
    return undefined as ResponseType;
  }

  return (await response.json()) as ResponseType;
};

export const fetchItems = (): Promise<ShoppingItem[]> => request("/items");

export const createItem = (name: string): Promise<ShoppingItem> =>
  request("/items", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const updateItem = (id: string, bought: boolean): Promise<ShoppingItem> =>
  request(`/items/${id}`, {
    method: "PUT",
    body: JSON.stringify({ bought }),
  });

export const deleteItem = (id: string): Promise<void> =>
  request(`/items/${id}`, {
    method: "DELETE",
  });
