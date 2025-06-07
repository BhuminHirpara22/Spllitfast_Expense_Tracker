function calculateNetBalances(expenses, participants) {
    const balances = {};
    let totalPayment = 0;
    
    // Calculate the total payment from all expenses
    expenses.forEach((expense) => {
        const { expense: amount } = expense;
        totalPayment += parseFloat(amount);
    });
    
    // Calculate the per person share of the total expenses
    let perPerson = totalPayment / participants.length;
    
    // Initialize each participant's balance with their share of the total expenses as a negative value
    participants.forEach((participant) => {
        balances[participant] = 0 - parseFloat(perPerson);
    });
    
    // Adjust each participant's balance based on the expenses they paid
    expenses.forEach(expense => {
        const { userName: payer, expense: amount } = expense;
        balances[payer] += parseFloat(amount);
    });

    // Return the net balances of all participants
    return balances;
}

export { calculateNetBalances };
