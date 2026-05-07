import './instrument';
import { app } from "./app";
import { logger } from "./lib/logger";

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, ()=>{
   logger.info({port: PORT, env:process.env.NODE_ENV}, 'API SERVER STARTED')
});