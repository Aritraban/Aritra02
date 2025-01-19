// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Gallery filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            // Filter gallery items
            galleryItems.forEach(item => {
                if (category === 'all' || item.classList.contains(category)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form handling
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const sessionType = document.getElementById('session-type').value;
            const date = document.getElementById('date').value;
            const message = document.getElementById('message').value;

            // Basic form validation
            if (!name || !email || !sessionType || !date) {
                alert('Please fill in all required fields');
                return;
            }

            // Here you would typically send the form data to a server
            console.log('Booking submitted:', { name, email, sessionType, date, message });
            alert('Thank you for your booking request! We will contact you soon.');
            bookingForm.reset();
        });
    }

    // Image lazy loading
    const images = document.querySelectorAll('.gallery-item img');
    const imageOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // This triggers the image load
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));

    // Add hover effect to gallery items
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
            item.style.transition = 'transform 0.3s ease';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });
});
document.getElementById('sendOtp').addEventListener('click', function() {
    // Add OTP sending logic here
    alert('OTP has been sent to your email');
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add login validation logic here
    alert('Login successful!');
});
async function sendOtpViaEmail() {
    const email = document.getElementById('email').value;
    
    if (!email) {
        alert('Please enter an email address');
        return;
    }

    try {
        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        
        // Email service configuration
        const emailData = {
            to: email,
            subject: 'Your OTP for Photography Website Login',
            text: `Your OTP is: ${otp}. This code will expire in 10 minutes.`
        };

        // Here you would integrate with your email service provider
        // Example using a mock API call:
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (response.ok) {
            // Store OTP in session storage for validation
            sessionStorage.setItem('loginOTP', otp.toString());
            sessionStorage.setItem('otpTimestamp', Date.now().toString());
            
            alert('OTP has been sent to your email');
        } else {
            throw new Error('Failed to send OTP');
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Please try again.');
    }
}

// Update the send OTP button click handler
document.getElementById('sendOtp').addEventListener('click', sendOtpViaEmail);
// Add event listener for form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const enteredOTP = document.getElementById('otp').value;
    const storedOTP = sessionStorage.getItem('loginOTP');
    const otpTimestamp = parseInt(sessionStorage.getItem('otpTimestamp'));

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Check if OTP exists and is not expired (10 minutes)
    const currentTime = Date.now();
    const otpExpired = currentTime - otpTimestamp > 10 * 60 * 1000;

    if (!storedOTP || otpExpired) {
        alert('Please request a new OTP');
        return;
    }

    // Validate OTP
    if (enteredOTP !== storedOTP) {
        alert('Invalid OTP');
        return;
    }

    try {
        // Here you would typically make an API call to verify credentials
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (response.ok) {
            // Clear OTP from session storage
            sessionStorage.removeItem('loginOTP');
            sessionStorage.removeItem('otpTimestamp');
            
            alert('Login successful!');
            // Redirect to dashboard or home page
            window.location.href = '/dashboard.html';
        } else {
            alert('Invalid email or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
});
// Backend database setup using Node.js and MongoDB

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/photography_website', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB database');
});

// Define User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Define Gallery Schema
const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

// Create models
const User = mongoose.model('User', userSchema);
const Gallery = mongoose.model('Gallery', gallerySchema);

// Express middleware
app.use(express.json());

// API Routes
app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Add password verification logic here
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/gallery', async (req, res) => {
    try {
        const newImage = new Gallery(req.body);
        await newImage.save();
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image' });
    }
});

app.get('/api/gallery', async (req, res) => {
    try {
        const images = await Gallery.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gallery' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

document.addEventListener('DOMContentLoaded', function() {
    // Gallery filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.dataset.category;
            
            galleryItems.forEach(item => {
                if (category === 'all' || item.classList.contains(category)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

});