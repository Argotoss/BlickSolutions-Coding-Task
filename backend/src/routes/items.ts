import { Router } from "express";
import { HttpError } from "../errors";
import { ShoppingItemModel } from "../models/shopping-item";
import { requireBoolean, requireObjectId, requireString } from "../validation";

const itemsRouter = Router();

itemsRouter.get("/", async (_request, response, next) => {
  try {
    const items = await ShoppingItemModel.find().sort({ createdAt: -1 }).lean();
    response.json(items);
  } catch (error: unknown) {
    next(error);
  }
});

itemsRouter.post("/", async (request, response, next) => {
  try {
    const name = requireString(request.body?.name, "name");
    const item = await ShoppingItemModel.create({ name, bought: false });
    response.status(201).json(item);
  } catch (error: unknown) {
    next(error);
  }
});

itemsRouter.put("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    requireObjectId(id, "id");
    const bought = requireBoolean(request.body?.bought, "bought");

    const item = await ShoppingItemModel.findByIdAndUpdate(
      id,
      { bought },
      { new: true, runValidators: true }
    ).lean();

    if (!item) {
      throw new HttpError(404, "Item not found");
    }

    response.json(item);
  } catch (error: unknown) {
    next(error);
  }
});

itemsRouter.delete("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    requireObjectId(id, "id");

    const item = await ShoppingItemModel.findByIdAndDelete(id).lean();

    if (!item) {
      throw new HttpError(404, "Item not found");
    }

    response.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
});

export { itemsRouter };
