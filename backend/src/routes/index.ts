import { Router } from "express";
import { openAPIRoute } from "express-zod-openapi-autogen";
import { NGOResponseSchema } from "../models/zod-schemas/ngo.zod";
const router = Router();

/* GET home page. */
router.get(
  "/",

  openAPIRoute(
    {
      tag: "index",
      summary: "index",
      description: "index",
    },

    function (req, res, next) {
      res.render("index", { title: "Home4Strays Backend" });
    },
  ),
);

router.get(
  "/health",
  openAPIRoute(
    {
      tag: "index",
      summary: "Healthcheck",
      description: "Get a Ok",
    },

    async (req, res) => {
      res.status(200).send("Ok");
    },
  ),
);

export { router as indexRouter };
