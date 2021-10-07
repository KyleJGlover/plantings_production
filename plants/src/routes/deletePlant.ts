import express, { Request, Response } from "express";
import { Plant } from "../models/plant";
import { PlantDeletedPublisher } from "../events/publisher/plant-deleted-event";
import { natsWrapper } from "../nats-wrapper";

import {
  NotFoundError,
  validateRequest,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from "@kgplantings/common";

// import { gfs } from "../middleware/gridfs-image";
// import mongoose from "mongoose";

const router = express.Router();

router.delete(
  "/api/plants/:id",
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      throw new NotFoundError();
    }

    // const image = await gfs.find({ filename: req.params.id });

    // if (!image) {
    //   throw new NotFoundError();
    // }

    if (plant.orderId) {
      throw new BadRequestError("Can't edit an reserved ticket");
    }

    if (plant.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    try {
      await Plant.findByIdAndDelete(plant.id);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Couldn't delete Post");
    }

    await new PlantDeletedPublisher(natsWrapper.client).publish({
      id: plant.id,
      version: plant.version,
      title: plant.title,
      description: plant.description,
      price: plant.price,
      userId: plant.userId,
      imageFilename: plant.imageFilename,
    });

    res.send({}).status(200);
  }
);

export { router as deletePlantRouter };
