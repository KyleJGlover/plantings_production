import express, { Request, Response } from "express";
import { NotFoundError } from "@kgplantings/common";
import { gfs } from "../middleware/gridfs-image";

const router = express.Router();

router.get("/api/plants/image/:id", async (req: Request, res: Response) => {
  try {
    const image = await gfs.find({ filename: req.params.id });
    // Check if the file exists
    if (!image || image.length === 0) {
      throw new NotFoundError();
    }
    await gfs.openDownloadStreamByName(req.params.id).pipe(res);
  } catch (error) {
    console.log(error);
    throw new NotFoundError();
  }
  res.status(200);
});

export { router as imageRouter };
