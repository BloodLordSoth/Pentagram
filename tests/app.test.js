import request from "supertest";
import app from "../backend/app.js";

describe("/POST register route", () => {
  describe("without username", () => {
    test("should return 401 statusCode", async () => {
      const res = await request(app).post("/register").send({
        password: "coolguy",
      });
      expect(res.statusCode).toBe(401);
    });
  });
});
