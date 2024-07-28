

# API Documentation

## 1. Create User

- **Method:** POST
- **URL:** `http://127.0.0.1:8000/users/api/createuser/`
- **Content-Type:** application/json
- **Description:** Create a new user.
- **Request Body:**
  ```json
  {
      "uid": "User ID in Base64",
      "token": "Token for validation",
      "userType": "User type in Base64 (e.g., 'Cashier', 'Coach', 'Member')",
      "password": "Password for the new user"
  }
  ```
- **Response Example:**
  ```json
  {
      "email": "user@example.com",
      "message": "User has been created successfully"
  }
  ```

## 2. Login

- **Method:** POST
- **URL:** `http://127.0.0.1:8000/users/api/login/`
- **Content-Type:** application/json
- **Description:** Login a user.
- **Request Body:**
  ```json
  {
      "email": "Email address of the user",
      "password": "User password"
  }
  ```
- **Response Example:**
  ```json
  {
      "token": "Auth Token",
      "user": {
          "email": "user@example.com",
          "userType": "Cashier/Coach/Member"
      }
  }
  ```

## 3. Password Reset Request

- **Method:** POST
- **URL:** `http://127.0.0.1:8000/users/api/PasswordResetRequest/`
- **Content-Type:** application/json
- **Description:** Request a password reset link.
- **Request Body:**
  ```json
  {
      "email": "Email address of the user requesting password reset"
  }
  ```
- **Response Example:**
  ```json
  {
      "message": "Password reset link sent successfully."
  }
  ```

## 4. Set New Password

- **Method:** POST
- **URL:** `http://127.0.0.1:8000/users/api/SetNewPassword/`
- **Content-Type:** application/json
- **Description:** Set a new password using a token.
- **Request Body:**
  ```json
  {
      "password": "New password",
      "token": "Token for password reset",
      "uid": "User ID in Base64"
  }
  ```
- **Response Example:**
  ```json
  {
      "message": "Password has been updated successfully."
  }
  ```

## 5. Get Cashier List

- **Method:** GET
- **URL:** `http://127.0.0.1:8000/users/api/CashierList/`
- **Content-Type:** application/json
- **Description:** Retrieve the list of cashiers.
- **Headers:**
  ```json
  {
      "Authorization": "Token [your_token_here]"
  }
  ```
- **Response Example:**
  ```json
  [
      {
          "id": 1,
          "name": "John Doe",
          "email": "john.doe@example.com"
      }
  ]
  ```

## 6. Get Coach List

- **Method:** GET
- **URL:** `http://127.0.0.1:8000/users/api/CoachList/`
- **Content-Type:** application/json
- **Description:** Retrieve the list of coaches.
- **Headers:**
  ```json
  {
      "Authorization": "Token [your_token_here]"
  }
  ```
- **Response Example:**
  ```json
  [
      {
          "id": 1,
          "name": "Jane Smith",
          "email": "jane.smith@example.com"
      }
  ]
  ```

## 7. Get Member List

- **Method:** GET
- **URL:** `http://127.0.0.1:8000/users/api/MemberList/`
- **Content-Type:** application/json
- **Description:** Retrieve the list of members.
- **Headers:**
  ```json
  {
      "Authorization": "Token [your_token_here]"
  }
  ```
- **Response Example:**
  ```json
  [
      {
          "id": 1,
          "name": "Alice Johnson",
          "email": "alice.johnson@example.com"
      }
  ]
  ```

## 8. Create Cashier

- **Method:** POST
- **URL:** `http://127.0.0.1:8000/users/api/CreateCashier/`
- **Content-Type:** application/json
- **Description:** Create a new cashier.
- **Request Body:**
  ```json
  {
      "name": "Full name of the cashier",
      "email": "Email address",
      "phone": "Phone number",
      "nat_id": "National ID",
      "address": "Address"
  }
  ```
- **Headers:**
  ```json
  {
      "Authorization": "Token [your_token_here]"
  }
  ```
- **Response Example:**
  ```json
  {
      "message": "Cashier created successfully",
      "cashier": {
          "name": "John Doe",
          "email": "john.doe@example.com"
      }
  }
  ```

## 9. Create Coach

- **Method:** POST
- **URL:** `http://127.0.0.1:8000/users/api/CreateCoach/`
- **Content-Type:** application/json
- **Description:** Create a new coach.
- **Request Body:**
  ```json
  {
      "name": "Full name of the coach",
      "email": "Email address",
      "phone": "Phone number",
      "nat_id": "National ID",
      "address": "Address"
  }
  ```
- **Headers:**
  ```json
  {
      "Authorization": "Token [your_token_here]"
  }
  ```
- **Response Example:**
  ```json
  {
      "message": "Coach created successfully",
      "coach": {
          "name": "Jane Smith",
          "email": "jane.smith@example.com"
      }
  }
  ```

## 10. Re-Request Creation Message

- **Method:** POST
- **URL:** `http://127.0.0.1:8000/users/api/ReRequestCreationsMessage/`
- **Content-Type:** application/json
- **Description:** Re-request creation message for users who need to create an account.
- **Request Body:**
  ```json
  {
      "email": "Email address of the user"
  }
  ```
- **Headers:**
  ```json
  {
      "Authorization": "Token [your_token_here]"
  }
  ```
- **Response Example:**
  ```json
  {
      "Email": "john2.d3oe13@example.com",
      "message": "Mail sent successfully"
  }
 