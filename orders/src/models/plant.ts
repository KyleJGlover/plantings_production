import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are required to create a New Plant

interface PlantsAttrs {
  id: string;
  title: string;
  price: number;
}
// An interface that describes the properties
// that a Plant Document has

export interface PlantsDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

// An interface that describes the properties
// that a Plant Model has

interface PlantsModel extends mongoose.Model<PlantsDoc> {
  build(attrs: PlantsAttrs): PlantsDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<PlantsDoc | null>;
}

const plantsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

plantsSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Plant.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

plantsSchema.statics.build = (attrs: PlantsAttrs) => {
  return new Plant({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

plantsSchema.set("versionKey", "version");
plantsSchema.plugin(updateIfCurrentPlugin);

// Make sure this ticket is not already reserved
// Run query to look at all orders. Find an order where the plant
// is the plant we just found and the orders status is not cancelled.
// If we find an order from that means the ticket is reserved
plantsSchema.methods.isReserved = async function () {
  // this === the plant document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    plant: this as any,
    status: {
      $in: [
        OrderStatus.Complete,
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
      ],
    },
  });
  return !!existingOrder;
};

const Plant = mongoose.model<PlantsDoc, PlantsModel>("Plant", plantsSchema);

export { Plant };
