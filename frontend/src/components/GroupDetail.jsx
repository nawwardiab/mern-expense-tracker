import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseTable from "./ExpenseTable";

const GroupDetail = ({ group }) => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, [group]);

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get(`/groups/${group._id}/expenses`, {
        withCredentials: true,
      });
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{group.name}</h1>
      <p className="text-gray-600">{group.description}</p>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Expenses</h2>
        <ExpenseTable expenses={expenses} />
      </div>
    </div>
  );
};

export default GroupDetail;
