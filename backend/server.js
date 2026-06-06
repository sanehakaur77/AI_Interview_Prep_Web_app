const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./configs/db");

dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
//  routes
const authRoutes = require("./routes/authroutes");
const resumeRoutes = require("./routes/resume.route");
const sessionRoutes = require("./routes/session.routes");
const profileRoutes=require("./routes/profileroutes")
const skillRouter=require('./routes/skillRoutes')
const contactRoutes=require('./routes/contact.routes');
const  assignmentRoutes=require('./routes/assignmentroute');
const  dashboardRoutes=require('./routes/dashboard.routes');
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/session", sessionRoutes);
app.use('/skills',skillRouter);
app.use('/profile',profileRoutes);
app.use('/contact',contactRoutes);
app.use('/assignment',assignmentRoutes);
app.use('/dashboard',dashboardRoutes);



// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("API running...");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
