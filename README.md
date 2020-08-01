# Uforia Server

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
