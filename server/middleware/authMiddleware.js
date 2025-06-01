const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if(token && token.startsWith("Bearer ")) {
        try{
            const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            console.error("Token error", error);
            res.status(401).json({ error: "Not authorized, token failed"});
        }
    } else {
        res.status(401).json({ error: "No token, authorization denied" });
    }
};

module.exports = { protect };