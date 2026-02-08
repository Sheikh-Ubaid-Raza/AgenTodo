# Data Model: Frontend Interface & Full-Stack Integration

## Entities

### User
- **Description**: Represents an authenticated individual with email, password, and associated todos
- **Fields**:
  - id (UUID/string): Unique identifier for the user
  - email (string): User's email address (unique, validated)
  - created_at (datetime): Timestamp when the user account was created
  - updated_at (datetime): Timestamp when the user account was last updated
- **Validation Rules**:
  - Email must be valid format
  - Email must be unique
  - Required fields: id, email, created_at
- **Relationships**:
  - One-to-many with Todo entity (one user can have many todos)

### Todo
- **Description**: Represents a task item with title, description, completion status, creation date, and association to a specific user
- **Fields**:
  - id (UUID/string): Unique identifier for the todo
  - title (string): Title of the todo item (required)
  - description (string): Optional description of the todo item
  - completed (boolean): Status indicating if the todo is completed (default: false)
  - user_id (UUID/string): Foreign key linking to the user who owns this todo
  - created_at (datetime): Timestamp when the todo was created
  - updated_at (datetime): Timestamp when the todo was last updated
- **Validation Rules**:
  - Title must not be empty
  - user_id must reference an existing user
  - Required fields: id, title, user_id, completed, created_at
- **State Transitions**:
  - completed: false → true (when user marks as complete)
  - completed: true → false (when user unmarks as complete)
- **Relationships**:
  - Many-to-one with User entity (many todos belong to one user)

## API Data Transfer Objects (DTOs)

### User Registration Request
- email (string): User's email address
- password (string): User's password (min 8 characters)

### User Registration Response
- id (UUID/string): User's unique identifier
- email (string): User's email address
- created_at (datetime): Account creation timestamp

### Todo Creation Request
- title (string): Title of the todo item
- description (string, optional): Description of the todo item

### Todo Creation Response
- id (UUID/string): Todo's unique identifier
- title (string): Title of the todo item
- description (string): Description of the todo item
- completed (boolean): Completion status
- user_id (UUID/string): Owner user's identifier
- created_at (datetime): Creation timestamp
- updated_at (datetime): Last update timestamp

### Todo Update Request
- title (string, optional): Updated title of the todo item
- description (string, optional): Updated description of the todo item
- completed (boolean, optional): Updated completion status

### Todo List Response
- todos (array): Array of Todo objects