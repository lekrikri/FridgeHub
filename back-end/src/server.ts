import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// import router from "./src/routes";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";
import indexRoutes from "./routes/index";
import connectDB from "./config/db.config";
import authMiddleware from "./middlewares/auth.middleware";


dotenv.config();

const port = !process.env.PORT
	? console.log(`No port value specified...`)
	: process.env.PORT || 8000;

const app: Express = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
	credentials: true,
};

app.use('/images', express.static('FridgeHub/assets/images'));

app.use(cors(corsOptions));

// Routes
app.use(`/${process.env.API_VERSION}`, indexRoutes);

// Middleware
// app.use(notFoundHandler);
app.use(errorHandler);

connectDB()
	.then(() => {
		console.log("MongoDB connected");
		app.listen(port, () => {
			console.log(`[server]: Server is running at http://localhost:${port}/${process.env.API_VERSION}`);
		});
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
		process.exit(1);
	});