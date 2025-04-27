import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { GroupContext } from "../contexts/GroupContext";
import SettleUpModal from "./modal/SettleUpModal";
import { AuthContext } from "../contexts/AuthContext";
import { useBalance } from "../contexts/BalanceContext";
import { fetchGroupBalances } from "../api/balanceApi";

const GroupMembersTable = () => {
  const { groupState } = useContext(GroupContext);
  const { selectedGroup } = groupState;
  const { userState } = useContext(AuthContext);
  const { user } = userState;
  const { balanceState, balanceDispatch } = useBalance();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false); // Toggle for auto-refresh
  const refreshTimerRef = useRef(null);
  const isLoadingRef = useRef(false); // To track if a load is in progress

  // Create a memoized callback for loadGroupBalances
  const loadGroupBalances = useCallback(async () => {
    // Prevent concurrent refreshes
    if (isLoadingRef.current || !selectedGroup?._id) return;

    try {
      // Mark as loading
      isLoadingRef.current = true;
      setLoading(true);

      // Clear any existing timeouts
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      await fetchGroupBalances(selectedGroup._id, balanceDispatch);
    } catch (error) {
      console.error("Failed to load balances:", error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false; // Reset loading flag
    }
  }, [selectedGroup, balanceDispatch]);

  // Set up a separate effect for automatic refreshing when modal is open
  useEffect(() => {
    // Only set up auto-refresh when modal is open AND auto-refresh is enabled
    if (showModal && selectedGroup?._id && autoRefreshEnabled) {
      // Clear any existing timer first
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      // Set up new timer
      refreshTimerRef.current = setTimeout(() => {
        if (!isLoadingRef.current) {
          loadGroupBalances();
        }
      }, 5000); // Refresh every 5 seconds instead of 3

      // Clean up timer on effect cleanup
      return () => {
        if (refreshTimerRef.current) {
          clearTimeout(refreshTimerRef.current);
          refreshTimerRef.current = null;
        }
      };
    }
  }, [
    showModal,
    loadGroupBalances,
    selectedGroup,
    isLoadingRef,
    autoRefreshEnabled,
  ]);

  // Load balances when the group changes
  useEffect(() => {
    if (selectedGroup?._id) {
      loadGroupBalances();
    }

    // Clean up on unmount or when dependencies change
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [selectedGroup, loadGroupBalances]);

  // Handle modal open and close
  const handleOpenModal = () => {
    setShowModal(true);
    // Disable auto-refresh by default when opening modal
    setAutoRefreshEnabled(false);
    // Force reload balances when modal opens
    loadGroupBalances();
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Disable auto-refresh when closing modal
    setAutoRefreshEnabled(false);

    // Clear any auto-refresh when modal is closed
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    // Refresh balances once after modal closes
    setTimeout(() => {
      loadGroupBalances();
    }, 500);
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled((prev) => !prev);
  };

  // Manual refresh - add debounce to prevent rapid clicking
  const handleManualRefresh = () => {
    if (!isLoadingRef.current) {
      loadGroupBalances();
    }
  };

  if (!selectedGroup) {
    return <p>No group selected.</p>;
  }

  if (loading && !balanceState.balances.length) {
    return <p>Loading balances...</p>;
  }

  // Get equal share amount
  const equalShare =
    balanceState.balances.length > 0 ? balanceState.balances[0].totalOwed : 0;

  return (
    <div className="mt-6 bg-gray-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Group Balances</h3>
        <div className="flex items-center">
          {equalShare > 0 && (
            <span className="mr-4 text-sm">
              Each member's share: <strong>{equalShare.toFixed(2)} €</strong>
            </span>
          )}
          {showModal && (
            <label className="mr-4 flex items-center text-sm">
              <input
                type="checkbox"
                checked={autoRefreshEnabled}
                onChange={toggleAutoRefresh}
                className="mr-2"
              />
              Auto-refresh
            </label>
          )}
          <button
            onClick={handleManualRefresh}
            className="text-sm bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Balances"}
          </button>
        </div>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-black font-semibold">
            <th className="p-2">Member</th>
            <th className="p-2">Total Contributed</th>
            <th className="p-2">Balance</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {balanceState.balances.map((balance) => {
            let balanceText = "Settled";
            if (balance.netBalance > 0) {
              balanceText = `Owed ${balance.netBalance.toFixed(2)} €`;
            } else if (balance.netBalance < 0) {
              balanceText = `Owes ${Math.abs(balance.netBalance).toFixed(2)} €`;
            }

            // Check if this is the current user
            const isCurrentUser = balance.userId === user._id;

            // Create a tooltip with detailed breakdown
            const detailsTooltip = `
              Expenses paid: ${(
                balance.totalContributed - (balance.paymentsMade || 0)
              ).toFixed(2)} €
              Payments made: ${(balance.paymentsMade || 0).toFixed(2)} €
              Payments received: ${(balance.paymentsReceived || 0).toFixed(2)} €
              Equal share: ${balance.totalOwed.toFixed(2)} €
            `;

            return (
              <tr key={balance.userId} className="border-t border-gray-300">
                <td className="p-2 font-medium">
                  {balance.memberName}{" "}
                  {isCurrentUser && (
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-1 py-0.5 rounded">
                      You
                    </span>
                  )}
                </td>
                <td className="p-2" title={detailsTooltip}>
                  <div className="flex flex-col">
                    <span>{balance.totalContributed.toFixed(2)} €</span>
                    <span className="text-xs text-gray-500">
                      (Expenses + Payments made)
                    </span>
                  </div>
                </td>
                <td
                  className={`p-2 ${balance.netBalance > 0
                      ? "text-green-600"
                      : balance.netBalance < 0
                        ? "text-red-600"
                        : ""
                    }`}
                >
                  {balanceText}
                </td>
                <td className="p-2">
                  {isCurrentUser && balance.netBalance < 0 && (
                    <button
                      className="bg-black text-white py-2 px-3 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-300"
                      onClick={handleOpenModal}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Pay Now"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && <SettleUpModal setShowModal={handleModalClose} />}
    </div>
  );
};

export default GroupMembersTable;
