"use client";
// components/TransactionList.js
export default function TransactionList({ transactions, currentUser }) {
  if (!transactions.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        No transactions to settle yet
      </div>
    );
  }

  // Filter transactions that involve the current user
  const userTransactions = transactions.filter(
    (t) => t.from === currentUser || t.to === currentUser
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settlement Summary</h2>

      {userTransactions.length > 0 ? (
        <div className="space-y-3">
          {userTransactions.map((transaction, index) => {
            const isDebtor = transaction.from === currentUser;

            return (
              <div
                key={index}
                className={`p-3 rounded-md border flex justify-between items-center ${
                  isDebtor
                    ? "border-red-200 bg-red-50"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <div>
                  {isDebtor ? (
                    <p>
                      You owe{" "}
                      <span className="font-semibold">{transaction.to}</span>
                    </p>
                  ) : (
                    <p>
                      <span className="font-semibold">{transaction.from}</span>{" "}
                      owes you
                    </p>
                  )}
                </div>
                <div
                  className={`font-bold ${
                    isDebtor ? "text-red-600" : "text-green-600"
                  }`}
                >
                  ${parseFloat(transaction.amount).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
          <p className="text-blue-800">
            You&apos;re all settled up! There are no transactions that involve
            you.
          </p>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">All Transactions</h3>
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  From
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  To
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className={
                    transaction.from === currentUser ||
                    transaction.to === currentUser
                      ? "bg-indigo-50"
                      : ""
                  }
                >
                  <td className="px-4 py-3 text-sm">
                    {transaction.from === currentUser
                      ? "You"
                      : transaction.from}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {transaction.to === currentUser ? "You" : transaction.to}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    ${parseFloat(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
