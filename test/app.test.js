const request = require("supertest");
const { describe } = require("node:test");
const { app } = require("..");
const jwt = require("jsonwebtoken");
require("dotenv").config();

describe("POST /auth/login", () => {
  it("Should return message success", async () => {
    const res = await request(app)
      .post("/auth/login")
      .set("content-type", "application/json")
      .send({
        username: "newuser",
        password: "newpassword",
      });
    expect(res.body.success).toBe(true);
    expect(res.status).toBe(200);
  });
});

describe("GET /me", () => {
  it("should return user data when authenticated", async () => {
    // Sign a test JWT token
    const token = jwt.sign(
      { uid: 1, username: "newuser" },
      process.env.JWT_PRIVATE_KEY
    );

    // Perform request with Authorization header
    const response = await request(app)
      .get("/auth/me") // Your protected route
      .set("authorization", `Bearer ${token}`); // Set the Authorization header

    // Validate response
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Authenticated successfully"
    );
    expect(response.body.user).toHaveProperty("username", "newuser");
  });

  it("should return 401 if no token provided", async () => {
    const response = await request(app).get("/auth/me"); // Your protected route

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorization");
  });
});
