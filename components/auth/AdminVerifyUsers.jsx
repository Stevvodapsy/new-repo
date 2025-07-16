import React, { useEffect, useState } from "react";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const AdminVerifyUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "users"));
        setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleVerify = async (userId, verified) => {
    try {
      await updateDoc(doc(db, "users", userId), { verified });
      setUsers((users) =>
        users.map((u) => (u.id === userId ? { ...u, verified } : u))
      );
    } catch (err) {
      alert("Failed to update verification status");
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">
        Admin: Manage User Verification
      </h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-neutral-100">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Verified</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">
                {user.name} {user.surname}
              </td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.verified ? "✅" : "❌"}</td>
              <td className="p-2">
                <button
                  className={`px-3 py-1 rounded ${
                    user.verified ? "bg-red-500" : "bg-green-500"
                  } text-white font-bold`}
                  onClick={() => handleVerify(user.id, !user.verified)}
                >
                  {user.verified ? "Unverify" : "Verify"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminVerifyUsers;
