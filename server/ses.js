const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1",
});


exports.sendEmail = (to, body, subj) => ses.sendEmail({
    Source: "Admin <opsychar@gmail.com>",
    Destination: {
        ToAddresses: [to],
    },
    Message: {
        Body: {
            Text: {
                Data:
                   body,
            },
        },
        Subject: {
            Data: subj,
        },
    },
})
    .promise()
    .then(() => console.log("it worked!"))
    .catch((err) => console.log(err));