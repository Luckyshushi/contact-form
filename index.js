var express = import('express');
var router = express.Router();
const nodemailer = import("nodemailer");
const { google } = import("googleapis");
const OAuth2 = google.auth.OAuth2;
const path = import('path');
require('dotenv').config();
var cors = import('cors');
var conf = import('./config');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);

if (process.env.NODE_ENV === "production") {
    app.use('/', express.static(path.join(__dirname, '/client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
    });
}
const port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log("Server is running on ${port}")
});

//logic
const oauth2Client = new OAuth2(
    conf.clientId, // ClientID
    conf.clientSecret, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: conf.refreshToken
});

const accessToken = oauth2Client.getAccessToken();

const transport = {
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: conf.USER,
        clientId: conf.clientId,
        clientSecret: conf.clientSecret,
        refreshToken: conf.refreshToken,
        accessToken: accessToken

    }
};
const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

router.post('/send', (req, res, next) => {
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var message = req.body.message;
    var content = `name: ${name} \n phone: ${phone} \n email: ${email} \n message: ${message} `;

    var mail = {
        from: name,
        to: "shushi31072001@gmail.com",
        subject: 'New Message from Contact Form',
        text: content
    };

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            console.log(err);
            res.json({
                status: 'fail'
            })
        } else {
            res.json({
                status: 'success'
            });

        }
        transporter.sendMail({
            from: "shushi31072001@gmail.com",
            to: email,
            subject: "Submission was successful",
            text: `Thank you for contacting us!\n\nForm details\n Name: ${name}\n Phone: ${phone}\n Email: ${email}\n Message: ${message}`
        }, function(error, info){
            if(error) {
                console.log(error);
            } else{
                console.log('Message sent: ' + info.response);
            }
        });
    })
});


