const express = require('express');
const router = express.Router();
const { User, Group, Transaction } = require('../model/Schema');

// Default Page
router.get('/', (req, res) => {
    res.json({ msg: 'Welcome to Sharing App.' })
});


// Create a New User
router.post('/createUser', async (req, res) => {
    if(!req.body.name) return res.status(400).json({ error: 'Name is required!' });

    let user = new User({ name: req.body.name });
    let result = await user.save();
    res.json({ result });
});


// Create a New User
router.post('/createGroup', async (req, res) => {
    let { name, members } = req.body;
    if(!(name && Array.isArray(members) && members.length)) return res.status(400).json({ error: 'Bad Request!' });
    /* Skipping checking of each members existance(server side validation) */

    let group = new Group({ name, members });
    let result = await group.save();
    res.json({ result });
});


// List all users
router.get('/listAllUser', async (req, res) => {
    let result = await User.find({}, 'name');
    result = result.map(info => info.name);

    res.json({ result });
});


// Share amount with group
router.post('/shareExpense', async (req, res) => {
    let { amount, payee, group, message } = req.body;
    if(isNaN(amount) || !(payee && group)) return res.status(400).json({ error: 'Bad Request!' });
    
    // Check if user exists
    let user = await User.findOne({ name: payee });
    if(!user) return res.status(404).json({ error: 'No such user!' });

    // check if user belongs to such group
    let userGroup = await Group.findOne({ name: group, members: payee });
    if(!userGroup) return res.status(403).json({ error: 'User has no such group!' });
    
    let transaction = { amount, payee, group };
    if(message) transaction.message = message;
    //You can also use create() to define the model instance at the same time as you save it.
    let result = await Transaction.create(transaction);
    res.json({ result });
});


// Get all sharing details of a particular user
router.get('/userInfo/:id', async (req, res) => {
    let { id:name } = req.params;
    if(!name) return res.status(400).json({ error: 'UserID(Name) is required!' });

    // Check if user exists
    let user = await User.findOne({ name });
    if(!user) return res.status(404).json({ error: 'No such user!' });

    let transactionArr = [];
    // Get User Groups Details
    let userGroups = await Group.find({ members: name }, 'name members');
    if(userGroups.length) {
        let groupIDs = userGroups.map(info => info.name);
        
        // check transactions for userGroups
        let transactions = await Transaction.find({ group: { $in: groupIDs }}).sort({ created: 1 });
        if(transactions.length) {
            for (const transaction of transactions) {
                let { amount, payee, group, message } = transaction;
                let groupMembers = userGroups.find(a => a.name === group).members.length;
                let contribution = (amount/groupMembers).toFixed(2);

                let transactionLog = '';
                transactionLog += (payee === name)?
                    `You paid $${amount} in Group ${group}(${groupMembers})${message? ' for ' + message: ''}.`
                    : `${payee}($${amount}) shared an amount of $${contribution} from Group ${group}(${groupMembers})${message? ' for ' + message: ''}.`;
                
                transactionArr.push(transactionLog);
            }
        }
    }

    res.json({ name, logs: transactionArr });
});

module.exports = router;

