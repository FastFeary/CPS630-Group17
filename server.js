// NOTE: This is a prototype of the implementation. I need some more info about our website to polish :)

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT = 8080;
const dataPath = path.join(__dirname, 'data/classes.json');
app.use(express.json());

// placeholders for now
/* 
let items = [
    { id: 1, name: 'item 1', description: 'First item' },
    { id: 2, name: 'item 2', description: 'Second item' },
    { id: 3, name: 'item 3', description: 'Third item' }
];
*/

// let nextId = 4;

app.use('/', express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

// REST API routes 
// GET = retreive all classes
app.get('/api/classes', (req, res) => {
    const classes = readClasses();
    res.status(200).json(classes);
    console.log(classes);
});

// GET = retreive a single class by id
app.get('/api/classes/:id', (req, res) => {
    const classes = readClasses();
    const classId = parseInt(req.params.id);
    const foundClass = classes.find(c => c.id === classId);
    if (foundClass) {
        res.status(200).json(foundClass);
    } else {
        res.status(404).json({ error: 'Class not found' });
    }
});

// POST = add an new class
app.post('/api/classes', express.json(), (req, res) => {
    const classes = readClasses();
    const newClass = req.body;
    if (newClass && newClass.title && newClass.description) {
        if (!newClass.image) {
            newClass.image = '/images/placeholder.jpg';
        }
        /* if (!newItem.id) {
            newItem.id = nextId++;  // auto-generate ID
        }
        */

        let nextId = 1;
        if (classes.length > 0) {
            nextId = classes[classes.length - 1].id + 1;
        }
        newClass.id = nextId;

        classes.push(newClass);
        writeClasses(classes);
        // const items = readItems();
        // res.status(200).json(items);
        res.status(201).json(newClass);
    } 
    else {
        res.status(400).json({ error: 'Invalid class data' });
    }
});

// DELETE = remove class by id
app.delete('/api/classes/:id', (req, res) => {
    const classes = readClasses();
    const classId = parseInt(req.params.id);
    const classIndex = classes.findIndex(c => c.id === classId);
    if (classIndex !== -1) {
        const deletedClass = classes.splice(classIndex, 1);
        writeClasses(classes);
        res.status(200).json(deletedClass[0]);
    } else {
        res.status(404).json({ error: 'Class not found' });
    }
});

// Catch all route: reroute back to homepage
app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

// Starts server
app.listen(PORT, () => {
    console.log('Server started on port: ' + PORT);
});

// Helper functions:
function readClasses() {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
}

function writeClasses(classes) {
    fs.writeFileSync(dataPath, JSON.stringify(classes, null, 2));
}