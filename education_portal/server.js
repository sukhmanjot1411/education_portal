const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3019;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serving static files from the current directory

mongoose.connect('mongodb://localhost:27017/your-database-name', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful");
});

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    regd_no: String,
    phoneNumber: String,
    message: String,
    branch: String
});

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    type: Number
});

const courseSchema = new mongoose.Schema({
    courseName: String,
    courseType: String,
    courseImage: String,
    courseDescription: String,
});

const Contact = mongoose.model('Contact', contactSchema);
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('courseImage');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// Route for submitting contact form
app.post('/submit-contact-form', async (req, res) => {
    try {
        const { name, email, regd_no, phoneNumber, message, branch } = req.body;
        const contact = new Contact({ name, email, regd_no, phoneNumber, message, branch });
        await contact.save();
        console.log('Contact form data saved:', contact);
        res.json({ success: true, message: 'Form submission successful' });
    } catch (error) {
        console.error('Error saving contact form data:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Route for user registration
app.post('/register', async (req, res) => {
    try {
        const { userName, password, type } = req.body;
        const existingUser = await User.findOne({ userName, type });
        if (existingUser) {
            res.json({ success: false, message: 'User already exists' });
        } else {
            const newUser = new User({ userName, password, type });
            await newUser.save();
            console.log('New user registered:', newUser);
            res.json({ success: true, message: 'User registered successfully' });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Route for uploading course details
app.post('/upload-course', (req, res) => {
    upload(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                console.error('Error uploading file:', err);
                return res.status(500).json({ success: false, error: 'Internal server error' });
            } else if (err) {
                console.error('Unknown error uploading file:', err);
                return res.status(500).json({ success: false, error: 'Internal server error' });
            }

            const { courseName, courseType, courseDescription } = req.body;
            const courseImage = req.file.path; // Path to the uploaded image file
            const course = new Course({ courseName, courseType, courseImage, courseDescription });
            await course.save();
            console.log('Course details saved:', course);
            res.json({ success: true, message: 'Course details saved successfully' });
        } catch (error) {
            console.error('Error saving course details:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    });
});

// Route for user login
app.post('/login', async (req, res) => {
    try {
        const { userName, password, type } = req.body;
        const user = await User.findOne({ userName, password, type });
        if (user) {
            res.json({ success: true, message: 'Login successful', type: user.type });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
