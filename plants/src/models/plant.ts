import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are required to create a New User

interface PlantsAttrs {
  owner: string;
  title: string;
  description: string;
  category: string;
  price: number;
  userId: string;
  imageFilename: string;
}
// An interface that describes the properties
// that a User Document has

interface PlantsDoc extends mongoose.Document {
  owner: string;
  title: string;
  description: string;
  category: string;
  price: number;
  userId: string;
  imageFilename: string;
  version: number;
  orderId?: string;
}

// An interface that describes the properties
// that a User Model has

interface PlantsModel extends mongoose.Model<PlantsDoc> {
  build(attrs: PlantsAttrs): PlantsDoc;
}

const plantsSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    imageFilename: {
      type: String,
      required: false,
    },
    orderId: {
      type: String,
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

plantsSchema.set("versionKey", "version");
plantsSchema.plugin(updateIfCurrentPlugin);

plantsSchema.statics.build = (attrs: PlantsAttrs) => {
  return new Plant(attrs);
};

const Plant = mongoose.model<PlantsDoc, PlantsModel>("Plant", plantsSchema);

export { Plant };
