import React, { useEffect } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import EvaluateForm from "./components/EvaluateForm";
import RuleForm from "./components/RuleForm";
import AllRules from "./components/AllRules";
import CombineRulesForm from "./components/CombineRulesForm";
import Common from "./components/Common";
import "./App.css";

const HistoryOrders = () => {
  const navigate = useNavigate();

  useEffect(() => {
    alert("validAttributes = ['age', 'department', 'salary', 'experience']");
  }, []);

  return (
    <div className="mx-[50px]">
      <div className="dash">
        <h1 className="font-bold text-xl">DASHBOARD</h1>
      </div>
      <div
        className="w-full rounded-[65px] bg-slate-300 flex justify-between p-2 text-xl mt-4 gap-1"
        style={{ color: "black" }}
      >
        <NavLink
          to="built"
          className={({ isActive }) =>
            isActive
              ? "w-1/2 py-2 bg-slate-100 rounded-[65px] flex justify-center"
              : "w-1/2 px-2 py-2 hover:bg-slate-100 rounded-[65px] flex justify-center"
          }
        >
          Design
        </NavLink>
        <NavLink
          to="rules"
          className={({ isActive }) =>
            isActive
              ? "w-1/2 py-2 bg-slate-100 rounded-[65px] flex justify-center"
              : "w-1/2 px-2 py-2 hover:bg-slate-100 rounded-[65px] flex justify-center"
          }
        >
          Rules Details
        </NavLink>
      </div>
      <div className="mt-4">
        <Routes>
          <Route path="built" element={<Common />} />
          <Route path="rules" element={<AllRules />} />
        </Routes>
      </div>
    </div>
  );
};

export default HistoryOrders;
