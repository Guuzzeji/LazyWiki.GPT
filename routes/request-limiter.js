const requests = {};

export default function requestLimter(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    const timeFrame = 0.5 * 60 * 1000; // 5 minutes

    if (requests[ip] && requests[ip] > now - timeFrame) {
        return res.status(429).json({ message: 'Too many requests' });
    }

    requests[ip] = now;
    next();
}