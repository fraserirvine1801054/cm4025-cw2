import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import * as helmet from 'helmet';
import Template from './../template';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import imgRoutes from './routes/image.routes';
import shopRoutes from './routes/shop.routes';
import devBundle from './devBundle';
import directives from './express-csp';
//modules for server side rendering
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import MainRouter from './../client/MainRouter';
import {StaticRouter} from 'react-router-dom';
import {ServerStyleSheets, ThemeProvider} from '@material-ui/styles';
import theme from './../client/theme';
//end

const CURRENT_WORKING_DIR = process.cwd();

const app = express();

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));
devBundle.compile(app);

//a proxy
let proxy = require('express-http-proxy');

app.use('/api/dadjoke', proxy('https://icanhazdadjoke.com/'));



//parse body params and attach them to the req.body

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(compress());
//secure apps by setting various http headers
/*
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "i.imgur.com","cdn.discordapp.com"],
        },
    },
}));
*/
app.use(
    helmet.contentSecurityPolicy(directives)
)

app.use(cors());

app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', imgRoutes);
app.use('/', shopRoutes);

app.get('*', (req,res) => {
    const sheets = new ServerStyleSheets();
    const context = {};
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            <StaticRouter location={req.url} context={context}>
                <ThemeProvider theme={theme}>
                    <MainRouter/>
                </ThemeProvider>
            </StaticRouter>
        )
    );
    console.log("markup created");


    if (context.url){
        return res.redirect(303, context.url);
    }

    const css = sheets.toString();

    res.status(200).send(Template({
        markup: markup,
        css: css
    }));
});

app.use((err,req,res,next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error" : err.name + ": " + err.message});
    } else if (err) {
        res.status(400).json({"error" : err.name + ": " + err.message});
        console.log(err);
    }
});

app.use((err,req,res,next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error":err.name + ": " + err.message});
    } else if (err) {
        res.status(400).json({"error": err.name + ": " + err.message});
        console.log(err);
    }
});





export default app