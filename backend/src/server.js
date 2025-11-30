import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks.js';
dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.get('/', (req,res)=> res.json({ok:true, msg:'API running'}));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/advanceddb';
mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=> {
  app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
})
.catch(err => { console.error('Mongo connect error', err); process.exit(1); });
