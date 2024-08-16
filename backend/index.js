const express = require('express');
const bodyParser = require('body-parser');
const { connectDB, disconnectDB } = require('./db');
const Rule = require('./models/ruleparser');
const { parseLogicalExpression } = require('./utils/parser');

// Initialize Express
const app = express();
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json()); // To parse JSON bodies

// Connect to MongoDB when the server starts
connectDB();

// Route to handle rule creation
app.post('/api/rules', async (req, res) => {
    try {
        const { name, expression } = req.body;

        if (!name || !expression) {
            return res.status(400).json({ error: 'Name and expression are required' });
        }

        // Check if a rule with the same name already exists
        console.log(`Checking if a rule with the name "${name}" exists...`);
        const existingRule = await Rule.findOne({ name:  name  });

        if (existingRule) {
            console.log(`Rule with name "${name}" already exists.`);
            return res.status(400).json({ error: 'A rule with this name already exists' });
        }

        // Parse the input expression to AST
        console.log('Parsing expression:', expression);
        const ast = parseLogicalExpression(expression);

        // Create the rule object
        const rule = {
            name,
            ruleAST: ast
        };

        // Insert the rule into the database
        console.log('Inserting new rule into the database:', rule);
        const result = await Rule.create(rule);

        console.log('Rule created successfully:', result);
        return res.status(201).json({ message: 'Rule created successfully', rule: result });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/rules/evaluate', async (req, res) => {
    try {
        const { ruleId, data } = req.body;

        console.log(2,data,ruleId)
        const rule = await Rule.find({ name: ruleId });
        if (!rule) {
            return res.status(404).json({ error: 'Rule not found' });
        }

        const hardcodedData = {
            age: 32,
            salary: 5000,
            department: 'Marketing',
            experience: 4
        };
        const [ { ruleAST } ] = rule
        console.log(ruleAST)
        function transformAST(node) {
            if (node.type === 'operator') {
              // If the node is an operator, check its children
              const left = transformAST(node.left);
              const right = transformAST(node.right);
              
              // Combine the left and right nodes into a single operand if they are leaf nodes
              if (left.type === 'operand' && right.type === 'operand') {
                return {
                  type: 'operand',
                  value: `${left.value} ${node.value} ${right.value}`
                };
              }
          
              return {
                type: 'operator',
                value: node.value,
                left,
                right
              };
            } else if (node.type === 'operand') {
              // If it's an operand, return it as is
              return node;
            }
          }
          
          // Transform the database AST into the desired format
          const transformedAST = transformAST(ruleAST);
          
          console.log(transformedAST);
          
        // console.log(6,ruleAST);
        const result = await evaluate_rule(transformedAST, data);
        return res.status(200).json({ result });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/rules/find', async (req, res) => {
    try {
        // Fetch all rules from the database
        const rules = await Rule.find({});

        // Map through the rules to transform their AST to string
        const transformedRules = rules.map(rule => {
            // Extract the ruleAST from the rule
            const { ruleAST } = rule;

            // Function to transform AST to a string
            function astToString(node) {
                if (node.type === 'operator') {
                    // If the node is an operator, recursively transform its children
                    const left = astToString(node.left);
                    const right = astToString(node.right);
                    return `${left} ${node.value} ${right}`;
                } else if (node.type === 'operand') {
                    // If it's an operand, return its value
                    return node.value;
                }
            }

            // Convert the ruleAST to a string
            const ruleASTString = astToString(ruleAST);

            // Return the transformed rule
            return {
                name: rule.name,
                ruleASTString,
            };
        });

        // Respond with the transformed rules
        return res.status(200).json(transformedRules);
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/rules/updateByName', async (req, res) => {
    try {
        const { name, expression } = req.body;

        if (!name || !expression) {
            return res.status(400).json({ error: 'Name and expression are required' });
        }

        // Parse the input expression to AST
        const ast = parseLogicalExpression(expression);

        // Find the rule by name and update its ruleAST
        const updatedRule = await Rule.findOneAndUpdate(
            { name },
            { ruleAST: ast },
            { new: true } // Return the updated document
        );

        if (!updatedRule) {
            return res.status(404).json({ error: 'Rule not found' });
        }

        return res.status(200).json({ message: 'Rule updated successfully', rule: updatedRule });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/rules/merge', async (req, res) => {
    try {
        const { ruleIds, operator } = req.body;

        if (!ruleIds || ruleIds.length < 2 || !operator) {
            return res.status(400).json({ error: 'At least two rule names and an operator are required' });
        }
        //console.log(ruleIds)
        // Array to hold all found rules
        const foundRules = [];

        // Iterate over rule names and check if each exists in the database
        for (const ruleName of ruleIds) {
            const rule = await Rule.findOne({ name: ruleName });
            if (!rule) {
                return res.status(404).json({ error: `Rule with name "${ruleName}" not found` });
            }
            foundRules.push(rule);
        }
        //console.log(foundRules)

        // Normalize and combine the rule ASTs
        const asts = foundRules.map(rule => normalizeAST(rule.ruleAST));
        //console.log(asts)
        const combinedAST = combine_rules(asts, operator);
        const name = foundRules.join('-');
        const expression  = astToString(combinedAST);

        if (!name || !expression) {
            return res.status(400).json({ error: 'Name and expression are required' });
        }

        console.log(`Checking if a rule with the name "${name}" exists...`);
        const existingRule = await Rule.findOne({ name:  name  });

        if (existingRule) {
            console.log(`Rule with name "${name}" already exists.`);
            return res.status(400).json({ error: 'A rule with this name already exists' });
        }

        // Parse the input expression to AST
        console.log('Parsing expression:', expression);
        const ast = parseLogicalExpression(expression);

        // Create the rule object
        const rule = {
            name,
            ruleAST: ast
        };

        // Insert the rule into the database
        console.log('Inserting new rule into the database:', rule);
        const result = await Rule.create(rule);

        console.log('Rule created successfully:', result);
        return res.status(201).json({ message: 'Rule created successfully', rule: result });
        console.log(astToString(combinedAST))
        // Return the combined AST
        return res.status(200).json({ combinedAST: JSON.stringify(combinedAST, null, 2) });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


function evaluate_rule(ast, data) {
    if (ast.type === 'operator') {
        const leftValue = evaluate_rule(ast.left, data);
        const rightValue = evaluate_rule(ast.right, data);

        switch (ast.value) {
            case '&&':
            case 'AND':
                return leftValue && rightValue;
            case '||':
            case 'OR':
                return leftValue || rightValue;
            case '>':
                return leftValue > rightValue;
            case '<':
                return leftValue < rightValue;
            case '===':
                return leftValue === rightValue;
            default:
                throw new Error(`Unsupported operator: ${ast.value}`);
        }
    } else if (ast.type === 'operand') {
        // The operand value should be a string that represents a condition, e.g., "age > 30"
        const expression = ast.value;

        // Create a new function that correctly references the data properties
        const conditionFunction = new Function('data', `
            const { age, department, salary, experience } = data;
            return ${expression};
        `);

        // Evaluate the condition with the provided data
        return conditionFunction(data);
    } else {
        throw new Error(`Unsupported node type: ${ast.type}`);
    }
}
// Helper function to normalize AST nodes
function normalizeAST(node) {
    if (node.type === 'operator') {
        return {
            type: 'operator',
            value: node.value,
            left: normalizeAST(node.left),
            right: normalizeAST(node.right)
        };
    } else {
        return node;
    }
}

// Function to merge two AST nodes by eliminating redundancy
function mergeASTs(ast1, ast2) {
    if (JSON.stringify(ast1) === JSON.stringify(ast2)) {
        return ast1;
    }

    if (ast1.type === 'operator' && ast2.type === 'operator') {
        if (ast1.value === ast2.value &&
            JSON.stringify(ast1.left) === JSON.stringify(ast2.left) &&
            JSON.stringify(ast1.right) === JSON.stringify(ast2.right)) {
            return ast1;
        }

        if (ast1.value === ast2.value) {
            return {
                type: 'operator',
                value: ast1.value,
                left: mergeASTs(ast1.left, ast2.left),
                right: mergeASTs(ast1.right, ast2.right)
            };
        } else {
            return {
                type: 'operator',
                value: 'AND',
                left: ast1,
                right: ast2
            };
        }
    }

    return {
        type: 'operator',
        value: 'AND',
        left: ast1,
        right: ast2
    };
}

// Function to combine multiple rule ASTs into a single AST
function combine_rules(rulesASTs) {
    if (rulesASTs.length === 0) return null;
    if (rulesASTs.length === 1) return rulesASTs[0];

    let combinedAST = normalizeAST(rulesASTs[0]);

    for (let i = 1; i < rulesASTs.length; i++) {
        const normalizedAST = normalizeAST(rulesASTs[i]);
        combinedAST = mergeASTs(combinedAST, normalizedAST);
    }

    return combinedAST;
}

// Function to convert AST to a string expression
function astToString(ast) {
    if (ast.type === 'operand') {
        return ast.value;
    } else if (ast.type === 'operator') {
        const left = astToString(ast.left);
        const right = astToString(ast.right);
        return `(${left} ${ast.value} ${right})`;
    }
}



// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Disconnect from MongoDB when the server stops
process.on('SIGINT', () => {
    disconnectDB();
    process.exit(0);
});

function evaluate_rule(ast, data) {
    if (ast.type === 'operator') {
        const leftValue = evaluate_rule(ast.left, data);
        const rightValue = evaluate_rule(ast.right, data);
        
        switch (ast.value) {
            case '&&':
                return leftValue && rightValue;
            case '||':
                return leftValue || rightValue;
            default:
                throw new Error(`Unsupported operator: ${ast.value}`);
        }
    } else if (ast.type === 'operand') {
        // The operand value should be a string that represents a condition, e.g., "age > 30"
        const expression = ast.value;

        // Create a new function that correctly references the data properties
        const conditionFunction = new Function('data', `
            const { age, department, salary, experience } = data;
            return ${expression};
        `);

        // Evaluate the condition with the provided data
        return conditionFunction(data);
    } else {
        throw new Error(`Unsupported node type: ${ast.type}`);
    }
}
