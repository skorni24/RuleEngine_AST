function evaluateRule(ast, data) {
    if (ast.type === 'operator') {
        const leftValue = evaluateRule(ast.left, data);
        const rightValue = evaluateRule(ast.right, data);
        
        console.log('Evaluating:', leftValue, ast.value, rightValue);

        switch (ast.value) {
            case '&&':
                return leftValue && rightValue;
            case '||':
                return leftValue || rightValue;
            default:
                throw new Error(`Unsupported operator: ${ast.value}`);
        }
    } else if (ast.type === 'operand') {
        const expression = ast.value;
        
        console.log('Evaluating operand:', expression);

        const conditionFunction = new Function('data', `
            const { age, department, salary, experience } = data;
            return ${expression};
        `);

        const result = conditionFunction(data);

        console.log('Operand result:', result);

        return result;
    } else {
        throw new Error(`Unsupported node type: ${ast.type}`);
    }
}
