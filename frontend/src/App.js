import React, { useState } from "react";
import RuleForm from "./components/RuleForm";
import CombineRulesForm from "./components/CombineRulesForm";
import EvaluateForm from "./components/EvaluateForm";
import Page from "./Page";
import "./App.css"; // Import the CSS file

function App() {
  const [isNightMode, setIsNightMode] = useState(false);

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  return (
    <div className="app">
      <div className={isNightMode ? "night-mode" : ""}>
        <button className="floating-button" onClick={toggleNightMode}>
          {isNightMode ? "☀️" : "🌙"}
        </button>
        <Page isNightMode={isNightMode} />
      </div>
    </div>
  );
}

export default App;
