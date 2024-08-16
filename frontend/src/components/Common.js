import React from 'react'
import RuleForm from './RuleForm'
import CombineRulesForm from './CombineRulesForm'
import EvaluateForm from './EvaluateForm'

const Common = () => {
  return (
    <div className="flex flex-wrap justify-between gap-4 p-4">
            <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow-lg p-4">
                <RuleForm />
            </div>
            <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow-lg p-4">
                <CombineRulesForm />
            </div>
            <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow-lg p-4">
                <EvaluateForm />
            </div>
        </div>
  )
}

export default Common