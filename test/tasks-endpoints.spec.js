const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('tasks endpoints', () => {
  let db;
  const { testUsers } = helpers.makeTasksFixtures();
  const { testTasks } = helpers.makeTasksFixtures();
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
    return db.into('users').insert(testUsers);
  });

  context('Given there are tasks in the database', () => {
    beforeEach('insert tasks', () => {
      return db.into('tasks').insert(testTasks);
    });

    it(`GET /api/tasks responds with 200 and all of the tasks for that user`, () => {
      const expectedTask = testTasks.filter(
        (task) => task.user_id === testUser.id
      );
      console.log(expectedTask);
      return supertest(app)
        .get('/api/tasks')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect((res) => {
          expect(res.body[0]).to.have.property('id');
          expect(res.body[0].user_id).to.eql(expectedTask[0].user_id);
          expect(res.body[0].name).to.eql(expectedTask[0].name);
          expect(res.body[0].start_time).to.eql(expectedTask[0].start_time);
          expect(res.body[0].duration).to.eql(expectedTask[0].duration);
          expect(res.body[0].category).to.eql(expectedTask[0].category);
          expect(res.body[0].streak).to.eql(expectedTask[0].streak);
          expect(res.body[0]).to.have.property('start_date');
          expect(res.body[0]).to.have.property('end_date');
        });
    });

    it(`DELETE /api/tasks/:taskId responds with 204, deletes task`, () => {
      const task_id = 1;
      return supertest(app)
        .delete(`/api/tasks/${task_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(204);
    });

    // updating dates and streak?
    // it(`PATCH /api/tasks/:taskId responds with 204, updates task`, () => {
    //   const task_id = 1;

    // })
  });

  it(`POST /api/tasks responds with 201 and new task`, () => {
    const task_id = 1;
    const newTask = {
      user_id: testUser.id,
      name: 'test task',
      start_time: '1:00pm',
      duration: '3 hours',
      category: 'Exercise',
    };

    return supertest(app)
      .post('/api/tasks')
      .set('Authorization', helpers.makeAuthHeader(testUser))
      .send(newTask)
      .expect(201)
      .expect((res) => {
        expect(res.body).to.have.property('id');
        expect(res.body.user_id).to.eql(newTask.user_id);
        expect(res.body.name).to.eql(newTask.name);
        expect(res.body.start_time).to.eql(newTask.start_time);
        expect(res.body.duration).to.eql(newTask.duration);
        expect(res.body.category).to.eql(newTask.category);
        expect(res.headers.location).to.eql(`/api/tasks/${res.body.id}`);
      })
      .then((postRes) =>
        supertest(app)
          .get(`/api/tasks/${postRes.body.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(postRes.body)
      );
  });
});
