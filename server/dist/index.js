"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const logger_config_1 = __importDefault(require("./config/logger.config"));
const socketHandler_1 = require("./utils/socketHandler");
const passport_middleware_1 = require("./middlewares/passport.middleware");
const user_route_1 = __importDefault(require("./routes/users/user.route"));
const helmet_1 = __importDefault(require("helmet"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Trust proxy setup for deployment reverse proxy
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
// Cors setup
const allowedOrigins = ['http://localhost:3000'];
if (process.env.CLIENT_ORIGIN && !allowedOrigins.find(origin => origin === process.env.CLIENT_ORIGIN)) {
    allowedOrigins.push(process.env.CLIENT_ORIGIN);
}
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log('origin:', origin, 'not allowed');
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
// Session configuration
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 600000,
        secure: process.env.NODE_ENV === 'production'
    }
}));
// Passport middleware
app.use(passport_middleware_1.passportMiddleware);
app.use(passport_middleware_1.passportSessionHandler);
const httpServer = new http_1.Server(app);
const io = new socket_io_1.Server(httpServer, { cors: corsOptions });
(0, socketHandler_1.handleSocketConnection)(io);
app.use('/user', user_route_1.default);
const PORT = JSON.parse(process.env.PORT) || 3030;
const server = httpServer.listen(PORT, () => {
    logger_config_1.default.info(`Server listening at port: ${PORT}`);
});
server.on("error", error => logger_config_1.default.error(`Error in server: ${error}`));
//# sourceMappingURL=index.js.map