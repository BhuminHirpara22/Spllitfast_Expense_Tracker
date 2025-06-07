import Group from '../models/GroupModel.js';
import mongoose from 'mongoose';
import { ShowTransactions } from '../services/Transaction.js';

const setupSocketRoutes = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        // Creating a new group
        socket.on('createGroup', async (groupData) => {
            const { roomName, userName } = groupData;
            
            // Finding if the group already exists or not
            const existingGroup = await Group.findOne({ roomName });

            // If group doesn't exist
            if (!existingGroup) {
                // New group created
                const newGroup = new Group({ roomName, participants: [userName], expenses: [], messages: [] });
                await newGroup.save();

                socket.join(roomName);
                socket.roomName = roomName;
                socket.userName = userName;

                // Passing join message to frontend
                socket.emit('joinMessage', `Group ${roomName} created and joined`);
            } else {
                socket.emit('joinError', 'Group already exists. Pick a different group name');
            }
        });

        socket.on('joinGroup', async (groupData) => {
            const { roomName, userName } = groupData;

            // Finding if the group exists or not
            const existingGroup = await Group.findOne({ roomName });

            if (existingGroup) {
                // Joining room using socket
                socket.join(roomName);

                // Adding new participants
                if (!existingGroup.participants.includes(userName)) {
                    existingGroup.participants.push(userName);
                    await existingGroup.save();
                }

                socket.roomName = roomName;
                socket.userName = userName;

                // Passing join message and previous group messages to user
                socket.emit('joinMessage', `Joined group ${roomName}`);
                socket.emit('loadMessages', existingGroup.messages);

                // Changing transactions if new user joins and passing it to every user in that group
                const transactions = ShowTransactions(existingGroup.expenses, existingGroup.participants);
                
                io.to(socket.roomName).emit('transactions', transactions);
            } else {
                socket.emit('joinError', 'Group does not exist');
            }
        });

        socket.on('sendMessage', async (message) => {
            const { description, amount } = message;
            if (socket.roomName && socket.userName) {
                // Log the description and amount of the new message
                
                const expenseMessage = `Payment from ${socket.userName} for ${description}: ${amount}`;
                
                // Sending the new message to all clients in the room
                io.to(socket.roomName).emit('message', expenseMessage);
                
                // Finding the group to which the message belongs
                const group = await Group.findOne({ roomName: socket.roomName });
                
                if (group) {
                    // Add the new transaction
                    group.expenses.push({
                        userName: socket.userName,
                        description: description,
                        expense: mongoose.Types.Decimal128.fromString(amount)
                    });

                    // Adding the new message to the group's messages array
                    group.messages.push(expenseMessage);
                    await group.save();
                    
                    // Calculating and updating transactions
                    const transactions = ShowTransactions(group.expenses, group.participants);
                    
                    // Sending the updated transactions to all clients in the room
                    io.to(socket.roomName).emit('transactions', transactions);
                }
            } else {
                // Log error if the socket is not in a room
                console.log(`Error: Socket not in a room ${socket.roomName}`);
                socket.emit('error', 'You are not in a room');
            }
        });
        
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

export default setupSocketRoutes;
