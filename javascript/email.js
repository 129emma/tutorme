/**
 * Created by Administer on 22/01/2018.
 */
const mailer = require('nodemailer');
const fs = require('fs');
//function se(receiver, subject, msg ) {


    var content = "";

    fs.readFile('../email_template/confirmation.html', function(err, data) {
    if(err){
        throw err;

    }
    return res.end();
    });

    var transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nz.tutorme@gmail.com',
            pass: 'BryanJongwooVanie2017'
        }
    });

    var mailOptions = {
        from: 'nz.tutorme@gmail.com',
        to: 'mrknight21@hotmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        html:'<h1>hello word<h1>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
//}