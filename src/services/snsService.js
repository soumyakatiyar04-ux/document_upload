const {PublishCommand} = require('@aws-sdk/client-sns')
const sns = require('../config/snsconfig')
const putMetric = require("../services/cloudwatchService")


const uploadNotification = async(s3_key, originalname)=>{
    const message = {
        event: "DOCUMENT_UPLOADED",
        fileName: originalname,
        s3Key: s3_key,
        uploadedAt: new Date().toDateString()
    };
    const command = new PublishCommand({
        TopicArn: process.env.AWS_SNS_TOPIC_ARN,
        Subject: "Document uploaded",
        Message: JSON.stringify(message)
    })
    const result = await sns.send(command);
    console.log("SNS notification sent");

        await putMetric("SNSPublishFailureCount", 1);

    return result;
};

const deleteNotification = async (s3_key, originalname) => {
    const message = {
        event: "DOCUMENT_DELETED",
        fileName: originalname,
        s3Key: s3_key,
        deletedAt: new Date().toISOString()
    };
    const command = new PublishCommand({
        TopicArn: process.env.AWS_SNS_TOPIC_ARN,
        Subject: "Document Deleted",
        Message: JSON.stringify(message)
    });
    const result = await sns.send(command);
    console.log("Delete SNS notification sent");
    return result;
};


module.exports = {uploadNotification, deleteNotification};