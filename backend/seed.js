const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    console.log('Creating demo users...');
    const alex = await User.create({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'password123',
    });

    const sarah = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      password: 'password123',
    });

    const marcus = await User.create({
      name: 'Marcus Vance',
      email: 'marcus@example.com',
      password: 'password123',
    });

    console.log('Creating sample blog posts...');
    const posts = await Post.insertMany([
      {
        title: 'Building Scalable Full-Stack Applications with React and Node.js',
        content: `Modern web applications require clean architecture, robust state management, and seamless communication between frontend and backend systems.\n\nIn this comprehensive guide, we explore how React's component hierarchy combined with Express REST endpoints and MongoDB documents creates a resilient ecosystem. We discuss key patterns like JWT authentication, context state distribution, and performance optimization techniques for high-traffic platforms.`,
        category: 'Web Development',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        author: alex._id,
      },
      {
        title: 'The Evolution of Generative AI: From Transformers to Autonomous Agents',
        content: `Artificial Intelligence is undergoing a seismic shift. The transition from large language model text completions to goal-directed autonomous agents is redefining how software is built and operated.\n\nHere we analyze multi-agent orchestration, tool calling capabilities, local memory retention strategies, and how developers can integrate cutting-edge AI features into everyday applications.`,
        category: 'AI',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        author: sarah._id,
      },
      {
        title: 'Mastering TypeScript & Clean Code Practices in 2026',
        content: `Writing clean, maintainable code is an essential superpower for engineering teams. Type safety eliminates entire categories of runtime bugs while boosting developer speed.\n\nLearn how strict type checking, functional utility patterns, domain-driven data schemas, and structured error boundaries keep large codebases scalable over years of rapid feature additions.`,
        category: 'Programming',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        author: marcus._id,
      },
      {
        title: 'Work-Life Balance for Software Engineers in the Remote Work Era',
        content: `Navigating boundaries between work and personal life when your bedroom is three steps away from your office desk is a common challenge.\n\nDiscover practical strategies for deep work scheduling, digital detox habits, ergonomics, and maintaining long-term passion for software craft without burning out.`,
        category: 'Lifestyle',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        author: alex._id,
      },
    ]);

    console.log('Creating initial comments...');
    await Comment.insertMany([
      {
        content: 'Fantastic article! The explanation of JWT security and Context API structure was super insightful.',
        author: sarah._id,
        post: posts[0]._id,
      },
      {
        content: 'Great writeup! Looking forward to seeing more posts on backend optimization.',
        author: marcus._id,
        post: posts[0]._id,
      },
      {
        content: 'Autonomous agents are indeed the future of software development. Very exciting times!',
        author: alex._id,
        post: posts[1]._id,
      },
      {
        content: 'TypeScript strict mode has saved our team countless hours in production debugging!',
        author: alex._id,
        post: posts[2]._id,
      },
    ]);

    console.log('Database successfully seeded with demo accounts & posts!');
    console.log('Demo Account Credentials:');
    console.log('  1) Email: alex@example.com | Password: password123');
    console.log('  2) Email: sarah@example.com | Password: password123');
    console.log('  3) Email: marcus@example.com | Password: password123');

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
