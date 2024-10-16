const express = require('express');
const Node = require('../models/Node');
const Rule = require('../models/Rule');

const router = express.Router();

// Parse the rule string and create an AST
function parseRuleString(ruleString) {
    // Placeholder: implement a proper parser
    // Simplified: Return a single operand node for demonstration
    return new Node({ type: 'operand', value: ruleString });
}

// Save AST recursively
async function saveAST(node) {
    if (!node) return null;
    const nodeDoc = new Node(node);
    await nodeDoc.save();
    node._id = nodeDoc._id;

    if (node.left) node.left = await saveAST(node.left);
    if (node.right) node.right = await saveAST(node.right);

    return node._id;
}

// Create Rule API
router.post('/create', async (req, res) => {
    const { ruleString, name } = req.body;
    const rootNode = parseRuleString(ruleString);
    const rootId = await saveAST(rootNode);

    const rule = new Rule({ name, root: rootId });
    await rule.save();

    res.json({ message: 'Rule created successfully', rule });
});

// Combine Rules API
router.post('/combine', async (req, res) => {
    const { ruleIds, operator } = req.body;

    const rules = await Rule.find({ _id: { $in: ruleIds } }).populate('root');
    const combinedRoot = new Node({ type: 'operator', value: operator });
    combinedRoot.left = rules[0].root;
    combinedRoot.right = rules[1].root;

    const rootId = await saveAST(combinedRoot);
    const combinedRule = new Rule({ name: 'Combined Rule', root: rootId });
    await combinedRule.save();

    res.json({ message: 'Rules combined successfully', rule: combinedRule });
});

// Evaluate Rule API
router.post('/evaluate', async (req, res) => {
    const { ruleId, data } = req.body;
    const rule = await Rule.findById(ruleId).populate('root');

    function evaluateAST(node, data) {
        if (node.type === 'operand') {
            // Simple evaluation logic
            const [key, operator, value] = node.value.split(' ');
            return eval(`${data[key]} ${operator} ${value}`);
        } else if (node.type === 'operator') {
            const leftResult = evaluateAST(node.left, data);
            const rightResult = evaluateAST(node.right, data);
            return node.value === 'AND' ? leftResult && rightResult : leftResult || rightResult;
        }
    }

    const result = evaluateAST(rule.root, data);
    res.json({ result });
});

module.exports = router;
