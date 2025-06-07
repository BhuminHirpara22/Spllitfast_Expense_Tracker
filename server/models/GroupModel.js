import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    roomName: String,
    participants: { type: Array,default: []},
    expenses: [{
        userName: String,
        description: String,
        expense: mongoose.Schema.Types.Decimal128,
    }],
    messages: { type: Array, default: [] }
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
