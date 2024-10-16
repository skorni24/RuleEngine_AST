const mongoose = require('mongoose');

// Define the schema for the AST node
const NodeSchema = new mongoose.Schema({
    type: { type: String, required: true },
    left: { type: mongoose.Schema.Types.Mixed, default: null },
    right: { type: mongoose.Schema.Types.Mixed, default: null },
    value: { type: String, default: null }
});

// Define the schema for the Rule
const RuleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ruleAST: { type: NodeSchema, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create the Rule model
const Rule = mongoose.model('Rule', RuleSchema);

module.exports = Rule;
