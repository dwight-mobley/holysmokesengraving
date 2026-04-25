import express from 'express';
import {errorHandler} from './middleware/errorHandler';
import {productRouter} from './routes/products';


const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());

//Health Check Route
app.get('/health', (_req, res)=>{
    res.json({status:'ok'});
});

app.use('/products', productRouter);

app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`API running on http://localhost:${PORT}`)
});