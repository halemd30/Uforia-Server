const knex = require("knex");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { expect } = require("chai");

describe("Users Endpoints", function () {
  let db;

  const { testUsers } = helpers.makeTasksFixtures();
  const testUser = testUsers[0];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`POST /api/users`, () => {
    context("User Validation", () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

      const requiredFields = ["username", "password", "phone_number"];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          username: "test username",
          password: "test password",
          phone_number: "phone_number",
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post("/api/users")
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            });
        });
      });
    });
  });
});
