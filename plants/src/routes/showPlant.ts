import express, { Request, Response } from "express";
import { NotFoundError } from "@kgplantings/common";
import { Plant } from "../models/plant";
import { findOneImage } from "../helper/find-image";

const router = express.Router();

const baseImageURL = "https://plantings.dev/api/plants/image/";

router.get("/api/plants/:id", async (req: Request, res: Response) => {
  const plant = await Plant.findById(req.params.id);

  if (!plant) {
    throw new NotFoundError();
  }

  try {
    const error = await findOneImage(plant);

    const URL = baseImageURL + plant.imageFilename;

    res.send({ plant, URL });
  } catch (error) {
    console.log(error);
    throw new NotFoundError();
  }
});

export { router as showPlantRouter };
