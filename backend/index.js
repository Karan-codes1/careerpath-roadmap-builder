import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import AuthRouter from './routes/authRouter.js'
import RoadmapRouter from './routes/RoadmapRouter.js'
import MilestoneRouter from './routes/MilestoneRouter.js'
import ResourceRouter from './routes/ResourceRouter.js'
import BookmarkRouter from './routes/BookmarkRouter.js'
import ProfileRouter from './routes/ProfileRouter.js'
import DashboardRouter from './routes/DashboardRouter.js'
import AIRouter from './routes/AIRouter.js'
import QuizRouter from './routes/QuizRouter.js'

import { connectDB } from './models/db.js';
import { generalLimiter } from './Middlewares/RateLimit.js';

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const app = express();
const port = process.env.PORT || 8080;

// The hosting platform (Render) puts one proxy in front of this app. Trusting
// it makes req.ip the visitor's real address instead of the proxy's — without
// this, every visitor would share a single rate-limit counter.
app.set('trust proxy', 1);

// CORS MUST BE FIRST
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://careerpath-roadmap-builder.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



// Rate limiting comes AFTER cors so that a 429 response still carries the CORS
// headers — otherwise the browser reports a CORS error instead of the message.
app.use(generalLimiter);

// Other middleware
app.use(express.json());
// Populates req.cookies, which is where the auth token now lives
app.use(cookieParser());

// Connect to DB
await connectDB();

// Routes
app.use('/auth', AuthRouter);
app.use('/roadmap', RoadmapRouter);
app.use('/milestone', MilestoneRouter);
app.use('/resource', ResourceRouter);
app.use('/bookmarks', BookmarkRouter);
app.use('/profile', ProfileRouter);
app.use('/dashboard', DashboardRouter);
app.use('/ai', AIRouter);
app.use('/quiz', QuizRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});