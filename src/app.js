require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

// create a new user in our database
app.post("/register", async(req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            });

            const token = await registerEmployee.generateAuthToken();

            const registered = await registerEmployee.save();
            res.status(201).render("index");
        } else {
            res.send("Password are not matching");
        }
    } catch(error) {
        res.status(400).send(error);
    }
});

// login check
app.post("/login", async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});

        const isMatch = await bcrypt.compare(password, useremail.password);
        
        const token = await useremail.generateAuthToken();
        console.log(`the token part ${token}`);

        if(isMatch) {
            res.status(201).render("index");
        } else {
            res.send("Invalid Email or Password");
        }
    } catch(error) {
        res.status(400).send("Invalid Email or Password");
    }
});

// const securePassword = async(password) => {
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     const passwordMatch = await bcrypt.compare(password, passwordHash);
//     console.log(passwordMatch);
// }

// securePassword("thapa@123");

// const createToken = async () => {
//     const token = await jwt.sign({_id: "64da42e43ba9896e1dfe35db"}, "mynameisadilhameedandiamastudentintheuniversity",
//     {expiresIn: "5 seconds"});
//     console.log(token);

//     const userVer = jwt.verify(token, "mynameisadilhameedandiamastudentintheuniversity");
//     console.log(userVer);
// }

// createToken();

app.listen(port, (req, res) => {
    console.log(`Connection is listening on port no. ${port}`);
});