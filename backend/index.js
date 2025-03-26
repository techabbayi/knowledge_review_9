// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

const Task = require('./schemas/Task');

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Task Management API' });
});


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Could not connect to MongoDB:', err);
    });

app.get('/tasks', async (req, res) => {
    console.log('Fetching tasks...');
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }); // Sort by newest first
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Write an endpoint to create a new task.

app.post('/tasks', async (req, res) => {
    const { title, dueDate, priority, status } = req.body;

    if (!title || !dueDate || !priority || !status ) {
        return res.status(400).json({ message: "All fields are required"});
    }

    try {
        const newTask = new Task({ title, dueDate, priority, status });
        await newTask.save()
        
        res.status(200).json(newTask);
    } catch (err) {
        res.status(400).json({ message: "Error WHile saving task data"});
    }
});