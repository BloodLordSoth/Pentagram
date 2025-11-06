import request from "supertest";
import app from "../backend/app.js";

describe("/POST register route", () => {

  describe("without username", () => {
    test("should return 401 statusCode", async () => {
      const res = await request(app).post("/register").send({
        email: 'lordsoth@gmail.com',
        password: "coolguy"
      });
      expect(res.statusCode).toBe(401);
    });
  });

  describe("with UNIQUE constraint", () => {
    test("should return 409 statusCode", async () => {
      const res = await request(app).post("/register").send({
        email: 'lordsoth@gmail.com',
        username: 'lordsoth',
        password: "coolguy"
      });
      expect(res.statusCode).toBe(409);
    });
  });

});


describe("/POST login endpoint", () => {
    
  describe("Invalid password", () => {
    test("should return 409 statusCode", async () => {
      const res = await request(app).post("/login").send({
        username: 'lordsoth',
        password: "cool"
      });
      expect(res.statusCode).toBe(409);
    });
  });

  describe("Username not found", () => {
    test("should return 404 statusCode", async () => {
      const res = await request(app).post("/login").send({
        username: 'lordsottt',
        password: "coolguy"
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("successful login", () => {
    test("should return 200 statusCode", async () => {
      const res = await request(app).post("/login").send({
        username: 'lordsoth',
        password: "coolguy"
      });
      expect(res.statusCode).toBe(200);
    });
  });

});

