const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
    type: String, // "operator" or "operand"
    value: String, // Value (e.g., "age > 30")
    left: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' }, // Left child reference
    right: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' } // Right child reference
});

const Node = mongoose.model('Node', nodeSchema);
module.exports = Node;
