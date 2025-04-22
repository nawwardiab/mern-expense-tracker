import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { FaTimes } from "react-icons/fa";
import { GroupContext } from "../../contexts/GroupContext";
import { createPayment } from "../../api/paymentApi";
import { useBalance } from "../../contexts/BalanceContext";
import {
  updateBalanceAfterPayment,
  fetchGroupBalances,
} from "../../api/balanceApi";

const SettleUpModal = ({ setShowModal }) => {
  const { userState } = useContext(AuthContext);
  const { user } = userState;
  const { groupState, groupDispatch } = useContext(GroupContext);
  const { selectedGroup } = groupState;
  const { balanceState, balanceDispatch } = useBalance();

  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [refreshingBalances, setRefreshingBalances] = useState(true);

  // Form data
  const [formData, setFormData] = useState({
    amount: 0,
    payeeName: "",
    payeeId: "",
    payerName: user.fullName,
    paymentMethod: "cash",
    currency: "EUR",
    notes: "",
  });

  // First, fetch the latest balances when the modal opens
  useEffect(() => {
    const refreshBalances = async () => {
      try {
        setRefreshingBalances(true);
        await fetchGroupBalances(selectedGroup._id, balanceDispatch);
      } catch (error) {
        console.error("Failed to refresh balances:", error);
      } finally {
        setRefreshingBalances(false);
      }
    };

    refreshBalances();
  }, [selectedGroup._id, balanceDispatch]);

  // Then, update the members list with the latest balance data
  useEffect(() => {
    if (
      selectedGroup &&
      selectedGroup.members &&
      balanceState.balances.length > 0 &&
      !refreshingBalances
    ) {
      console.log(
        "Updating members list with latest balances:",
        balanceState.balances
      );

      // Filter to show only members who are owed money (positive balance)
      const positiveBalanceMembers = balanceState.balances.filter(
        (balance) => balance.netBalance > 0 && balance.userId !== user._id
      );

      // Map to the format needed by the dropdown
      const membersForDropdown = positiveBalanceMembers.map((balance) => {
        const member = selectedGroup.members.find(
          (m) => m.groupMember._id === balance.userId
        );

        return {
          userId: balance.userId,
          name: balance.memberName,
          netBalance: balance.netBalance,
        };
      });

      setMembers(membersForDropdown);

      // If we have a selected payee, update their balance info
      if (formData.payeeId) {
        const updatedPayee = membersForDropdown.find(
          (m) => m.userId === formData.payeeId
        );
        if (updatedPayee) {
          setFormData((prev) => ({
            ...prev,
            // Only update the amount if it matches the previous balance exactly
            // This prevents overwriting custom amounts
            amount:
              prev.amount === prev.previousBalance
                ? updatedPayee.netBalance
                : prev.amount,
            previousBalance: updatedPayee.netBalance,
          }));
        }
      }
    }
  }, [
    selectedGroup,
    balanceState.balances,
    user._id,
    formData.payeeId,
    refreshingBalances,
  ]);

  const handleChange = (e) => {
    const value =
      e.target.name === "amount"
        ? parseFloat(e.target.value) || 0
        : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handlePayeeSelect = (e) => {
    const payeeId = e.target.value;
    const payee = members.find((m) => m.userId === payeeId);

    if (payee) {
      setFormData((prev) => ({
        ...prev,
        payeeId,
        payeeName: payee.name,
        // Suggest the amount they owe (but let them modify)
        amount: payee.netBalance > 0 ? payee.netBalance : prev.amount,
        previousBalance: payee.netBalance, // Store this to compare later
      }));
    }
  };

  const handleConfirmPay = async () => {
    if (!formData.payeeId || formData.amount <= 0) {
      alert("Please select a recipient and enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      console.log("Payment data:", {
        groupId: selectedGroup._id,
        payer: user._id,
        payee: formData.payeeId,
        amount: formData.amount,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      });

      const paymentData = {
        groupId: selectedGroup._id,
        payer: user._id,
        payee: formData.payeeId,
        amount: formData.amount,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      // Save the payment to the database - add groupDispatch as second parameter
      console.log("Calling createPayment with groupDispatch:", !!groupDispatch);
      const response = await createPayment(paymentData, groupDispatch);
      console.log("Payment response:", response);

      // Update the local balance state for both payer and payee
      console.log("Updating balance after payment:", {
        payerId: user._id,
        payeeId: formData.payeeId,
        amount: formData.amount,
      });

      updateBalanceAfterPayment(balanceDispatch, {
        payerId: user._id,
        payeeId: formData.payeeId,
        amount: formData.amount,
      });

      // Success message and close modal
      alert("Payment successful!");

      // Refresh balance data after payment
      try {
        await fetchGroupBalances(selectedGroup._id, balanceDispatch);
      } catch (error) {
        console.error("Failed to refresh balances:", error);
      }

      // Use the setShowModal prop to close the modal (passed from parent)
      setShowModal(false);
    } catch (error) {
      console.error("Payment failed:", error);

      // More detailed error information
      if (error.response) {
        console.error("Server response:", error.response.data);
        alert(
          `Payment failed: ${error.response.data.message || "Server error"}`
        );
      } else if (error.request) {
        console.error("No response from server");
        alert("Payment failed: No response from server");
      } else {
        alert(`Payment failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-xl"
          onClick={() => setShowModal(false)}
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-4">Settle Up</h2>

        <div className="mb-4 bg-gray-100 p-3 rounded-lg">
          <p className="font-medium">
            <span className="text-blue-600">{formData.payerName}</span> is
            paying
            <span className="text-green-600">
              {" "}
              {formData.payeeName || "Select recipient"}
            </span>
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Pay To:</label>
            <select
              name="payeeId"
              value={formData.payeeId}
              onChange={handlePayeeSelect}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select recipient</option>
              {members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.name} (Owed: {member.netBalance.toFixed(2)} €)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Amount to Pay:
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Payment Method:
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Notes:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any details about this payment"
              className="w-full border p-2 rounded"
              rows="3"
            />
          </div>

          <button
            type="button"
            onClick={handleConfirmPay}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettleUpModal;
