import express from 'express';
import cookieParser from 'cookie-parser';
import corsMiddleware from './middlewares/cors.js';
import dbUtils from './utils/db.js';
import authRoute from './routes/auth.js';
import serviceRoute from './routes/service.js';
import path from 'path';
import 'dotenv/config';
import orderRoute from './routes/order.js';
import clientRoute from './routes/client.js';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async function initDb() {
    try {
        await dbUtils.initializeDbModels();
    } catch (e) {
        console.log(e);
        console.log('COULD NOT CONNECT TO THE DB, retrying in 5 seconds');
        setTimeout(initDb, 5000);
    }
})();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsMiddleware);

app.use('/auth', authRoute);
app.use('/service', serviceRoute);
app.use('/order', orderRoute);
app.use('/client', clientRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(PORT, () => console.log(`Listen on :${PORT}`));
