import React from "react";

const ExpenseList = ({ expenses }) => {
    return (
        <div className="my-8">
            <h2 className="font-semibold text-lg">Expense List</h2>
            <div className="border rounded-lg shadow-md">
                {expenses.length > 0 ? (
                    expenses.map((expense) => (
                        <div key={expense._id} className="flex justify-between p-4 border-b">
                            <span className="text-lg">{expense.title}</span>
                            <span className="font-bold text-lg">€{expense.amount.toFixed(2)}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-center p-4">No expenses found.</p>
                )}
            </div>
        </div>
    );
};

export default ExpenseList;
