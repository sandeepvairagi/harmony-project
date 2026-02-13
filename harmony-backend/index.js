const express = require('express');
const app = express();
const dotenv = require("dotenv");
const dbConnect = require("./Database/database.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const AuthRoute = require("./Route/authRoute.js");
const UserRoute = require("./Route/userRoute.js");
const InstructorRoute = require("./Route/instructorRoute.js");
const bookingRoute = require("./Route/bookingRoute.js");
const streakRoute = require("./Route/streakRoute.js");

dotenv.config();
const PORT = process.env.PORT || 5000;


// middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
)

// Routes
app.use("/api/v1/auth",AuthRoute);
app.use("/api/v1/user",UserRoute);
app.use("/api/v1/instructor",InstructorRoute);
app.use("/api/v1/bookings",bookingRoute);
app.use("/api/v1/streak",streakRoute);

app.get('/', (req,res)=>{
    res.send('Hey, I am Backend Server Route');
})

app.listen(PORT, ()=>{
    dbConnect();
    console.log(`Server Started at Port ${PORT}`);
})