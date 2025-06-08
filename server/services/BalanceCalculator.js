function calculateNetBalances(expenses, participants) {
    const balances = {};
    let totalPayment = 0;
    
    // Calculate the total payment from all expenses
    expenses.forEach((expense) => {
        let amount = expense.expense;
        if (typeof amount === 'object' && amount !== null && amount.toString) {
            amount = amount.toString();
        }
        totalPayment += parseFloat(amount);
    });
    // ...existing code...
    participants.forEach((participant) => {
        balances[participant] = 0 - parseFloat(perPerson);
    });
    expenses.forEach(expense => {
        const { userName: payer } = expense;
        let amount = expense.expense;
        if (typeof amount === 'object' && amount !== null && amount.toString) {
            amount = amount.toString();
        }
        balances[payer] += parseFloat(amount);
    });

    // Return the net balances of all participants
    return balances;
}

export { calculateNetBalances };
