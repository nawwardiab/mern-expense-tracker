import React from "react";

const GroupMembersTable = ({ members = [], totalAmount = 0 }) => {
    const amountPerMember = totalAmount && members.length
        ? (totalAmount / members.length).toFixed(2)
        : 0;

    return (
        <div className="mt-6 bg-gray-200 p-4 rounded-lg">
            <table className="w-full table-auto">
                <thead>
                    <tr className="text-left text-black font-semibold">
                        <th className="p-2">Members</th>
                        <th className="p-2">Expense Contribution</th>
                        <th className="p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member, index) => {
                        const name = typeof member.userId === "object" ? member.userId.fullName : "Member";
                        return (
                            <tr key={index} className="border-t border-gray-300">
                                <td className="p-2 font-medium">{name}</td>
                                <td className="p-2">{amountPerMember} €</td>
                                <td className="p-2 text-green-600">Pending</td> {/* TODO: Replace with real status */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default GroupMembersTable;
