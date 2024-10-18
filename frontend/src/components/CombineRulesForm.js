import React, { useState } from "react";
import "../App.css";

const CombineRulesForm = () => {
  const [ruleIds, setRuleIds] = useState([]);
  const [operator, setOperator] = useState("AND");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert operator from "AND"/"OR" to "&&"/"||"
    const logicalOperator = operator === "AND" ? "&&" : "||";

    const response = await fetch("http://localhost:8000/api/rules/merge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ruleIds, operator: logicalOperator }),
    });

    const data = await response.json();
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Combine Two or More Rules</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="ruleIds"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rule IDs (comma-separated)
          </label>
          <input
            id="ruleIds"
            type="text"
            value={ruleIds.join(",")}
            onChange={(e) => setRuleIds(e.target.value.split(","))}
            placeholder="Rule IDs (comma-separated)"
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="operator"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Operator
          </label>
          <select
            id="operator"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Combine Rules
        </button>
      </form>
    </div>
  );
};

export default CombineRulesForm;
