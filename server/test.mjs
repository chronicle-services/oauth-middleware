import express from 'express'
import session from 'express-session'

import config from './src/util/config-utils.mjs'

const app = express();
/*
app.use(session({
    secret: 'your_secret_key', // Change this to your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  }));
*/

console.log({
    secret: 'your_secret_key', // Change this to your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
})

console.log(config.session.options);

app.use(session(config.session.options))

app.use(function(req,res,next){
    res.send(req.session);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});