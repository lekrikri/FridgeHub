import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
}

const generateToken = (id: string): string => {
    const secret = process.env.JWT_SECRET as string;
    const payload: JwtPayload = { id };

    return jwt.sign(payload, secret, { expiresIn: '7d' });
};

const verifyToken = (token: string): JwtPayload | null => {
    try {
        const secret = process.env.JWT_SECRET as string;
        return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
        console.error("Token verification error:", error);
        return null;
    }
};

export { generateToken, verifyToken };
