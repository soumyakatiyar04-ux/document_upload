const {CloudWatchLogsClient}= require('@aws-sdk/client-cloudwatch-logs')
const {CloudWatchClient}= require('@aws-sdk/client-cloudwatch')

const cloudwatchLog = new CloudWatchLogsClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});


const cloudWatch = new CloudWatchClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})


module.exports = {cloudwatchLog, cloudWatch}