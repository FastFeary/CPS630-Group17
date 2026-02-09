// NOTE: This is a prototype of the implementation. I need some more info about our website to polish :)

const express = require('express');
const app = express();
const path = require('path');

const PORT = 8080;

// placeholders for now
let items = [
    { id: 1, name: 'item 1', description: 'First item' },
    { id: 2, name: 'item 2', description: 'Second item' },
    { id: 3, name: 'item 3', description: 'Third item' }
];

let nextId = 4;

app.use('/', express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

// REST API routes 
// GET = retreive all items
app.get('/api/items', (req, res) => {
    res.status(200).json(items);
    console.log(items);  
});

// POST = add an new item
app.post('/api/items', express.json(), (req, res) => {
    const newItem = req.body;
    if (newItem && newItem.name && newItem.description) {
        if (!newItem.id) {
            newItem.id = nextId++;  // auto-generate ID
        }
        items.push(newItem);
        res.status(201).json(newItem);
    } 
    else {
        res.status(400).json({ error: 'Invalid item data' });
    }
});

// DELETE = remove item by id
app.delete('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        const deletedItem = items.splice(itemIndex, 1);
        res.status(200).json(deletedItem[0]);
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});

// Starts server
app.listen(PORT, () => {
    console.log('Server started on port: ' + PORT);
});
