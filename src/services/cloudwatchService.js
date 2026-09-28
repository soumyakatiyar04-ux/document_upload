const {PutMetricDataCommand} = require("@aws-sdk/client-cloudwatch");

const { cloudWatch } = require("../config/cloudwatchconfig");

const putMetric = async (metricName, value = 1) => {
    try {
        const command = new PutMetricDataCommand({
            Namespace: "documentapplication",
            MetricData: [
                {
                    MetricName: metricName,
                    Dimensions: [
                        {
                            Name: "Environment",
                            Value: "local"
                        }
                    ],
                    Value: value,
                    Unit: metricName === "RequestLatency"
                        ? "Milliseconds"
                        : "Count",

                    Timestamp: new Date()
                }
            ]
        });
        await cloudWatch.send(command);
        console.log(
            `CloudWatch metric sent: ${metricName} = ${value}`
        );
    } catch (error) {

        console.error(
            "CloudWatch metric failed:",
            error.message
        );
    }
};

module.exports = putMetric;