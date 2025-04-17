import express, { request } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import otpRouter from './routes/otp.routes.js';
import companyRouter from './routes/company.routes.js'
import userRouter from './routes/user.routes.js'


app.use('/api/v1/otp',otpRouter );
app.use('/api/v1/company',companyRouter);
app.use('/api/v1/users',userRouter);



export default app;
