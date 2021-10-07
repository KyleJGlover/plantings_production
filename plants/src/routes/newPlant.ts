import express, { Request, Response } from "express";
import { requireAuth, BadRequestError } from "@kgplantings/common";
import { PlantCreatedPublisher } from "../events/publisher/plant-created-publisher";
import { Plant } from "../models/plant";
import { upload } from "../middleware/gridfs-image";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/plants",
  requireAuth,
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError("Image is required.");
    }

    const title = req.body.title;
    const description = req.body.description;
    const price = Number(req.body.price).valueOf();
    const imageFilename = req.file!.filename;

    if (!title) {
      throw new BadRequestError("Title is required.");
    }
    if (!description) {
      throw new BadRequestError("Description is required.");
    }
    if (!price) {
      throw new BadRequestError(
        "Price is required and Price must be a number."
      );
    }
    if (price < 0) {
      throw new BadRequestError("Must be greater than 0.");
    }

    const plant = Plant.build({
      owner: req.currentUser!.email,
      title: title,
      description,
      price,
      userId: req.currentUser!.id,
      imageFilename,
    });

    await plant.save();

    new PlantCreatedPublisher(natsWrapper.client).publish({
      id: plant.id,
      version: plant.version,
      title: plant.title,
      description: plant.description,
      price: plant.price,
      userId: plant.userId,
      imageFilename: plant.imageFilename,
    });
    console.log("hello");
    res.status(201).send(plant);
  }
);

export { router as createPlantRouter };
