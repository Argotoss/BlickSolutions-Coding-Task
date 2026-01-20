import { model, Schema, type InferSchemaType } from "mongoose";

const shoppingItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    bought: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export type ShoppingItemDocument = InferSchemaType<typeof shoppingItemSchema>;

export const ShoppingItemModel = model("ShoppingItem", shoppingItemSchema);
