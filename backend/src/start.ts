import { debug } from "console";
import { server, port, databaseManager } from "./app";
import { Error } from "./utils/errors";

// Start server
(async () => {
  try {
    await databaseManager.migrate();
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
})();
server
  .listen(port, () => {
    debug(`Listening on http://127.0.0.1:${port}`);
  })
  .on("error", (error: Error) => {
    if (error.syscall !== "listen") throw error;

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
      case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);
      default:
        throw error;
    }
  });
