const multer = require('multer');
const { Client } = require('../model/clientModel');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
// Set up multer for file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });



exports.generatePDF = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Fetch client data from DB
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Create a new PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=client-${clientId}.pdf`);

    doc.pipe(res);

    const logoPath =  doc.fontSize(30).fillColor('#007bff').text('Gourav Traders', { align: 'center' }).moveDown();;
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 150 });
    }

    // Header Section
    doc.fontSize(20).fillColor('#007bff').text('Client Report', { align: 'center' }).moveDown();
    doc.fontSize(10).fillColor('gray').text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' }).moveDown(2);

    // Horizontal line
    doc.moveTo(50, 150).lineTo(550, 150).stroke();

    // Client Information
    doc.fontSize(14).fillColor('black').text('Client Details', { underline: true }).moveDown(0.5);
    const clientDetails = [
      { label: "Client Name", value: client.clientName },
      { label: "Contact Info", value: client.contactInfo },
      { label: "Received Date", value: client.receivedDate },
      { label: "Reported Issue", value: client.reportedIssue },
      { label: "Assigned Technician", value: client.assignedTechnician },
      { label: "Estimate Amount", value: `₹${client.estimateAmount}` },
      { label: "Deadline", value: client.Deadline },
      { label: "Status", value: client.status }
    ];

    clientDetails.forEach(detail => {
      doc.fontSize(12).fillColor('black').text(`${detail.label}: `, { continued: true, underline: false })
        .fillColor('gray').text(detail.value, { underline: false }).moveDown(0.5);
    });

    doc.moveDown().moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Client Notes
    doc.moveDown(1).fontSize(14).fillColor('black').text('Client Notes:', { underline: true }).moveDown(0.5);
    doc.fontSize(12).fillColor('gray').text(client.clientNotes || 'No notes available').moveDown(2);

    doc.moveDown().moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Footer with page numbers
    const footerYPosition = 750;
    doc.fontSize(10).fillColor('gray').text('Company Name - Ghackk Technologies', 50, footerYPosition, { align: 'left' });
    doc.fontSize(10).fillColor('gray').text('Page 1 of 1', 50, footerYPosition, { align: 'right' });

    doc.end();

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error generating PDF" });
  }
};



exports.AddClient = async (req, res) => {
  try {
    const {
      clientName,
      contactInfo,
      receivedDate,
      inventoryRecieved,
      reportedIssue,
      clientNotes,
      assignedTechnician,
      estimateAmount,
      Deadline,
      status,
    } = req.body;

    const filePaths = req.files.map(file => file.path); 
   
    const data = new Client({
      clientName,
      contactInfo,
      receivedDate,
      inventoryRecieved,
      file: filePaths,
      reportedIssue,
      clientNotes,
      assignedTechnician,
      estimateAmount,
      Deadline,
      status,
    });

    await data.save();
    res.status(200).json({ message: "Client added"});

  }catch(error){
    console.log(error);
  }
}


exports.getClient = async (req, res)=>{
    try{
        // fetching the all data and save into data 
    const data = await Client.find();

    // sending the response to user 
    res.status(200).json({message:"All Client Data", data : data});
    }catch(error){
        console.log(error);
    }
};
exports.getClientById = async (req, res) => {
    try {
      // fetching the clientId from the route parameter
      const clientId = req.params.id;
     
      // fetching the client data by ID
      const data = await Client.findById({_id:clientId});
  
      // sending the response to user
      if (data) {
        res.status(200).json({ message: "Client Data", data: data });
      } else {
        res.status(404).json({ message: "Client not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  exports.updatedNotes = async (req, res) => {
    try {
      const { _id, updatedNotes } = req.body;
  
      // Find the client and update the notes
      const updatedClient = await Client.findOneAndUpdate(
        { _id: _id },  // Find by _id
        { $set: { clientNotes: updatedNotes } },  // Update the "updatedNotes" field
        { new: true }  // Return the updated document
      );
  
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
  
      // Send the updated client data in the response
      res.status(200).json({
        message: "Client notes updated successfully",
        data: updatedClient
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating client notes", error });
    }
  };
  
  
  exports.editClient = async (req, res) => {
    try {
      const { _id, clientName, contactInfo, receivedDate, inventoryReceived, reportedIssue, clientNotes, assignedTechnician, estimateAmount, deadline, status } = req.body;
      const files = req.files.map(file => file.path);  // Map uploaded files to their paths
  
      if (!_id) {
        return res.status(400).json({ message: "Client ID is required!" });
      }
  
      const updatedClient = await Client.findByIdAndUpdate(
        _id,
        {
          clientName,
          contactInfo,
          receivedDate,
          inventoryReceived,
          reportedIssue,
          clientNotes,
          assignedTechnician,
          estimateAmount,
          deadline,
          status,
          file: files.length > 0 ? files : undefined 
        },
        { new: true }
      );
  
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found!" });
      }
  
      res.status(200).json({ message: "Client updated successfully!", data: updatedClient });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
};


exports.deleteClient = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "Client ID is required!" });
        }

        // Find client by ID and delete
        await Client.findOneAndDelete({ _id });

        res.status(200).json({ message: "Client deleted successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};
