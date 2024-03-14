import session from 'express-session'
import { static as expressStatic } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import * as path from 'path'

import discordAuth from '../modules/discord-auth.mjs'
import { args, server, session as sessionConfig } from './config-utils.mjs'

//Options
const sendFileOptions = {
    root: path.join("public/")
}

//Middleware
const foundryProxy = createProxyMiddleware({
    target: server.foundry.url,
    changeOrigin: true,
    ws: true
});

const viteProxy = args.useVite ? createProxyMiddleware({
    target: server.vite.url,
    changeOrigin: false
}) : null

const sessionMiddleware = session(sessionConfig.options);
const staticMiddleware = expressStatic(path.join("public/"));

//Handlers
async function loginSessionHandler(req,res){
    if(req.query.code != null && req.query.code.trim() !== ''){
        req.session.authorized = await discordAuth.verifyUser(req.query.code);
        
        const sendFilePromise = getSendFilePromise(res, 'views/callback.html', sendFileOptions);
        await sendFilePromise;
        
        res.end();
        return;
    }

    if(process.env.NODE_ENV == 'local' &&
       args.useVite){
        viteProxy(req, res);
    } else {
        const sendFilePromise = getSendFilePromise(res, 'views/app/index.html', sendFileOptions);
        await sendFilePromise;
        
        res.end();
        return;
    }
}

//Helpers
function getSendFilePromise(res, path, sendFileOptions, callback){
    return new Promise(function(resolve, reject){
        res.status(200).sendFile(path, sendFileOptions, function(err){
            if(callback){
                callback(err);
            }

            if(err){
                resolve('sendFile unsuccessful')
            } else {
                resolve('sendFile successful');
            }
        });
    });
}

//Exports
export default {
    loadSettings: function(app){
        if(app.get('env') == 'production' ||
           app.get('env') == 'development'){
            app.set('trust proxy', 1);
        }
    },
    loadInitialMiddleware: function(app){
        app.use(sessionMiddleware);
    },
    loadLoginHandlers(app){
        app.use('/static', staticMiddleware);
        app.use(loginSessionHandler);
    },
    foundryProxy
}