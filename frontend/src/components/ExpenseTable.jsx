import React, { useState, useEffect } from "react";
import axios from "axios";

const ExpenseTable = ({ groupId }) => {
    const [expenses, setExpenses] = useState([]); // Initialize with an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!groupId) return; // Prevent fetching if groupId is not available

        const fetchExpenses = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`/groups/${groupId}/expenses`, {
                    withCredentials: true,
                });
                setExpenses(data || []); // Ensure expenses is always an array
            } catch (err) {
                console.error("Error fetching expenses:", err);
                setError("Failed to load expenses.");
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [groupId]);

    if (loading) return <p className="text-center text-gray-500">Loading expenses...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Expense List</h2>
            {expenses.length === 0 ? (
                <p className="text-center text-gray-500">No expenses recorded yet.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense._id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{expense.title}</td>
                                <td className="border border-gray-300 px-4 py-2">€{expense.amount.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2">{new Date(expense.transactionDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExpenseTable;
