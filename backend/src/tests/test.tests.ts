import { server } from "../app";
import request from "supertest";
import { Response } from "superagent";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
describe("GET /", () => {
  afterAll(() => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it("should return default page", async () => {
    return request(server)
      .get("/")
      .expect(200)
      .then((res: Response) => {
        expect(res.statusCode).toBe(200);
      });
  });
});
