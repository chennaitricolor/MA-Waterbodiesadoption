const Messenger = require("./messenger.js");

const SENDGRID_API_KEY =
  "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";
const sendGridClient = require("@sendgrid/mail");
sendGridClient.setApiKey(SENDGRID_API_KEY);
const SEND_GRID_FROM = "vaidhyanathan93@gmail.com";
const SEND_GRID_TO =
  "chennaitricolorinwaterbodies@chennaitricolor.freshdesk.com";

function send_mail_to_people(event, messenger, callback) {
  const response = {
    headers: {
      "Access-Control-Allow-Origin": "*"
    }, // CORS requirement
  };

  Object.assign(event, {
    from: SEND_GRID_FROM,
    to: SEND_GRID_TO
  });

  messenger
      .send(event)
      .then(message => {
        // text message sent! ✅
        response.body = JSON.stringify({
          message: " mail successfully sent!"
        });
        callback(null, response);
      })
      .catch(error => {
        response.statusCode = error.status;
        response.body = JSON.stringify({
          message: error.message,
          error: error // eslint-disable-line
        });
        callback(null, response);
      });
}

module.exports.sendMail = (event, context, callback) => {
  const messenger = new Messenger(sendGridClient);

  var qs = require("querystring");
  var http = require("https");

  var options = {
    "method": "POST",
    "hostname": "control.msg91.com",
    "port": null,
    "path": "/api/verifyRequestOTP.php?authkey=134544A3sKJWia5d4c5272&mobile="+event.body.personal_number+"&otp="+event.body.otp,
    "headers": {
      "content-type": "application/x-www-form-urlencoded"
    }
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
       console.log(body.toString());
      if(body.toString().includes("error")) {
        const response = {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }, // CORS requirement
        };
        response.statusCode = "400";
        response.body = JSON.stringify({
          message: "Wrong OTP",
          error: body.toString()// eslint-disable-line
        });
        callback(null, response);
      }else{
        send_mail_to_people(event, messenger, callback);
      }
    });
  });

  req.write(qs.stringify({}));
  req.end();

};


module.exports.sendOtp = (event, context, callback) => {

  var http = require("https");
  template = "Your verification code is ##OTP##."
  var options = {
    "method": "POST",
    "hostname": "control.msg91.com",
    "port": null,
    "path": "/api/sendotp.php?sender=OTPSMS&mobile="+event.body.personal_number+"&authkey=134544A3sKJWia5d4c5272",
    "headers": {}
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.end();
};
