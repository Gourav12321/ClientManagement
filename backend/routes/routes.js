const express = require('express');
const { AddClient, getClient, editClient, deleteClient, getClientById, updatedNotes, generatePDF } = require('../controller/controller');
const multer = require('multer');
const path = require('path');
const { Client } = require('../model/clientModel');

const router = express.Router();

// Configure Multer storage with file extension handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    // Extract the file extension
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.post('/client', upload.array('files', 10), AddClient);
router.get('/client', getClient);
router.get('/clientById/:id', getClientById);
router.post('/updatedNotes', updatedNotes);
router.put('/client', upload.array('files', 10), editClient);
router.delete('/client', deleteClient);

router.get('/clientDocuments/:clientId', async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({ documents: client.file }); 
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/generatePDF/:clientId', generatePDF);


module.exports = router;
