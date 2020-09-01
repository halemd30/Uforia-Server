const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      password: 'Password1',
      phone_number: '1234567890',
    },
    {
      id: 2,
      username: 'test-user-2',
      password: 'Password2',
      phone_number: '1234565432',
    },
    {
      id: 3,
      username: 'test-user-3',
      password: 'Password3',
      phone_number: '1234562938',
    },
  ];
}

function makeTasksArray(users) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      name: 'Workout',
      start_time: '1:00pm',
      duration: '1 hour',
      category: 'Exercise',
      streak: 1,
      start_date: '2020-08-04T16:22:04.975Z',
    },
    {
      id: 2,
      user_id: users[1].id,
      name: 'Wake up at 5:00am',
      start_time: '5:00am',
      duration: '',
      category: 'Waking up',
      streak: 5,
      start_date: '2020-05-04T16:22:04.975Z',
    },
    {
      id: 3,
      user_id: users[2].id,
      name: 'Eat veggies',
      start_time: '8:00am',
      duration: 'All day',
      category: 'Food',
      streak: 10,
      start_date: '2020-03-04T16:22:04.975Z',
    },
  ];
}

function makeTasksFixtures() {
  const testUsers = makeUsersArray();
  const testTasks = makeTasksArray(testUsers);
  return { testUsers, testTasks };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      tasks,
      users
      RESTART IDENTITY CASCADE`
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 8),
  }));
  return db
    .into('users')
    .insert(preppedUsers)
    .then(() => db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id]));
}

function seedTasks(db, tasks) {
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into('tasks').insert(tasks);
    await trx.raw(`SELECT setval('tasks_id_seq', ?)`, [tasks[tasks.length - 1].id]);
  });
}

function makeMaliciousUser() {
  const maliciousUser = {
    username: 'Naughty naughty very naughty <script>alert("xss");</script>',
    password: '11Naughty naughty very naughty <script>alert("xss");</script>',
    phone_number: '22Naughty naughty very naughty <script>alert("xss");</script>',
  };
  const expectedUser = {
    username: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    password: '11Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    phone_number: '22Naughty naughty very naughty <script>alert("xss");</script>',
  };
  return {
    maliciousUser,
    expectedUser,
  };
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeTasksArray,
  makeTasksFixtures,
  cleanTables,
  seedUsers,
  seedTasks,
  makeMaliciousUser,
  makeAuthHeader,
};
