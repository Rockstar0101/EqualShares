const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* Define Schemas */
const UserSchema = new Schema({
    name: String,
    created: { type: Date, default: Date.now() }
});

const GroupSchema = new Schema({
    name: String,
    members: [String],
    created: { type: Date, default: Date.now }
});

const TransactionSchema = new Schema({
    amount: Number,
    payee: String,
    group: String,
    message: String,
    created: { type: Date, default: Date.now() }
});

/* Compile Model from Schema */
const User = mongoose.model('users', UserSchema );
const Group = mongoose.model('groups', GroupSchema );
const Transaction = mongoose.model('transactions', TransactionSchema );

module.exports = { User, Group, Transaction };