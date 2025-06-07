import {minimizeTransactions} from './TransactionCalculator.js'
import { calculateNetBalances } from './BalanceCalculator.js';

function ShowTransactions(expenses,participants){
    //Calculates balances by passing expenses and username of participants
    const balances = calculateNetBalances(expenses, participants);
    
    //Calculates transactions based on the balances of each participant
    const transactions = minimizeTransactions(balances);
    
    //returns transactions
    return transactions;
}

export {ShowTransactions};