const express = require('express');

const {getDocuments, postDocuments, getDocumentById, deleteDocument} = require('../controller/documentController')
const upload = require('../middleware/uploadMiddleware')
const authMiddleware = require("../middleware/authMiddleware");


const documentRouter = express.Router();

documentRouter.post ('/documents/upload',authMiddleware, upload.single("document"), postDocuments)
documentRouter.get ('/documents',authMiddleware, getDocuments)
documentRouter.get ('/documents/:id/download',authMiddleware, getDocumentById)
documentRouter.delete ('/documents/:id',authMiddleware, deleteDocument)


module.exports = documentRouter;