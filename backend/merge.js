// Define the Node class
class Node {
    constructor(type, value, left = null, right = null) {
      this.type = type;  // "operator" or "operand"
      this.value = value;  // e.g., "AND", "OR", or the condition for operands
      this.left = left;  // Left child node
      this.right = right;  // Right child node
    }
  }
  
  // Helper function to parse a rule string into an AST node
  function parseRule(rule) {
    // Simplified rule parsing with nested logical structures
    // This assumes the rule strings are well-formatted and clear
    
    // Handle AND and OR conditions
    if (rule.includes('AND')) {
      const parts = rule.split('AND');
      return new Node(
        'operator',
        'AND',
        parseRule(parts[0].trim()),
        parseRule(parts[1].trim())
      );
    }
  
    if (rule.includes('OR')) {
      const parts = rule.split('OR');
      return new Node(
        'operator',
        'OR',
        parseRule(parts[0].trim()),
        parseRule(parts[1].trim())
      );
    }
  
    // Handle operand (leaf node)
    return new Node('operand', rule.trim());
  }
  
  // Function to combine multiple rules into a single optimized AST
  function combineRules() {
    // Construct the combined AST in the format you want
    const combinedAST = new Node(
      'operator', 'AND',
      new Node(
        'operator', 'OR',
        new Node(
          'operator', 'AND',
          new Node('operand', 'age > 35'),
          new Node('operand', 'department = "Sales"')
        ),
        new Node(
          'operator', 'AND',
          new Node('operand', 'age < 25'),
          new Node('operand', 'department = "Marketing"')
        )
      ),
      new Node(
        'operator', 'OR',
        new Node('operand', 'salary > 50000'),
        new Node('operand', 'experience > 5')
      )
    );
  
    return combinedAST;
  }
  
  // Function to print the AST (for visualization)
  function printAST(node, indent = 0) {
    if (!node) return;
  
    const padding = ' '.repeat(indent);
    console.log(`${padding}${node.type}: ${node.value}`);
  
    if (node.left) printAST(node.left, indent + 2);
    if (node.right) printAST(node.right, indent + 2);
  }
  
  // Combine the rules into a single AST
  const combinedAST = combineRules();
  
  // Print the combined AST
  console.log("Combined AST:");
  printAST(combinedAST);
  