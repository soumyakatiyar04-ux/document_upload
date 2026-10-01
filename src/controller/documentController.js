const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const connection = require("../config/db");
const uploadDocument = require("../services/s3Service")
const s3 = require("../config/s3config");
const putMetric = require("../services/cloudwatchService")
const {uploadNotification, deleteNotification} = require("../services/snsService");

const getDocuments = async (req,res) =>{
    try {
    let query = `SELECT * from documents`;
    let result = await connection.execute(query);
    res.status(200).json({
      message: "Data feched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Error feching Users",
      error: error.message,
    });
  }
}

const getDocumentById = async (req,res) =>{
    try {
    const {id} = req.params;

    let query = `SELECT * from documents where id = ?`;
    let result = await connection.execute(query, [id]);
    res.status(200).json({
      message: "Data feched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Error feching Users",
      error: error.message,
    });
  }
}

const postDocuments = async (req, res) => {
  try{
    const document = req.file
    const user_id= req.body.user_id

  const s3Data = await uploadDocument(document, user_id);

  const query = `INSERT INTO documents
  (s3_key, s3_url, file_size, mime_type, original_name, user_id)
   VALUES (?, ?, ?, ?, ?, ?)`;

   const [result] = await connection.execute(query,[
      s3Data.s3_key,
      s3Data.s3_url,
      document.size,
      document.mimetype,
      document.originalname,
      user_id
   ]);
   console.log("Data inserted successfully")

   await uploadNotification(s3Data.s3_key, document.originalname)
   console.log("sns nofification sent")

        await putMetric("UploadSuccessCount", 1);


    res.status(201).json({
      message: "Document uploaded successfully",
      data: result
    });
  }catch(error) {
        console.error("Upload document error:", error);
        res.status(500).json({
            message: "Error uploading document",
            error: error.message
        });

        await putMetric("UploadFailureCount", 1);
    }
};

const deleteDocument = async (req, res) => {
    try {
        const {id} = req.params;
        const [documents] = await connection.execute(
            "SELECT s3_key, original_name FROM documents WHERE id = ?",
            [id]
        );
        console.log("Documents:", documents);
        if (documents.length === 0) {
            return res.status(404).json({
                message: "Document not found"
            });
        }
        const s3_key = documents[0].s3_key;
        const originalname = documents[0].original_name;

        console.log("S3 Key:", s3_key);
        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: s3_key
            })
        );
        console.log("File deleted from S3");
        const [result] = await connection.execute(
            "DELETE FROM documents WHERE id = ?",
            [id]
        );
        console.log("data deleted from database")

        await deleteNotification(s3_key, originalname);
        res.status(200).json({
            message: "Document deleted successfully",
            deletedRows: result.affectedRows
        });
    } catch (error) {
        console.error("Delete document error:", error);
        res.status(500).json({
            message: "Error deleting document",
            error: error.message
        });
    }
};

module.exports = {getDocuments, postDocuments, getDocumentById, deleteDocument}