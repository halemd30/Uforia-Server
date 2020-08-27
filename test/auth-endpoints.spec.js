const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('auth endpoints', () => {
  let db;
  const { testUsers } = helpers.makeTasksFixtures();
  const testUser = testUsers[0];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy(db));
  beforeEach('clean the table', () => helpers.cleanTables(db));

  beforeEach('insert users', () => {
    return helpers.seedUsers(db, testUsers);
  });

  describe('POST /api/auth/login', () => {
    const requiredFields = ['username', 'password'];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
      };

      it(`responds 400 required error when ${field} is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    it(`responds 400 'invalid username or password' when bad username`, () => {
      const invalidUsername = { username: 'nope', password: 'good' };

      return supertest(app)
        .post('/api/auth/login')
        .send(invalidUsername)
        .expect(400, {
          error: 'Incorrect username or password',
        });
    });

    it(`responds 400 'invalid username or password' when bad password`, () => {
      const invalidPassword = {
        username: testUser.username,
        password: 'nope',
      };

      return supertest(app)
        .post('/api/auth/login')
        .send(invalidPassword)
        .expect(400, {
          error: 'Incorrect username or password',
        });
    });

    it(`responds 200 and JWT auth token using secret when valid credentials`, function () {
      this.retries(3);

      const userValidCreds = {
        username: testUser.username,
        password: testUser.password,
      };

      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.username,
          algorithm: 'HS256',
        }
      );

      return supertest(app)
        .post('/api/auth/login')
        .send(userValidCreds)
        .expect(200, { authToken: expectedToken });
    });
  });
});
