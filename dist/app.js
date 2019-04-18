"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
// import { indexRouter } from "./routes/index";
const userRoutes_1 = require("./routes/userRoutes");
exports.app = express_1.default();
// view engine setup
exports.app.set("views", path_1.default.join(__dirname, "views"));
exports.app.set("view engine", "jade");
exports.app.use(morgan_1.default("dev"));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.use(cookie_parser_1.default());
exports.app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// app.use("/", indexRouter);
exports.app.use("/users", userRoutes_1.userRoutes);
// catch 404 and forward to error handler
exports.app.use((req, res, next) => {
    next(http_errors_1.default(404));
});
// error handler
exports.app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
//# sourceMappingURL=app.js.map