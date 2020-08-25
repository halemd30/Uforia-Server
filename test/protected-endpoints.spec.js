const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { json } = require("express");

describe("Protected endpoints", () => {
  let db;

  const { testUsers } = helpers.makeTasksFixtures();
  const testUser = testUsers[0];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy(db));
  beforeEach("clean the table", () => helpers.cleanTables(db));

  beforeEach("insert users", () => {
    return db.into("users").insert(testUsers);
  });

  const getEndpoints = [
    {
      name: "GET /api/users",
      path: "/api/users",
    },
    {
      name: "GET /api/tasks",
      path: "/api/tasks",
    },
  ];

  getEndpoints.forEach((endpoint) => {
    it(`${endpoint.name} responds with 401 'missing bearer token' when no bearer token`, () => {
      return supertest(app).get(endpoint.path).expect(401, {
        error: "Missing bearer token",
      });
    });
    it(`${endpoint.name} responds with 401 'Unauthorized request' when invalid JWT secret`, () => {
      const validUser = testUser;
      const invalidSecret = "bad-secret";

      return supertest(app)
        .get(endpoint.path)
        .set("Authorization", helpers.makeAuthHeader(validUser, invalidSecret))
        .expect(401, {
          error: "Unauthorized request",
        });
    });
    it(`${endpoint.name} responds with 401 'Unauthorized request' when invalid sub in payload`, () => {
      const invalidUser = { username: "nope", id: 1 };

      return supertest(app)
        .get(endpoint.path)
        .set("Authorization", helpers.makeAuthHeader(invalidUser))
        .expect(401, {
          error: "Unauthorized request",
        });
    });
  });

  const patchEndpoints = [
    {
      name: "PATCH /api/tasks/:taskId",
      path: "/api/tasks/1",
    },
    {
      name: "PATCH /api/tasks/end/:taskId",
      path: "/api/tasks/end/1",
    },
    {
      name: "PATCH /api/tasks/:taskId/modify",
      path: "/api/tasks/1/modify",
    },
    {
      name: "PATCH /api/tasks/reset/:taskId",
      path: "/api/tasks/reset/1",
    },
  ];

  patchEndpoints.forEach((endpoint) => {
    it(`${endpoint.name} responds with 401 'Missing bearer token' when no bearer token`, () => {
      return supertest(app).patch(endpoint.path).expect(401, {
        error: "Missing bearer token",
      });
    });
    it(`${endpoint.name} responds with 401 'Unauthorized request' when invalid JWT`, () => {
      const validUser = testUser;
      const invalidSecret = "bad-secret";

      return supertest(app)
        .patch(endpoint.path)
        .set("Authorization", helpers.makeAuthHeader(validUser, invalidSecret))
        .expect(401, {
          error: "Unauthorized request",
        });
    });
    it(`${endpoint.name} responds with 401 'Unauthorized request' when invalid sub in payload`, () => {
      const invalidUser = { username: "nope", id: 1 };

      return supertest(app)
        .patch(endpoint.path)
        .set("Authorization", helpers.makeAuthHeader(invalidUser))
        .expect(401, {
          error: "Unauthorized request",
        });
    });
  });

  context("DELETE endpoint", () => {
    it(`DELETE /api/tasks/:taskId responds with 401 'Missing bearer token' when no bearer token`, () => {
      return supertest(app).delete("/api/tasks/1").expect(401, {
        error: "Missing bearer token",
      });
    });
    it(`DELETE /api/tasks/:taskId responds with 401 'Unauthorized request' when invalid JWT`, () => {
      const validUser = testUser;
      const invalidSecret = "bad-secret";

      return supertest(app)
        .delete("/api/tasks/1")
        .set("Authorization", helpers.makeAuthHeader(validUser, invalidSecret))
        .expect(401, {
          error: "Unauthorized request",
        });
    });
    it(`DELETE /api/tasks/:taskId responds with 401 'Unauthorized request' when invalid sub in payload`, () => {
      const invalidUser = { username: "nope", id: 1 };

      return supertest(app)
        .delete("/api/tasks/1")
        .set("Authorization", helpers.makeAuthHeader(invalidUser))
        .expect(401, {
          error: "Unauthorized request",
        });
    });
  });

  context("POST endpoint", () => {
    it(`POST /api/tasks responds with 401 'Missing bearer token' when no bearer token`, () => {
      return supertest(app).post("/api/tasks").expect(401, {
        error: "Missing bearer token",
      });
    });
    it(`POST /api/tasks responds with 401 'Unauthorized request' when invalid JWT`, () => {
      const validUser = testUser;
      const invalidSecret = "bad-secret";

      return supertest(app)
        .post("/api/tasks")
        .set("Authorization", helpers.makeAuthHeader(validUser, invalidSecret))
        .expect(401, {
          error: "Unauthorized request",
        });
    });
    it(`POST /api/tasks responds with 401 'Unauthorized request' when invalid sub in payload`, () => {
      const invalidUser = { username: "nope", id: 1 };

      return supertest(app)
        .post("/api/tasks")
        .set("Authorization", helpers.makeAuthHeader(invalidUser))
        .expect(401, {
          error: "Unauthorized request",
        });
    });
  });
});
