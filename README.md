# Uforia Server

Link to live app: https://habit-app.now.sh/

### Technology Used

Node, Express, PostresSQL

## API Documentation

### Authentication

Uforia uses JWT tokens, required on the tasks and users endpoint requests. The tokens are created upon a users login and sent in the response body. All protected endpoints pull user_id from the JWT token give at login, and only return data specific to that user.

# API Endpoints:

## '/'

- This endpoint allows you to test your connection to the server. It will send a response containing "You've reached app.js" if you have connected sucessfully. It is not protected.

## /api/users endpoint:

### GET '/'

required:

- authorization token

returns the user from the database

### POST '/'

required:

- username (string)
  - must be unique
- password (string)
  - must include:
    - at least 8 and less than 72 characters
    - can't start with or end with spaces
    - at least 1 uppercase, 1 lowercase, and 1 number
- phone_number (integer)

returns 201 adding user to the database

## /api/auth endpoint

### POST '/login'

required:

- username (string)
- password (string)

returns JWT if credentials are valid

## /api/tasks endpoints:

### POST '/'

required:

- authorization token
- name (string)

returns 201 adding a task to the database

### GET '/:userId'

required:

- authorization token

returns list of tasks for a specific user

### DELETE '/:taskId'

required:

- taskId, passed as a string parameter

removes specific user task from database

### PATCH '/:taskId'

required:

- taskId, passed as a string parameter

returns and updates the date column in the database

### PATCH '/end/:taskId'

required:

- taskId, passed as a string parameter

returns and updates the date column in the database

### PATCH '/:taskId/modify'

required:

- taskId, passed as a string parameter

returns and updates the streak column in the database

### PATCH '/reset/:taskId'

required:

- taskId, passed as a string parameter

returns and updates the streak and start_date columns in the database to 0 and null respectively

## Summary

Uforia allows users to create their own account and keep track of daily habits they want to improve on in their lives. After creating an account and logging in the user gets directed to their home page where they can create a new daily goal which gets placed into their 'Goals queue' section. After creating a list of goals they would like to work on they can pick out of their 'Goals queue' to select ones to start working on by clicking 'Start' and it put those goals into the 'Current goals' section, which they will start keeping track of by clicking the 'Mark it!' button if they completed it for that day. If they don't mark the goal complete for 24 hours the goal gets placed back into their 'Goals queue' and the user must start that task over again. The idea is to turn these daily goals into habits and that usually happens after 60 consecutive days of completing the goals.

### Technology used:

HTML, SCSS, Javascript, React

### Landing page:

<img src='/src/images/landing_page.png' width='450' alt='Langing page'>

### Sign up page:

<img src='/src/images/signup.png' width='450' alt='Sign up page'>

### Log in page:

<img src='/src/images/login.png' width='450' alt='Log in page'>

### Home page:

<img src='/src/images/home.png' width='450' alt='Home page'>

### Create goal page:

<img src='/src/images/create_goal.png' width='450' alt='Create goal page'>

### Goals queue view:

<img src='/src/images/queue.png' width='450' alt='Goals queue'>

### Current goals view:

<img src='/src/images/current.png' width='450' alt='Current goals'>
