import type { Express } from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findMock = vi.fn();
const createMock = vi.fn();
const findByIdAndUpdateMock = vi.fn();
const findByIdAndDeleteMock = vi.fn();

vi.mock("../models/shopping-item", () => ({
  ShoppingItemModel: {
    find: findMock,
    create: createMock,
    findByIdAndUpdate: findByIdAndUpdateMock,
    findByIdAndDelete: findByIdAndDeleteMock,
  },
}));

let app: Express;

const objectId = "507f1f77bcf86cd799439011";

beforeEach(async () => {
  findMock.mockReset();
  createMock.mockReset();
  findByIdAndUpdateMock.mockReset();
  findByIdAndDeleteMock.mockReset();

  const { createApp } = await import("../app");
  app = createApp();
});

describe("items API", () => {
  it("returns an empty list initially", async () => {
    findMock.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      }),
    });

    const response = await request(app).get("/items");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("creates and updates an item", async () => {
    const createdItem = { _id: objectId, name: "Butter", bought: false };
    const updatedItem = { _id: objectId, name: "Butter", bought: true };

    createMock.mockResolvedValue(createdItem);
    findByIdAndUpdateMock.mockReturnValue({
      lean: vi.fn().mockResolvedValue(updatedItem),
    });

    const createResponse = await request(app).post("/items").send({ name: "Butter" });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toMatchObject({ name: "Butter", bought: false });

    const updateResponse = await request(app)
      .put(`/items/${objectId}`)
      .send({ bought: true });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject({ bought: true });
  });

  it("rejects empty item names", async () => {
    const response = await request(app).post("/items").send({ name: "   " });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ message: "name cannot be empty" });
  });

  it("returns 404 when updating a missing item", async () => {
    findByIdAndUpdateMock.mockReturnValue({
      lean: vi.fn().mockResolvedValue(null),
    });

    const response = await request(app).put(`/items/${objectId}`).send({ bought: true });

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: "Item not found" });
  });

  it("deletes an item", async () => {
    findByIdAndDeleteMock.mockReturnValue({
      lean: vi.fn().mockResolvedValue({ _id: objectId, name: "Milk", bought: false }),
    });

    const deleteResponse = await request(app).delete(`/items/${objectId}`);

    expect(deleteResponse.status).toBe(204);
    expect(deleteResponse.text).toBe("");
  });
});
