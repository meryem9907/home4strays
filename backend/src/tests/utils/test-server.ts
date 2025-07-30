import { debug } from "console";
import http from "http";
import { Error } from "../../utils/errors";

function normalizePort(val: string) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

const startTestServer = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
  port: string,
) => {
  const newPort = normalizePort(port);
  server
    .listen(port, () => {
      debug(`Listening on http://127.0.0.1:${newPort}`);
    })
    .on("error", (error: Error) => {
      if (error.syscall !== "listen") throw error;

      const bind =
        typeof newPort === "string" ? "Pipe " + newPort : "Port " + newPort;

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
  return server;
};

export { startTestServer };
