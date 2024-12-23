import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectPostgres } from './config/postgres';
import { connectMongoDB } from './config/mongodb';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import claimRoutes from './routes/claimRoutes';
import repairCentreRoutes from './routes/repairCentreRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectPostgres();

connectMongoDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/users', userRoutes);

app.use('/auth', authRoutes);

app.use('/claims', claimRoutes);

app.use('/repair-centres', repairCentreRoutes);

app.use('/feedback', feedbackRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
