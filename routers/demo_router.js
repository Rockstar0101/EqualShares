const async = require('async');
const request = require('request');
const express = require('express');
const router = express.Router();
let url = 'http://localhost:3000/';

// Default Page
router.get('/', (req, res) => {
    async.parallel({
        users: function(cbUser) {
            let users = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "C1"];

            async.each(users, (user, cb) => {
                makeRequest('createUser', 'POST', {name: user}, () => cb());
            }, () => {
                cbUser(null, users);
            })
        },
        groups: function(cbGroup) {
            let groups = [
                { name: "G1", members: ["A1", "A2", "A3", "A4"]},
                { name: "G2", members: ["B1", "B2", "B3"]},
                { name: "G3", members: ["A1", "B2", "A4"]}
            ];

            async.each(groups, (groupInfo, cb) => {
                makeRequest('createGroup', 'POST', groupInfo, () => cb());
            }, () => {
                cbGroup(null, groups);
            })
        },
        expenses: function(cbExp) {
            let expenses = [
                { amount: 1000, payee: "A1", group: "G3" },
                { amount: 300, payee: "A2", group: "G1", message: "Water Bill" },
                { amount: 2300, payee: "A4", group: "G3", message: "Electricity Bill" },
                { amount: 250, payee: "B1", group: "G2", message: "Repairing" }
            ];

            async.each(expenses, (expense, cb) => {
                makeRequest('shareExpense', 'POST', expense, () => cb());
            }, () => {
                cbExp(null, expenses);
            })
        }
    }).then(result => {
        console.log(result);
        res.json({ result });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Unable to create demo now!' });
    });
});

function makeRequest(relPath, method, data=null, cb) {
    let options = {
        uri: url + relPath,
        method,
        headers: { 'Content-Type': 'application/json' }
    }
    if(data) options.body = JSON.stringify(data);
    request(options, (err, res, body) => {
        cb(body || null);
    })
}

module.exports = router;