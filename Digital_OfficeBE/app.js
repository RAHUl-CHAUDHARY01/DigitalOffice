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

import orgRouter from './routes/org.routes.js';
import inviteRouter from './routes/invite.route.js';
app.use('/api/v1/org', orgRouter);
app.use('/api/v1/invite', inviteRouter);
export { app };
