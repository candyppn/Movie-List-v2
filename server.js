let express = require('express');
let mustache = require('mustache-express');
let bodyParser = require('body-parser');
let app = express();

// Configure Mustache template engine
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');

// Load movie data
let movies = require('./movies_sql');
movies.load('movies.json');

// Add body-parser middleware to parse POST request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Movie list route
app.get('/', (req, res) => {
    const movieData = { movies: movies.list() };
    res.render('movie-list', movieData);
});

// Movie details route
app.get('/movie-details/:id', (req, res) => {
    const movieData = movies.read(req.params.id);
    res.render('movie-details', movieData);
});

// Add movie form route
app.get('/add-movie-form', (req, res) => {
    res.render('add-movie');
});

// Handle submission of add movie form
app.post('/add-movie', (req, res) => {
    let id = movies.create(req.body.title, req.body.year, req.body.actors, req.body.plot, req.body.poster);
    movies.save('movies.json'); // save after adding a movie
    res.redirect(`/`);
});

// Edit movie form route
app.get('/edit-movie-form/:id', (req, res) => {
    const movieData = movies.read(req.params.id);
    res.render('edit-movie', movieData);
});

// Handle submission of edit movie form
app.post('/edit-movie/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let success = movies.update(id, req.body.title, req.body.year, req.body.actors, req.body.plot, req.body.poster);
    movies.save('movies.json'); // save after editing a movie
        res.redirect(`/`);
    
});

// Delete movie form route
app.get('/delete-movie-form/:id', (req, res) => {
    const movieData = movies.read(req.params.id);
    res.render('delete-movie', movieData);
});


// Handle submission of delete movie form
app.post('/delete-movie/:id', (req, res) => {
    const id = req.params.id;
    const success = movies.delete(id);
    movies.save('movies.json'); // save after deleting a movie
      res.redirect('/');
  });
  


// Start server
app.listen(3000, () => {
    console.log('Movie server listening at http://localhost:3000');
});
