import { useEffect, useState } from 'react';

function RuleList() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRule, setEditingRule] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        fetch('http://localhost:8000/api/rules/find')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setRules(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleEditClick = (rule) => {
        setEditingRule(rule);
        setEditValue(rule.ruleASTString); // Set initial value for editing
    };

    const handleSaveClick = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/rules/updateByName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: editingRule.name, // Use the rule name to identify the rule
                    expression: editValue, // Send the updated expression
                }),
            });
    
            if (!response.ok) {
                const errorText = await response.text(); // Read response text for debugging
                throw new Error(`Network response was not ok: ${errorText}`);
            }
    
            // Update the local state with the new value
            const updatedRule = await response.json();
            setRules(rules.map(rule => 
                rule.name === editingRule.name ? { ...rule, ruleASTString: editValue } : rule
            ));
    
            setEditingRule(null); // Close the edit mode
        } catch (error) {
            console.error('Error:', error); // Log detailed error
            setError(error);
        }
    };
    
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] py-2 mt-5 gap-6 md:gap-8 h-[calc(100vh-190px)] px-[19px] overflow-y-scroll' 
             data-aos="flip-down">
            {rules.map((rule, index) => (
                <div key={index} className='bg-slate-200 p-4 rounded-2xl customShadow1 flex'>
                    <div className='w-2/3 pl-4'>
                        <h3 className='font-bold text-lg'>{rule.name}</h3>
                        {editingRule?.name === rule.name ? (
                            <div>
                                <textarea
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    rows='4'
                                    className='w-full border rounded p-2'
                                />
                                <button
                                    onClick={handleSaveClick}
                                    className='mt-2 bg-blue-500 text-white px-4 py-2 rounded'
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className='mt-2 text-sm'>{rule.ruleASTString}</p>
                                <button
                                    onClick={() => handleEditClick(rule)}
                                    className='mt-2 bg-yellow-500 text-white px-4 py-2 rounded'
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RuleList;
