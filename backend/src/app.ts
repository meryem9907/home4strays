import express, { Application, Request, Response, NextFunction } from "express";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import debugLib from "debug";
import http from "http";
import cors from "cors";
import { buildOpenAPIDocument } from "express-zod-openapi-autogen";
import swaggerUI from "swagger-ui-express";

// config
import { corsOptions } from "./config/cors.config";

// services
import { DatabaseManager } from "./database/db";
import MinioManager from "./utils/minio-manager";
import { TranslationManager } from "./utils/translations-manager";

// router
import { verificationRouter } from "./routes/verification";
import { indexRouter } from "./routes/index";
import { authRouter } from "./routes/auth";
import { inviteRouter } from "./routes/invite";
import { searchRouter } from "./routes/search";
import { userRouter } from "./routes/user";
import { profilesRouter } from "./routes/profiles";
import { enumRouter } from "./routes/enums";
import { ngoMemberRouter } from "./routes/ngo-member";
import { caretakerRouter } from "./routes/caretaker";
import { matchRouter } from "./routes/match";
import { picturesRouter } from "./routes/pictures";
import { ngoRouter } from "./routes/ngo";
import { petRouter } from "./routes/pet";

// middlewares
import { detectLanguage } from "./middlewares/detect-lang.middleware";

// Debug logger
const debug = debugLib("home4strays-backend:server");

// Start db and minio server
export const databaseManager = DatabaseManager.getInstance();
// databaseManager.rollback();
export const minioManager = MinioManager.getInstance();

// Normalize port
function normalizePort(val: string) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

const port = normalizePort(process.env.PORT || "3000");
// Initialize app and server
const app: Application = express();
const server = http.createServer(app);
app.use(TranslationManager.getInstance().geti18n().init);
app.use(cors(corsOptions));
app.set("port", port);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//app.use(async () => {await databaseManager.migrate()})
app.use(detectLanguage);

// Routes
const allRouters = [
  caretakerRouter,
  indexRouter,
  authRouter,
  verificationRouter,
  inviteRouter,
  profilesRouter,
  userRouter,
  searchRouter,
  enumRouter,
  ngoMemberRouter,
  ngoRouter,
  picturesRouter,
  matchRouter,
  petRouter,
];

// Validate routers before using them
function isValidRouter(router: any): boolean {
  return (
    router &&
    typeof router === "function" &&
    router.stack &&
    Array.isArray(router.stack)
  );
}

// Filter out invalid routers and log warnings
const publicAPIs = allRouters.filter((router, index) => {
  if (!isValidRouter(router)) {
    console.warn(
      `Warning: ${index} is not a valid Express router or is undefined`,
    );
    return false;
  }
  return true;
});

// Attach API routes
for (const router of allRouters) {
  app.use("/", router);
}

// Public documentation (auto-generated for all routes above this line)
try {
  console.log(`Generating OpenAPI docs for ${publicAPIs.length} valid routers`);

  const doc = buildOpenAPIDocument({
    routers: allRouters,
    schemaPaths: [],
    config: {
      servers: [{ url: `https://home4strays.org` }],
      info: {
        version: "1.0.0",
        title: "Home4Strays API",
        description: `Homne4Strays API`,
      },
    },
    errors: {
      401: "Unauthorized",
      403: "Forbidden",
    },
    openApiVersion: "3.0.0",
  });

  app.get("/openapi.json", (req: Request, res: Response) => {
    res.json(doc);
  });

  app.use(`/openapi`, swaggerUI.serve, swaggerUI.setup(doc));
  console.log("OpenAPI documentation generated successfully");
} catch (err) {
  console.error("Failed to generate OpenAPI documentation:", err);
}

// Catch 404
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (req.accepts("json")) {
    res
      .status(err.status || 500)
      .json({ error: { message: err.message || err } });
  } else {
    res.status(err.status || 500);
    res.render("error");
  }
});

export { port, server };
