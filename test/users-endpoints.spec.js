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
      it(`responds 400 'Password must be longer than 7 characters' when empty password`, () => {
        const userShortPassword = {
          username: "test_username",
          password: "asdf13",
          phone_number: "1231231234",
        };

        return supertest(app)
          .post("/api/users")
          .send(userShortPassword)
          .expect(400, {
            error: "Password must be at least 8 characters",
          });
      });

      it(`responds 400 when password is longer than 72 characters`, () => {
        const passwordTooLong = {
          username: "test_user",
          password: "Aasdf123",
          phone_number: "1231231234",
        };

        return supertest(app)
          .post("/api/users")
          .send(passwordTooLong)
          .expect(400, {
            error: "Password must be less than 72 characters",
          });
      });

      it(`responds 400 when password starts with spaces`, () => {
        const passwordStartsWithSpaces = {
          username: "test_user",
          password: " Asdf1234",
          phone_number: "1231231234",
        };

        return supertest(app)
          .post("/api/users")
          .send(passwordStartsWithSpaces)
          .expect(400, {
            error: "Password must not start or end with empty spaces",
          });
      });

      it(`responds 400 when password ends with spaces`, () => {
        const passwordEndsWithSpaces = {
          username: "test_user",
          password: "Asdf1324 ",
          phone_number: "1231231234",
        };

        return supertest(app)
          .post("/api/users")
          .send(passwordEndsWithSpaces)
          .expect(400, {
            error: "Password must not start or end with empty spaces",
          });
      });

      it(`responds 400 when username is already taken`, () => {
        const duplicateUser = {
          username: "test_user",
          password: "Asdf1324",
          phone_number: "1231231234",
        };

        return supertest(app)
          .post("/api/users")
          .send(duplicateUser)
          .expect(400, {
            error: "Username already taken",
          });
      });
    });

    context("Happy path", () => {
      it(`responds 201, serialized user, storing bcrypted password`, () => {
        const newUser = {
          username: "test_user",
          password: "Asdf1234",
          phone_number: "1231231234",
        };

        return supertest(app)
          .post("/api/users")
          .send(newUser)
          .expect(201)
          .expect((res) => {
            expect(res.body).to.have.property("id");
            expect(res.body.username).to.eql(newUser.username);
            expect(res.body.phone_number).to.eql(newUser.phone_number);
            expect(res.body).to.not.have.property("password");
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
          })
          .expect((res) =>
            db
              .from("users")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then((row) => {
                expect(row.username).to.eql(newUser.username);
                expect(row.phone_number).to.eql(newUser.phone_number);

                return bcrypt.compare(newUser.password, row.password);
              })
              .then((compareMatch) => {
                expect(compareMatch).to.be.true;
              })
          );
      });
    });
  });
});
