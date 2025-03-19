import React from "react";

const ExpenseList = ({ expenses }) => {
    return (
        <div className="mt-10 w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Expense List</h2>

            {/* List */}
            <div className="border rounded-xl shadow-lg overflow-hidden bg-white">
                <table className="w-full text-left border-collapse">
                    {/* Table Header */}
                    <thead className="bg-gray-100 border-b-2 border-gray-300">
                        <tr className="text-gray-600 uppercase text-sm tracking-wider">
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3 text-center">Category</th>
                            <th className="px-6 py-3 text-right">Date</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {expenses.length > 0 ? (
                            expenses.map((expense) => (
                                <tr
                                    key={expense._id}
                                    className="border-t text-gray-800 hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4">{expense.title}</td>
                                    <td className="px-6 py-4 font-bold text-green-600">
                                        €{expense.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {new Date(expense.transactionDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-6 text-gray-500">
                                    No expenses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseList;
