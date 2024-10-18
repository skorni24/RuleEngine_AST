import React, { useState } from "react";

const EvaluateForm = () => {
  const [data, setData] = useState(""); // To hold the JSON data input
  const [ruleId, setRuleId] = useState(""); // To hold the Rule ID input

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Parse the input data as JSON
      const jsonData = JSON.parse(data);

      // Send the POST request to the backend
      const response = await fetch("http://localhost:8000/api/rules/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ruleId: ruleId, data: jsonData }),
      });

      // Get the JSON response from the server
      const result = await response.json();

      // Log the result to the console and show an alert with the evaluation result
      console.log(result);
      alert(`Evaluation result: ${result.result}`);
    } catch (error) {
      console.error("Error:", error);
      alert(
        "There was an error with the submission. Please check the data and try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Evaluate Rule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="ruleId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rule ID
          </label>
          <input
            id="ruleId"
            type="text"
            value={ruleId}
            onChange={(e) => setRuleId(e.target.value)}
            placeholder="Enter Rule ID"
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="data"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            JSON Data
          </label>
          <textarea
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder='{"age": 35, "department": "Sales", "salary": 60000, "experience": 3}'
            rows="4"
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Evaluate Rule
        </button>
      </form>
    </div>
  );
};

export default EvaluateForm;
