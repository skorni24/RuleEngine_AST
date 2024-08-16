{
  function createNode(type, value, children) {
    return { type, value, children };
  }
}

Expression
  = OrExpression

OrExpression
  = left:AndExpression "OR" right:AndExpression
    { return createNode("Or", "OR", [left, right]); }
  / AndExpression

AndExpression
  = left:Comparison "AND" right:Comparison
    { return createNode("And", "AND", [left, right]); }
  / Comparison

Comparison
  = "(" expr:Expression ")" { return expr; }
  / left:Operand op:(">" / "<" / "=") right:Operand
    { return createNode("Comparison", op, [left, right]); }

Operand
  = number:[0-9]+ { return createNode("Number", parseInt(number.join(""), 10)); }
  / quotedString:("'" [^']* "'") { return createNode("String", quotedString.slice(1, -1)); }
  / identifier:[a-zA-Z_][a-zA-Z_0-9]* { return createNode("Identifier", identifier.join("")); }

WS
  = [ \t\n\r]*
