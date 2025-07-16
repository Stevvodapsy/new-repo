import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      // Get users
      const userSnap = await getDocs(collection(db, "users"));
      setUserCount(userSnap.size);
      // Get transactions
      let allTransactions = [];
      userSnap.forEach((doc) => {
        const data = doc.data();
        if (Array.isArray(data.transactions)) {
          allTransactions = allTransactions.concat(
            data.transactions.map((t) => ({ ...t, user: data.name }))
          );
        }
      });
      setTransactions(allTransactions);
      setTransactionCount(allTransactions.length);
      setLoading(false);
    }
    fetchStats();
  }, []);

  const completed = transactions.filter((t) => t.status === "completed").length;
  const inProgress = transactions.filter(
    (t) => t.status === "in progress"
  ).length;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      {loading ? (
        <div>Loading stats...</div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div className="bg-neutral-100 p-6 rounded shadow text-center">
              <div className="text-4xl font-bold text-primary">{userCount}</div>
              <div className="text-lg">Total Users</div>
            </div>
            <div className="bg-neutral-100 p-6 rounded shadow text-center">
              <div className="text-4xl font-bold text-secondary">
                {transactionCount}
              </div>
              <div className="text-lg">Total Transactions</div>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div className="bg-green-100 p-6 rounded shadow text-center">
              <div className="text-3xl font-bold text-green-700">
                {completed}
              </div>
              <div className="text-lg">Completed Transactions</div>
            </div>
            <div className="bg-yellow-100 p-6 rounded shadow text-center">
              <div className="text-3xl font-bold text-yellow-700">
                {inProgress}
              </div>
              <div className="text-lg">In Progress</div>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
          <table className="w-full border mb-4">
            <thead>
              <tr className="bg-neutral-100">
                <th className="p-2">User</th>
                <th className="p-2">Type</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
                <th className="p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((t, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{t.user}</td>
                  <td className="p-2">{t.type}</td>
                  <td className="p-2">{t.status}</td>
                  <td className="p-2">{t.date}</td>
                  <td className="p-2">{t.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
