/**
 * Created by Administer on 22/01/2018.
 */
const mailer = require('nodemailer');
const fs = require('fs');
var ejs = require('ejs');


function trans_setup(){
    return mailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nz.tutorme@gmail.com',
            pass: 'BryanJongwooVanie2017'
        }
    });
}

//this email function can send an templated email with context to a single person. It also can send to multiple recipient when the recipient argument is a list of receipient emails. However, when using this function to send emails to multiple receiver, the user context can not be customized. If require customized email for several user under the same template please use the function called mult_email.
function normal_email(receiver, subject, template, context ) {


    var transporter = trans_setup();

    var compiled = ejs.compile(fs.readFileSync('../email_template/' + template, 'utf8'));
    //check if single user or an array of user emails.
    if(typeof (receiver) !== String && receiver.length > 1){
        receiver.toString();
    }

    var html = compiled(context);
    var mailOptions = {
        from: 'Tutorme',
        to: receiver,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

//this is the multiple customized emai function, the receiver should an array of useremails, and the context should also be an JSON object that contains the context of multiple user info.
function mult_email(receiver, subject, template, context ) {
    var transporter = trans_setup();

    const compiled = ejs.compile(fs.readFileSync('../email_template/' + template, 'utf8'));

    var promises = [];

    receiver.map(function (user, index) {
        promises.push(new Promise(function(resolve, reject) {
            var html = compiled(context[index]);
            transporter.sendMail({
                from: 'Tutorme',
                to: user,
                subject: subject,
                html: html
            }, function(err, info) {
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            });
        }));
    });
    Promise.all(promises).then(function(infos) { console.log(infos) }, function(err) { console.log(err) });
}

/*mult_email(["mrknight21@hotmail.com", "mche618@aucklanduni.ac.nz", "yzhb363@aucklanduni.ac.nz", "ljam763@aucklanduni.ac.nz", "jwon117@aucklanduni.ac.nz", "vugn217@aucklanduni.ac.nz", "xche824@aucklanduni.ac.nz"], "Come join Tutorme!!", "ad.ejs", [{username: "hansomeman"}, {username: "better man!"}, {username:"Emma Zhao"}, {username:"James Lam"}, {username:"Fab Fat Flat woo"}, {username:"Vanie Nguyen"}, {username:"XinJian Che"}]);*/

module.exports = {
    "normal_email": normal_email,
    "multi_email": mult_email
};