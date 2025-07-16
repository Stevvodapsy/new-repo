import React from "react";

const Wallet = () => {
  // TODO: Show wallet balance, Paystack integration, withdrawal form
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
         <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Wallet</h2>
          <button onClick={() => setShowWallet(false)} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-2xl font-bold text-blue-600">{formatPrice(45000)}</p>
        </div>
        
        <div className="space-y-3">
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
            Withdraw to Bank Account
          </button>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Transaction History
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            * 5% commission fee applies to all withdrawals
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
