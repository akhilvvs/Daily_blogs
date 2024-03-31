import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid"; // Import the UUID library
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Define the fixed blog post
const fixedPost = {
    id: uuidv4(),
    title: "Welcome to Our Blog!",
    content: "This is our first blog post. Welcome to our blog! We'll be sharing exciting content with you soon.",
    createdAt: new Date()
};

// Array to store dynamic posts
let posts = [];

//rendering home page
app.get("/", (req, res) => {
    res.render("index.ejs", { posts, fixedPost });
})

// Rendering form for creating a new post
app.get("/new", (req, res) => {
    res.render("new.ejs");
})

//rendring about page 
app.get("/about", (req, res) => {
    res.render("about.ejs");
})

//rendring contact page 
app.get("/contact", (req, res) => {
    res.render("contact.ejs");
})

app.post("/contact", (req, res) => {
    const { yourname, email, message } = req.body;
    // Process the form data (e.g., send an email)
    // Here you would typically use a library like Nodemailer to send an email
    console.log("Name:", yourname);
    console.log("Email:", email);
    console.log("Message:", message);
    // Send a response back to the client
    res.send("Message sent successfully!");
});



// Handling new post submission
app.post("/submit", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const newPost = { id: uuidv4(), title, content, createdAT: new Date() }; // Generate a unique ID for the post
    posts.push(newPost);
    res.redirect("/");
})

// Rendering form for editing a specific post
app.get("/edit/:id", (req, res) => {
    const postId = req.params.id;
    const post = posts.find(post => post.id === postId);
    if (post) {
        res.render("edit.ejs", { post });
    } else {
        res.redirect("/");
    }
});

// Updating a specific post
app.post("/edit/:id", (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
    const index = posts.findIndex(post => post.id === postId);
    if (index !== -1) {
        posts[index] = { ...posts[index], title, content };
    }
    res.redirect("/");
});

// Server-side route for deleting a post
app.post("/delete/:id", (req, res) => {
    if (req.body._method === 'DELETE') {
        const postId = req.params.id;
        posts = posts.filter(post => post.id !== postId);
        ///////////////////////////////////////////////////////
        res.redirect("/");
        /////////////////////////////////////////////////////
    } else {
        // Handle the case where the _method is not DELETE
        res.status(400).send('Invalid request');
    }
})

app.listen(port, (req, res) => {
    console.log(`listening on server ${port}`);
})