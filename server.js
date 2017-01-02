import express from 'express';
import config from './config.js';
import apiRouter from './api';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import serverRender from './serverRender';
//rendering html when no js available (good for search engines)
import React from 'react';
import data from './src/testData';
import App from './src/components/App';
import ReactDOMServer from 'react-dom/server';
//import './serverRender';

const server = express();

server.set('view engine', 'ejs');

//Important: Search Engines do not read Javascript, so they do not read our React data.
//A way to make our data readable by the search engines: see serverRender.js
// server.get('/', (req, res) => {
//   serverRender()
//     .then(data => {
//       res.render('index', {
//         content: data,
//       });
//     })
//     .catch(console.error);
// });


server.get('/', (req, res) => {
  res.render('index', {
    initialMarkup: ReactDOMServer.renderToString(<App initialData={data.contests}/>),
    initialData: data.contests
  });
});


server.use(express.static('public'));
server.use('/api', apiRouter);
server.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public')
}));


server.listen(config.port, config.host, () => {
  console.log('The server is listening on port ', config.port);
});
