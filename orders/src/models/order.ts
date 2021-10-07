import mongoose from "mongoose";
import { OrderStatus } from "@kgplantings/common";
import { PlantsDoc } from "./plant";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

// An interface that describes the properties
// that are required to create a New User

interface OrdersAttrs {
  userId: string;
  status: string;
  expiresAt: Date;
  plant: PlantsDoc;
}
// An interface that describes the properties
// that a User Document has

interface OrdersDoc extends mongoose.Document {
  userId: string;
  status: string;
  expiresAt: Date;
  version: number;
  plant: PlantsDoc;
}

// An interface that describes the properties
// that a User Model has

interface OrdersModel extends mongoose.Model<OrdersDoc> {
  build(attrs: OrdersAttrs): OrdersDoc;
}

const OrdersSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

OrdersSchema.set("versionKey", "version");
OrdersSchema.plugin(updateIfCurrentPlugin);

OrdersSchema.statics.build = (attrs: OrdersAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrdersDoc, OrdersModel>("Order", OrdersSchema);

export { Order };
