import React, { useState } from "react";

const RuleForm = () => {
  const [expression, setRuleString] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validAttributes = ["age", "department", "salary", "experience"];

  const isValidAttribute = (attribute) => {
    return validAttributes.includes(attribute);
  };

  const validateRuleString = (expression) => {
    const operators = ["&&", "||", ">", "<", ">=", "<=", "===", "!="];
    const pattern = new RegExp(`\\b(${operators.join("|")})\\b`);
    const attributePattern = new RegExp(
      `\\b(${validAttributes.join("|")})\\b`,
      "g"
    );

    // Check for missing operators or invalid comparisons
    if (!pattern.test(expression)) {
      return "Invalid or missing operators in the expression";
    }

    // Extract attributes and values from the expression
    const attributeValuePairs = expression.match(
      /(\w+)\s*(==|!=|>|>=|<|<=)\s*('[^']*'|\d+|\d*\.\d+)/g
    );

    if (attributeValuePairs) {
      for (let pair of attributeValuePairs) {
        const [attr] = pair.split(/==|!=|>|>=|<|<=/).map((part) => part.trim());
        if (!isValidAttribute(attr)) {
          return `Invalid attribute in expression: ${attr}`;
        }
      }
    } else {
      return "Invalid expression format";
    }

    return null;
  };

  const convertLogicalExpression = (expression) => {
    // Replace AND with &&
    let convertedExpression = expression.replace(/\bAND\b/g, "&&");
    // Replace OR with ||
    convertedExpression = convertedExpression.replace(/\bOR\b/g, "||");
    // Replace single = with ===
    convertedExpression = convertedExpression.replace(
      /([^=!<>])=([^=])/g,
      "$1===$2"
    );

    // Return the converted expression
    return convertedExpression;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!name || !expression) {
      setError("Name and expression are required");
      setSuccess(null);
      return;
    }

    const validationError = validateRuleString(expression);
    if (validationError) {
      console.log("error");
      setError(validationError);
      setSuccess(null);
      return;
    }

    const rule = {
      name: name,
      expression: convertLogicalExpression(expression),
    };

    try {
      const response = await fetch("http://localhost:8000/api/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rule),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Server responded with status ${response.status}`
        );
      }

      const data = await response.json();
      setSuccess("Rule created successfully");
      setError(null);
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Create a New Rule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rule Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rule Name"
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="expression"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rule String
          </label>
          <input
            id="expression"
            type="text"
            value={expression}
            onChange={(e) => setRuleString(e.target.value)}
            placeholder='{"age": 35, "department": "Sales", "salary": 60000, "experience": 3}'
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Rule
        </button>
        {error && (
          <div className="text-red-600 bg-red-100 border border-red-300 rounded-md p-2 mt-2">{`Error: ${error}`}</div>
        )}
        {success && (
          <div className="text-green-600 bg-green-100 border border-green-300 rounded-md p-2 mt-2">
            {success}
          </div>
        )}
      </form>
    </div>
  );
};

export default RuleForm;

//{"age": 35, "department": "Sales", "salary": 60000, "experience": 5}
