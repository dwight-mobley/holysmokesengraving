import express from 'express';
import {errorHandler} from './middleware/errorHandler';
import {productRouter} from './routes/products';
import { orderRouter } from './routes/orders';
import { customerRouter } from './routes/customer';
import { adminRouter } from './routes/admin';
import { requireApiKey } from './middleware/requireApiKey';


export const app = express();


app.use(express.json());

//Health Check Route
app.get('/health', (_req, res)=>{
    res.json({status:'ok'});
});

app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/customers', customerRouter);
app.use('/admin', requireApiKey, adminRouter);

app.use(errorHandler);