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
    expect(response.body.data).toHaveProperty("username", "newuser");
  });

  it("should return 401 if no token provided", async () => {
    const response = await request(app).get("/auth/me"); // Your protected route

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorization");
  });
});

describe("Books API", () => {
  let token;

  beforeAll(async () => {
    // Log in to get the auth token
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "testpassword" });

    token = res.body.data.token;
  });

  afterAll(async () => {
    // Close DB connection after tests
    // await db.end();
  });

  it("should create a new book", async () => {
    const res = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bookName: "New Book",
        bookDescription: "Description of the new book",
        bookPrice: 19.99,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
  });

  it("should get a list of books", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("books");
  });

  it("should get a specific book by ID", async () => {
    const res = await request(app).get("/books/1"); // Assuming book with ID 1 exists
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("book");
  });

  it("should update a book", async () => {
    const res = await request(app)
      .put("/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bookId: 1,
        bookName: "Updated Book",
        bookDescription: "Updated description",
        bookPrice: 24.99,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
  });

  it("should delete a book", async () => {
    const res = await request(app)
      .delete("/books")
      .set("Authorization", `Bearer ${token}`)
      .send({ bookId: 1 });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
  });
});
