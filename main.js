
const { initializeApp } = require("firebase/app");
const { getDatabase, set, ref, get } = require("firebase/database");
const express = require('express');
const bodyParser = require("body-parser");
const firebaseConfig = {
    databaseURL: "https://find-rgb-default-rtdb.firebaseio.com",
};

const app2 = express();
app2.use(bodyParser.json());
app2.use(express.urlencoded({ extended: true }));

var server = app2.listen(3000, function () {
    console.log('Server is running on port 3000');
});

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


app2.get('/', (req, res) => {
    return res.status(200).json({ message: 'Connected' });
});

//Create 
app2.post('/api/create', (req, res) => {
    
    const username = req.body.username;
    try {
        console.log(username);
        console.log('path', 'users/ + username');
        get(ref(database, 'users/' + username)).then((snapshot) => {
            if(snapshot.exists()){
                console.log('User already exists');
                return res.status(200).json({ message: 'User already exists' });
            }else {
                set(ref(database, 'users/' + username), {
                    username: username,
                    score: 0,
                    date: new Date().toISOString().slice(0, 10)
                });
                return res.status(200).json({ message: 'User created' });
            }
        });
       

    
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

//Get users 

app2.get('/api/users/:username', (req, res) => {
    try {
        get(ref(database, 'users/' + req.params.username)).then((snapshot) => {
            if(snapshot.exists()){
                return res.status(200).json({
                    users: snapshot.val()
                });
            }else {
                return res.status(200).json({
                    users: 'No users found'
                });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});

app2.get('/api/users', (req, res) => {
    try {
        get(ref(database, 'users/')).then((snapshot) => {
            if(snapshot.exists()){
                return res.status(200).json({
                    users: snapshot.val()
                });
            }else {
                return res.status(200).json({
                    users: 'No users found'
                });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});


