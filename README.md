# SplitFast

## Overview
SplitFast is a web application that helps users manage shared expenses within groups. This project includes both the backend for handling group creation, user management, and transaction calculations, as well as the frontend for user interaction and experience.

## Repository Structure
```
SplitFast_Expense_Splitter/
├── server/
│   ├── models/
│   │   └── GroupModel.js
│   ├── routes/
│   │   └── GroupRoutes.js
│   ├── services/
│   │   └── Transaction.js
│   │   └── TransactionCalculator.js
│   │   └── BalanceCalculator.js
│   ├── server.js
│   └── package.json
expense-share/
├── src/
│   ├── app/
│   │   ├── page.js           (Home page)
│   │   ├── layout.js         (Root layout)
│   │   ├── group/
│   │   │   └── page.js       (Group page)
│   │   └── globals.css
│   └── components/
│       ├── MessageList.js
│       ├── ExpenseForm.js
│       ├── TransactionList.js
│       └── ParticipantList.js
├── tailwind.config.js
├── next.config.js
└── package.json
```

- **models/**: Database schemas and models.
- **routes/**: Logic for handling requests and interacting with models.
- **services/**: Logic including transaction and balance calculations.
- **server.js**: Main server setup and entry point.
- **src/**: Contains all the React components and main application logic.
- **components/**: Individual React components for different parts of the application.

## Setting Up the Development Environment
1. **Clone the Repository**
   ```bash
   git clone https://github.com/BhuminHirpara22/Splitfast_Expense_Splitter.git
   cd Splitfast_Expense_Splitter
   ```

2. **Install Dependencies**
    1. **Backend**
    ```bash
    cd server
    npm install
    sudo systemctl start mongod
    ```
    2. **Frontend**
    ```bash
    cd expense-share
    npm install
    ```

3. **Run the server**
    1. **Backend**
    ```bash
    cd server
    npm start
    ```
    1. **Frontend**
    ```bash
    cd expense-share
    npm run dev
    ```

# Using the Application

## Creating a Group
1. Enter a unique group name and your username to create a new group.
2. If the group name is already taken, you will be prompted to choose a different name.

## Joining a Group
1. Enter the group name and your username to join an existing group.
2. If the group exists, you will be added to the group and can start participating.

## Adding Expenses
1. In the group, enter the expense description and amount.
2. The expense will be added and transactions will be calculated for the group.

## Viewing Transactions
1. Transactions will be displayed showing who owes whom and how much.
2. The transactions are updated in real-time as expenses are added.

## Leaving a Group
1. Simply disconnect from the group when you are done.
2. Your transactions will still be stored for future reference.
