import {Router} from 'express';

export const productRouter = Router();

productRouter.get('/', (_req, res)=>{
    //TODO: paginated DB Query
    res.json({products: [], page:1, total:0})
});

productRouter.get('/:slug', (req, res)=>{
    // TODO: DB query by slug
    res.json({slug: req.params.slug});
});