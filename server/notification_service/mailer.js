var nodemailer = require ('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
//var EmailTemplate = require('email-templates').Email.Template;
var schedule = require('node-schedule');

module.exports = {
  signupEmail: function(username){
    var options = {
      // auth: {
      //   api_user: 
      //   api_key: 
      // }
    };

    var mailer = nodemailer.createTransport(sgTransport(options));

    var email = {
      from: '"Marco Polo" <trip.planner.co@gmail.com>',
      to: username,
      subject: 'Welcome to Trip Planner',
      text: 'Be prepared to get shit done so you can then relax and have some fun',
      html: '<b>Be prepared to get shit done so you can then relax and have some fun</b>'
    };

    mailer.sendMail(email, function(err, res){
        if (err ){
          console.log(error);
        }
        else {
          console.log('Message sent: ' , res);
        }
    });
  },
  
  signinEmail: function(username){
    var options = {
      auth: {
        // api_user: 
        // api_key: 
      }
    };

    var mailer = nodemailer.createTransport(sgTransport(options));

    var email = {
      from: '"Marco Polo" <trip.planner.co@gmail.com>',
      to: username,
      subject: 'Account Sign-in',
      text: 'Someone signed into your Trip Planner account....hope it was you.',
      html: '<b>Someone signed into your Trip Planner account....hope it was you.</b>'
    };

    mailer.sendMail(email, function(err, res){
      if (err ){
        console.log(error);
      } else {
        console.log('Message sent: ' , res);
      }
    });
  },
  
  reminderEmail: function(username){
    var options = {
      auth: {
        // api_user:
        // api_key: 
      }
    };

    var mailer = nodemailer.createTransport(sgTransport(options));

    var email = {
      from: '"Marco Polo" <trip.planner.co@gmail.com>',
      to: username,
      subject: 'Reminder: Booking',
      text: 'Get your things booked.',
      html: '<b>Get your things booked.</b>'
    };

    console.log('look here', email.to)
    mailer.sendMail(email, function(err, res){
      if (err ){
        console.log(error);
      } else {
        console.log('Message sent: ' , res);
      }
    });
  }
  
  // pwdReminder: function(username, password){
  //   var sendPwdReminder = transporter.templateSender(new EmailTemplate('../templates/password_reminder'), {
  //     from: 'trip.planner.co@gmail.com'
  //   });
    
  //   sendPwdReminder({
  //     to: username,
  //     subject: 'Password Reminder'
  //   }, {
  //     username: username,
  //     password: password,
  //   }, function(err, res){
  //     if(err){
  //       console.log('error');
  //     }
  //     console.log('Password reminder sent')
  //   }
  //   });
  // },

}



