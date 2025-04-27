import React, { useContext, useMemo } from "react";
import { GroupContext } from "../contexts/GroupContext";
import { AuthContext } from "../contexts/AuthContext";
import { PaymentContext } from "../contexts/PaymentContext";
import { formatAmount } from "../utils/format";
import { FaArrowRight } from "react-icons/fa";

const GroupSummaryCard = () => {
  const { groupState } = useContext(GroupContext);
  const { userState } = useContext(AuthContext);
  const { paymentState } = useContext(PaymentContext);
  const { groups } = groupState;
  const { user } = userState;
  const { payments } = paymentState;

  // Calculate group statistics
  const stats = useMemo(() => {
    if (!groups || !user)
      return {
        totalGroups: 0,
        asCreator: 0,
        asMember: 0,
        totalExpenses: 0,
        totalPaymentsMade: 0,
        totalPaymentsReceived: 0,
      };

    const totalGroups = groups.length;
    const asCreator = groups.filter(
      (group) =>
        group.createdBy === user._id ||
        (group.createdBy && group.createdBy._id === user._id)
    ).length;
    const asMember = totalGroups - asCreator;

    // Calculate total expenses across all groups
    const totalExpenses = groups.reduce((sum, group) => {
      return sum + (group.totalAmount || 0);
    }, 0);

    // Calculate payments related to groups (if payments data is available)
    let totalPaymentsMade = 0;
    let totalPaymentsReceived = 0;

    if (payments && payments.length > 0) {
      // Filter payments where user is payer (outgoing)
      const outgoingPayments = payments.filter((payment) => {
        const payerId =
          typeof payment.payer === "object"
            ? payment.payer?._id
            : payment.payer;
        return payerId === user._id;
      });

      // Filter payments where user is payee (incoming)
      const incomingPayments = payments.filter((payment) => {
        const payeeId =
          typeof payment.payee === "object"
            ? payment.payee?._id
            : payment.payee;
        return payeeId === user._id;
      });

      totalPaymentsMade = outgoingPayments.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      );
      totalPaymentsReceived = incomingPayments.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      );
    }

    return {
      totalGroups,
      asCreator,
      asMember,
      totalExpenses,
      totalPaymentsMade,
      totalPaymentsReceived,
    };
  }, [groups, user, payments]);

  return (
    <div className="bg-gray-200 rounded-xl p-4">

      <p className="text-sm font-medium mb-1">Group Activity</p>
      <div className="flex justify-between mb-3">
        <p className="text-2xl font-bold text-blue-600">
          €{formatAmount(stats.totalExpenses)}
        </p>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Group Payments</p>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-500 mr-2">
                Paid:
              </span>
              <span className="text-sm font-medium text-red-500">
                €{formatAmount(stats.totalPaymentsMade)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-500 mr-2">
                Received:
              </span>
              <span className="text-sm font-medium text-green-500">
                €{formatAmount(stats.totalPaymentsReceived)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm font-medium mb-1">Group Expenses</p>
      <p className="text-2xl font-bold text-indigo-600 mb-2">
       €{formatAmount(stats.totalExpenses)}
      </p>


      <div className="flex justify-between mt-3 text-sm">
        <div>
          <p className="text-gray-600">Total Groups</p>
          <p className="text-lg font-semibold">{stats.totalGroups}</p>
        </div>

        <div className="flex gap-4">
          <div>
            <p className="text-gray-600">As Creator</p>
            <p className="text-lg font-semibold">{stats.asCreator}</p>
          </div>

          <div>
            <p className="text-gray-600">As Member</p>
            <p className="text-lg font-semibold">{stats.asMember}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSummaryCard;
