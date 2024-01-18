import express from 'express';

import { getPost, getPosts, getPostPreview, createBlogPost } from './database';

const app = express();
const port = 8080;
app.set("view engine", "ejs");


// app.js
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
  try {
    const post = await getPostPreview('1');
    res.render('index', { post });
    console.log(post);
  }
   catch (error) {
    res.status(500).send('Error fetching post');
  }

});

app.get('/create', (req, res) => {
  res.render('create');
});


// get a post by id
app.get('/blogPost/:post_id', async (req, res) => {
  try {
    const id = req.params.post_id;
    const post = await getPost(id);
    res.json(post); // Use res.json to send JSON response
  } catch (error) {
    res.status(500).send('Error fetching post');
  }
});

// get a post preview by id
app.get('/postPreview/:post_id', async (req, res) => {
  try {
    const id = req.params.post_id;
    const post = await getPostPreview(id);
    res.json(post); // Use res.json to send JSON response
  } catch (error) {
    res.status(500).send('Error fetching post');
  }
});

// get all posts
app.get('/blogPosts/', async (req, res) => {
  console.log('Handling GET /blogPosts/ request...');
  try {
    console.log('Calling getPosts...');
    const posts = await getPosts();
    console.log('getPosts returned, sending response...');
    res.send(posts);
  } catch (error) {
    console.error('Error in GET /blogPosts/ handler:', error);
    res.status(500).send('Error fetching posts');
  }
});

// POST route to create a new blog post
app.post('/newPost/', async (req, res) => {
  console.log('Handling POST /blogPosts/ request...');

  // Extract data from request body
  const { title, postDescription, content, authorId, imagePath } = req.body;

  try {
    console.log('Calling createBlogPost...');
    const result = await createBlogPost(title, postDescription, content, authorId, imagePath);
    console.log('createBlogPost executed, sending response...');
    res.status(201).send(result);
  } catch (error) {
    console.error('Error in POST /blogPosts/ handler:', error);
    res.status(500).send('Error creating post');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});