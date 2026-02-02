import express from 'express'
import dotenv from 'dotenv';
import logger from 'morgan';
import routes from './routes/index.route';
import sendJson from './middlewares/response';
import ErrorHandler from './middlewares/error';
import connect from './middlewares/database';
import config from './configuration';

import './middlewares/passport';

// Configure Environment.
dotenv.config();

// Error Handler.
const errHandler = new ErrorHandler();

// Database connector.
connect();

// Initialize App.
const app = express();

// Assigning Middleware Function to send Responses in standared format.
(app.response as any)['sendJson'] = sendJson;

const port = config.port;

app.use(express.json());

// Logger to log requests.
app.use(logger('dev'))

// Routing for the whole app.
app.use('/',routes);

// Error Handler Stack.
app.use(errHandler.converter);
app.use(errHandler.notFound);
app.use(errHandler.handler);

// Starting server.
app.listen(port, () => console.log("Server is up and running at ", port));