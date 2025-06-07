function minimizeTransactions(balances) {
    const debtors = [];
    const creditors = [];
    
    // Categorize each person as a debtor or creditor based on their balance
    for (const person in balances) {
        const balance = balances[person];
        if (balance < 0) {
            debtors.push({ person, balance });
        } else if (balance > 0) {
            creditors.push({ person, balance });
        }
    }
    
    const transactions = [];
    let debtorIndex = 0;
    let creditorIndex = 0;
    
    // Loop until all debts are settled
    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
        const debtor = debtors[debtorIndex];
        const creditor = creditors[creditorIndex];
        
        // Determine the amount to be settled in this transaction
        const settledAmount = Math.min(-debtor.balance, creditor.balance);
        
        // Create a transaction record
        transactions.push({
            from: debtor.person,
            to: creditor.person,
            amount: settledAmount
        });
        
        // Update the balances after the transaction
        debtors[debtorIndex].balance += settledAmount;
        creditors[creditorIndex].balance -= settledAmount;
        
        // Move to the next debtor if the current one's balance is settled
        if (debtors[debtorIndex].balance === 0) {
            debtorIndex++;
        }
        
        // Move to the next creditor if the current one's balance is settled
        if (creditors[creditorIndex].balance === 0) {
            creditorIndex++;
        }
    }
    
    // Return the list of transactions
    return transactions;
}

export { minimizeTransactions };
