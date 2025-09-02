import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './Config/Db.js';
import userRouter from './Routes/userRoute.js';
import taskRouter from './Routes/taskRoute.js';

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
await connectDB();

app.use(cors({
    origin: ['http://localhost:5173','https://progress-tracker-dun.vercel.app'],
    credentials: true
  }));

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.use(express.json());

app.use('/user',userRouter);
app.use('/api/user',taskRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
