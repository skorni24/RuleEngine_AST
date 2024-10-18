# Overview

Develop a simple 3-tier rule engine application to determine user eligibility based on attributes like age, department, income, and spend. The system uses Abstract Syntax Tree (AST) to represent conditional rules and allows for dynamic creation, combination, and modification of these rules.

Development Stack: The application is built using the MERN stack (MongoDB, Express, React, Node.js) due to its flexibility, scalability, and suitability for full-stack JavaScript development. The MERN stack allows seamless integration between the frontend and backend, ensuring a smoother development process and a more responsive user interface.

# Description:

On the home screen of the rule engine application, two main routes are available: one for viewing all stored rules and another for managing rules. The "View All Rules" route displays a list of all rules saved in the database, allowing users to select and view details of individual rules. The "Manage Rules" route provides functionality for creating, merging, and modifying rules. Users can create new rules with unique names, merge multiple rules into one to minimize redundancy, and modify existing rules by altering operators, operand values, or sub-expressions within the AST. The application includes error handling for invalid rule strings and data formats, such as missing operators or invalid comparisons, and validates attributes against a predefined catalog to ensure consistency. These features allow for comprehensive control over rule management, ensuring a robust and user-friendly experience.

# Data Structure:

```javascript
class Node {
  constructor(type, left = null, right = null, value = null) {
    this.type = type; // "operator" or "operand"
    this.left = left; // Reference to the left child Node
    this.right = right; // Reference to the right child Node
    this.value = value; // Value for operand nodes
  }
}
```

# Data Storage:

**MongoDB** was chosen for its flexible schema design and scalability, which is well-suited to handle the dynamic nature of rule changes and modifications in the application

```javascript
// Define the schema for the AST node
const NodeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  left: { type: mongoose.Schema.Types.Mixed, default: null },
  right: { type: mongoose.Schema.Types.Mixed, default: null },
  value: { type: String, default: null },
});

// Define the schema for the Rule
const RuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ruleAST: { type: NodeSchema, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the Rule model
const Rule = mongoose.model("Rule", RuleSchema);

module.exports = Rule;
```

# API Design:

In this rule engine application, each rule is stored in the database using a unique name. This name serves as the primary identifier for the rule, enabling easy access and modification. To prevent conflicts and ensure smooth operation, it is essential that each rule name be unique. The API includes an endpoint that allows users to retrieve a list of all rule names, providing a quick overview and aiding in the management of existing rules.

# Quickstart Guide

## Setup Instructions

By default, the MongoDB URI and port are present, so you do not need to add different values unless required.

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- MongoDB installed and running.
- Docker and Docker Compose installed (if you plan to use Docker).

### Dependencies

To set up and run the application, you will need the following dependencies:

- **Backend Dependencies** (specified in `backend/package.json`):

  - Express
  - Mongoose
  - dotenv

- **Frontend Dependencies** (specified in `frontend/package.json`):
  - React
  - Tailwind

### Step-by-Step Setup

#### 1. Clone the Repository

Clone the GitHub repository to your local machine using the following command:

```bash
git clone https://github.com/skorni24/RuleEngine_AST.git
cd RuleEngine_AST
```

### Backend Setup

1. **Navigate to the Backend Directory**

   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm i
   ```
3. **Start the Backend Server**
   ```bash
   node index.js
   ```

### Frontend Setup

1. **Navigate to the Backend Directory**

   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm i
   ```
3. **Start the Backend Server**
   ```bash
   npm start
   ```

# Access the Application

Once the setup is complete, access the application at:

Frontend: http://localhost:3000
Backend API: http://localhost:8000
