const {PutObjectCommand} = require("@aws-sdk/client-s3");
const s3 = require("../config/s3config");
const putMetric = require("../services/cloudwatchService")

const uploadDocument = async (profile, user_id) => {
    const s3_key = `${user_id}/profile/${profile.fieldname}_${profile.originalname}`;
    try {
        await s3.send(
        new PutObjectCommand({
           Bucket: process.env.AWS_BUCKET_NAME,
           Key: s3_key,
           Body: profile.buffer,
           ContentType: profile.mimetype
        })
    );
        console.log("File uploaded to S3");

        const baseObjectUrl =
            `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

        const s3_url = `${baseObjectUrl}${s3_key}`;

        return {
            s3_key,
            s3_url
        };
    } catch (err) {
        await putMetric("S3OperationFailureCount", 1);

        console.error("S3 upload failed:", err.message);
        throw err;
    }
};

module.exports = uploadDocument;