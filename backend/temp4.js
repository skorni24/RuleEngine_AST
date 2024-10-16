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

    // Merge based on common structure but prioritize reducing duplication
    if (ast1.type === 'operator' && ast2.type === 'operator') {
        if (ast1.value === ast2.value) {
            return {
                type: 'operator',
                value: ast1.value,
                left: mergeASTs(ast1.left, ast2.left),
                right: mergeASTs(ast1.right, ast2.right)
            };
        }
    }

    // Return a combination of the two trees with an AND operation for merging rules
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

// Define the rule ASTs
const rule1AST = {
    type: 'operator',
    value: 'AND',
    left: {
        type: 'operator',
        value: 'OR',
        left: {
            type: 'operator',
            value: 'AND',
            left: {
                type: 'operator',
                value: '>',
                left: { type: 'operand', value: 'age' },
                right: { type: 'operand', value: '30' }
            },
            right: {
                type: 'operator',
                value: '===',
                left: { type: 'operand', value: 'department' },
                right: { type: 'operand', value: "'Sales'" }
            }
        },
        right: {
            type: 'operator',
            value: 'AND',
            left: {
                type: 'operator',
                value: '<',
                left: { type: 'operand', value: 'age' },
                right: { type: 'operand', value: '25' }
            },
            right: {
                type: 'operator',
                value: '===',
                left: { type: 'operand', value: 'department' },
                right: { type: 'operand', value: "'Marketing'" }
            }
        }
    },
    right: {
        type: 'operator',
        value: 'OR',
        left: {
            type: 'operator',
            value: '>',
            left: { type: 'operand', value: 'salary' },
            right: { type: 'operand', value: '50000' }
        },
        right: {
            type: 'operator',
            value: '>',
            left: { type: 'operand', value: 'experience' },
            right: { type: 'operand', value: '5' }
        }
    }
};

const rule2AST = {
    type: 'operator',
    value: 'AND',
    left: {
        type: 'operator',
        value: 'AND',
        left: {
            type: 'operator',
            value: '>',
            left: { type: 'operand', value: 'age' },
            right: { type: 'operand', value: '30' }
        },
        right: {
            type: 'operator',
            value: '===',
            left: { type: 'operand', value: 'department' },
            right: { type: 'operand', value: "'Marketing'" }
        }
    },
    right: {
        type: 'operator',
        value: 'OR',
        left: {
            type: 'operator',
            value: '>',
            left: { type: 'operand', value: 'salary' },
            right: { type: 'operand', value: '20000' }
        },
        right: {
            type: 'operator',
            value: '>',
            left: { type: 'operand', value: 'experience' },
            right: { type: 'operand', value: '5' }
        }
    }
};

// Combine the rule ASTs
const combinedAST = combine_rules([rule1AST, rule2AST]);

// Convert the combined AST to a string expression
const combinedExpression = astToString(combinedAST);

// Output the combined AST and the resulting expression
console.log('Combined AST:', JSON.stringify(combinedAST, null, 2));
console.log('Combined Expression:', combinedExpression);
