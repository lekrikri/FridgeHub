import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log("test")
	const error = new Error("Not Found");
	res.status(404).json({
        success: false,
		message: error.message,
	});
};

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(err.stack);
	res.status(500).json({
        success: false,
		message: "Something went wrong!",
	});
};
