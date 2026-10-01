const {PutLogEventsCommand} = require("@aws-sdk/client-cloudwatch-logs");

const {cloudwatchLog} = require("../config/cloudwatchconfig");

const putCloudwatchLog = async (level, message, data = {}) => {

    const logData = {
        timestamp: new Date().toISOString(),
        level: level,
        message: message,
        ...data
    };
    const logMessage = JSON.stringify(logData);

    console.log(logMessage);
    try {
        await cloudwatchLog.send(
            new PutLogEventsCommand({
                logGroupName: process.env.AWS_CLOUDWATCH_LOG_GROUP,
                logStreamName: process.env.AWS_CLOUDWATCH_LOG_STREAM,

                logEvents: [
                    {
                        timestamp: Date.now(),
                        message: logMessage
                    }
                ]
            })
        );
        console.log("CloudWatch log sent successfully");
    } catch (err) {
        console.log(
            "CloudWatch logging failed:",
            err.message
        );
    }
};

module.exports = putCloudwatchLog;