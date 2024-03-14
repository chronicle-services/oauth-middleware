import express from 'express'

import expressHelpers from './src/util/express-helpers.mjs'
import { server } from './src/util/config-utils.mjs'

const app = express();

expressHelpers.loadSettings(app);
expressHelpers.loadInitialMiddleware(app);

app.use(function(req, res, next){
    req.session.test = true;
    if(req.session.authorized == true){
        expressHelpers.foundryProxy(req,res);
    } else {
        next();
    }
});

expressHelpers.loadLoginHandlers(app);

app.listen(server.middleware.port, ()=>{
    console.log(`listening to port ${server.middleware.port}`);
})
