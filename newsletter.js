

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();
const port = 5000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/da526a3cc8";
    const options = {
        method: "POST",
        auth: "anirudh:66a849edbc1641b4b853ccfbfeaab42c-us21"
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
            console.log(response.statusCode);
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.post("/success", (req, res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || port, () => {
    console.log(`Newsletter app listening on port ${port}`);
});

// API Key
// 66a849edbc1641b4b853ccfbfeaab42c-us21

// List ID
// da526a3cc8