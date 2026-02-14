// NOTE: This is a prototype of the implementation. I need some more info about our website to polish :)

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT = 8080;
const dataPath = path.join(__dirname, 'data', 'items.json');
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

app.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/booking.html'));
});

// REST API routes 
// GET = retreive all items
app.get('/api/items', (req, res) => {
    const items = readItems();
    res.status(200).json(items);
    console.log(items);  
});

// POST = add an new item
app.post('/api/items', express.json(), (req, res) => {
    const items = readItems();                              // I added this
    const newItem = req.body;
    if (newItem && newItem.name && newItem.description) {
        /* if (!newItem.id) {
            newItem.id = nextId++;  // auto-generate ID
        }
        */

        let nextId = 1;                                         // I added this
        if (items.length > 0) {
            nextId = items[items.length - 1].id + 1;
        }
        newItem.id = nextId;

        items.push(newItem);
        writeItems(items);                                  // I added this
        // const items = readItems();
        // res.status(200).json(items);
        res.status(201).json(newItem);                      // I added this
    } 
    else {
        res.status(400).json({ error: 'Invalid item data' });
    }
});

// DELETE = remove item by id
app.delete('/api/items/:id', (req, res) => {
    const items = readItems();                                  // I added this
    const itemId = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        const deletedItem = items.splice(itemIndex, 1);
        writeItems(items);                                      // I added this
        res.status(200).json(deletedItem[0]);
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});

// Starts server
app.listen(PORT, () => {
    console.log('Server started on port: ' + PORT);
});

// Helper functions:
function readItems() {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
}

function writeItems(items) {
    fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
}