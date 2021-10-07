import mongoose from "mongoose";
import { OrderStatus } from "@kgplantings/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

// An interface that describes the properties
// that are required to create a New Order

interface OrdersAttrs {
  id: string;
  userId: string;
  version: number;
  status: string;
  price: number;
}
// An interface that describes the properties
// that a Order Document has

interface OrdersDoc extends mongoose.Document {
  userId: string;
  status: string;
  version: number;
  price: number;
}

// An interface that describes the properties
// that a Order Model has

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
    price: {
      type: Number,
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
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

OrdersSchema.set("versionKey", "version");
OrdersSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model<OrdersDoc, OrdersModel>("Order", OrdersSchema);

export { Order };
