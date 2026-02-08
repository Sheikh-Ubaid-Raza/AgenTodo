# API Contract: MCP Tools for Task Management

## Tool: add_task

### Description
Create a new task for the user.

### Parameters
```json
{
  "user_id": "string (required)",
  "title": "string (required)",
  "description": "string (optional)"
}
```

### Returns
```json
{
  "task_id": "integer",
  "status": "string ('created')",
  "title": "string"
}
```

### Example Input
```json
{
  "user_id": "ziakhan",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

### Example Output
```json
{
  "task_id": 5,
  "status": "created",
  "title": "Buy groceries"
}
```

---

## Tool: list_tasks

### Description
Retrieve tasks from the list with optional filtering.

### Parameters
```json
{
  "user_id": "string (required)",
  "status": "string (optional, enum: 'all', 'pending', 'completed')"
}
```

### Returns
```json
{
  "tasks": [
    {
      "id": "integer",
      "title": "string",
      "completed": "boolean"
    }
  ]
}
```

### Example Input
```json
{
  "user_id": "ziakhan",
  "status": "pending"
}
```

### Example Output
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "completed": false
  },
  {
    "id": 2,
    "title": "Walk the dog",
    "completed": false
  }
]
```

---

## Tool: complete_task

### Description
Mark a task as complete.

### Parameters
```json
{
  "user_id": "string (required)",
  "task_id": "integer (required)"
}
```

### Returns
```json
{
  "task_id": "integer",
  "status": "string ('completed')",
  "title": "string"
}
```

### Example Input
```json
{
  "user_id": "ziakhan",
  "task_id": 3
}
```

### Example Output
```json
{
  "task_id": 3,
  "status": "completed",
  "title": "Call mom"
}
```

---

## Tool: delete_task

### Description
Remove a task from the list.

### Parameters
```json
{
  "user_id": "string (required)",
  "task_id": "integer (required)"
}
```

### Returns
```json
{
  "task_id": "integer",
  "status": "string ('deleted')",
  "title": "string"
}
```

### Example Input
```json
{
  "user_id": "ziakhan",
  "task_id": 2
}
```

### Example Output
```json
{
  "task_id": 2,
  "status": "deleted",
  "title": "Old task"
}
```

---

## Tool: update_task

### Description
Modify task title or description.

### Parameters
```json
{
  "user_id": "string (required)",
  "task_id": "integer (required)",
  "title": "string (optional)",
  "description": "string (optional)"
}
```

### Returns
```json
{
  "task_id": "integer",
  "status": "string ('updated')",
  "title": "string"
}
```

### Example Input
```json
{
  "user_id": "ziakhan",
  "task_id": 1,
  "title": "Buy groceries and fruits"
}
```

### Example Output
```json
{
  "task_id": 1,
  "status": "updated",
  "title": "Buy groceries and fruits"
}
```