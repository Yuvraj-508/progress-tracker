import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './Config/Db.js';
import userRouter from './Routes/userRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;
await connectDB();

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
  }));

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.use(express.json());

app.use('/user',userRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
