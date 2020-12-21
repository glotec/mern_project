const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

let Todo = require('./models/todo');

const app = express();

const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/mern_project', {
    useNewUrlParser: true
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

const apiTodo = express.Router();
app.use('/todo', apiTodo);

apiTodo.route('/').get((req, res) => {
    Todo.find((err, todos) => {
        if(err) res.json({err});
        else res.json(todos);
    });
});

apiTodo.route('/:id').get((req, res) => {
    let id = req.params.id;
    Todo.findById(id, (err, todo) => {
        res.json(todo);
    });
});
apiTodo.route('/add').post((req, res) => {
    let todo = new Todo(req.body);
    todo.save()
    .then(todo => {
        res.status(200).json({'todo': 'added successfully'});
    })
    .catch(err => {
        res.status(400).send('Adding new todo failed');
    });
});

apiTodo.route('/update/:id').post((req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if(!todo) res.status(404).send('data is not founded');
        else
        {
            todo.todo_description = req.params.todo_description;
            todo.todo_responsible = req.params.todo_responsible;
            todo.todo_priority = req.params.todo_responsible;
            todo.todo_completed = req.params.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated');
            })
            .catch(err => res.status(400).send('Update not possible'));
        }
    });
});

app.listen(PORT, function() {
    console.log(`Server is running on http://localhost:${PORT}/`);
});