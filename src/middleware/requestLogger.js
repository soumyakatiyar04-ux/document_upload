const { v4: uuidv4 } = require("uuid");

const putCloudwatchLog = require("../utils/logger");
const putMetric = require("../services/cloudwatchService");

const loggingMiddleware = (req, res, next) => {

    const requestId = uuidv4();
    const startTime = Date.now();

    req.requestId = requestId;
    res.on("finish", async () => {
        const duration = Date.now() - startTime;

        const level = res.statusCode >= 400
            ? "ERROR"
            : "INFO";

        await putCloudwatchLog(
            level,
            "Request completed",
            {
                requestId,
                userId: req.user?.uid,
                route: req.originalUrl,
                statusCode: res.statusCode,
                duration
            }
        );

        //  Custom Metrics
        await putMetric("RequestCount", 1);

        await putMetric("RequestLatency", duration);

        if (res.statusCode >= 500) {
            await putMetric("5xxErrorCount", 1);
        }
    });
    next();
};

module.exports = loggingMiddleware;