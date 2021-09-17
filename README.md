# Expense Sharing Application
Base URL: `http://localhost:3000`  
To test App, run `npm install` and call `/createDemoData` API to better understand the flow (it'll create some demo users, groups, expenses for you).

APIs We've created for use:
* Demo Index `/`.
* Create User `/createUser`.
* Create Group `/createGroup`.
* List Users `/listAllUser`.
* Share Expense `/shareExpense`.
* Get Userinfo `/userInfo/:[id/name]`. Eg.- http://localhost:3000/userInfo/A1
* Demo data `/createDemoData`.

```
Note:-
We should be using IDs(unique key) but here I'm using name, group name as Unique Identifiers as for the demo, as names are easy to remember for testing instead of IDs.
(it may conflict in case of multiple same user/group name - update wisely)

```

### Data used in Demo
```json

    "result": {
        "users": [
            "A1",
            "A2",
            "A3",
            "A4",
            "B1",
            "B2",
            "B3",
            "C1"
        ],
        "groups": [
            {
                "name": "G1",
                "members": [
                    "A1",
                    "A2",
                    "A3",
                    "A4"
                ]
            },
            {
                "name": "G2",
                "members": [
                    "B1",
                    "B2",
                    "B3"
                ]
            },
            {
                "name": "G3",
                "members": [
                    "A1",
                    "B2",
                    "A4"
                ]
            }
        ],
        "expenses": [
            {
                "amount": 1000,
                "payee": "A1",
                "group": "G3"
            },
            {
                "amount": 300,
                "payee": "A2",
                "group": "G1",
                "message": "Water Bill"
            },
            {
                "amount": 2300,
                "payee": "A4",
                "group": "G3",
                "message": "Electricity Bill"
            },
            {
                "amount": 250,
                "payee": "B1",
                "group": "G2",
                "message": "Repairing"
            }
        ]
    }
}
```