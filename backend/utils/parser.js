const esprima = require('esprima');

// Helper function to wrap expression as a JavaScript function
function wrapExpression(expression) {
    return `function parseExpression() { return ${expression}; }`;
}

// Function to parse logical expressions using Esprima
function parseLogicalExpression(expression) {
    const wrappedExpression = wrapExpression(expression);
    const ast = esprima.parseScript(wrappedExpression, { tolerant: true });

    // Extract the relevant part of the AST
    const functionBody = ast.body[0].body;
    const returnStatement = functionBody.body[0].argument;

    return transformToCustomAST(returnStatement);
}

// Transform Esprima AST to custom AST format with nested operators
function transformToCustomAST(node) {
    if (node.type === 'LogicalExpression' || node.type === 'BinaryExpression') {
        return {
            type: 'operator',
            value: node.operator,
            left: transformToCustomAST(node.left),
            right: transformToCustomAST(node.right)
        };
    } else if (node.type === 'Identifier' || node.type === 'Literal') {
        let value = '';
        if (node.type === 'Identifier') {
            value = node.name;
        } else if (node.type === 'Literal') {
            value = node.raw || node.value;
        }
        return {
            type: 'operand',
            value: value
        };
    } else if (node.type === 'BinaryExpression') {
        return {
            type: 'operator',
            value: node.operator,
            left: transformToCustomAST(node.left),
            right: transformToCustomAST(node.right)
        };
    } else {
        throw new Error(`Unsupported node type: ${node.type}`);
    }
}

module.exports = { parseLogicalExpression };
