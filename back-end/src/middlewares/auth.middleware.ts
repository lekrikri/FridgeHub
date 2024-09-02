import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
	user?: { id: string };
}

const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): any => {
	const authHeader = req.header("Authorization");

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			success: false,
			message: "No token, authorization denied",
		});
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as {
			id: string;
		};

		req.user = { id: decoded.id };
		next();
	} catch (err) {
		res.status(401).json({ success: false, message: "Token is not valid" });
		return;
	}
};

export default authMiddleware;
