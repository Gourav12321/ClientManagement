import React, { useEffect, useState } from "react";
import axios from "axios";
import Edit from "./Edit";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

function View({ setNewOpen, fetchClients, clientId, handleDelete }) {
  const [data, setData] = useState({});
  const [updatedNotes, setUpdatedNotes] = useState("");
  const [newOpen2, setNewOpen2] = useState(false);
  const [viewUploads, setViewUploads] = useState(false);
  const [documents, setDocuments] = useState([]);

  const handleDownloadPDF = () => {
    window.open(`http://localhost:3000/api/generatePDF/${clientId}`, '_blank');
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/clientById/${clientId}`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/clientDocuments/${clientId}`);
      
      if (response.data && Array.isArray(response.data.documents)) {
        setDocuments(response.data.documents.map(doc => {
          const normalizedDoc = doc.replace(/^(uploads[\\/])/, ''); 
      
          return `http://localhost:3000/uploads/${normalizedDoc}`; 
        }));
      } else {
        console.warn("Unexpected response format:", response.data);
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const handleSaveNote = async () => {
    if (!updatedNotes.trim()) {
      console.log("Note cannot be empty");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/updatedNotes", {
        _id: data._id,
        updatedNotes,
      });

      if (response.status === 200) {
        fetchClients();
        fetchData();
        setUpdatedNotes("");
      } else {
        console.log("Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteClient = async () => {
    await handleDelete(clientId);
    fetchClients();
    setNewOpen(false);
  };

 

  return (
    <div className="overflow-y-auto h-[80%]">
      <div id="pdf-content">
        {data && (
          <>
            <div className="flex w-full border">
              <p className="font-bold w-[40%] text-start bg-blue-800 text-white p-2">Client Name:</p>
              <p className="p-2 w-[60%] text-start">{data.clientName}</p>
            </div>
            <div className="flex w-full border">
              <p className="font-bold w-[40%] text-start bg-blue-800 text-white p-2">Contact Info:</p>
              <p className="p-2 w-[60%] text-start">{data.contactInfo}</p>
            </div>
            <div className="flex w-full border">
              <p className="font-bold w-[40%] text-start bg-blue-800 text-white p-2">Received Date:</p>
              <p className="p-2 w-[60%] text-start">{data.receivedDate}</p>
            </div>
            <div className="flex w-full border">
              <p className="font-bold w-[40%] text-start bg-blue-800 text-white p-2">Inventory Received:</p>
              <p className="p-2 w-[60%] text-start">{data.inventoryRecieved}</p>
            </div>
            <div className="flex w-full border">
              <p className="font-bold w-[40%] text-start bg-blue-800 text-white p-2">Inventory Image/Document/Video:</p>
              <button
                className="text-blue-800 font-bold pl-2"
                onClick={() => {
                  fetchDocuments(); 
                  setViewUploads(true); 
                }}
              >
                View File
              </button>
            </div>
            <div className="flex w-full border">
              <p className="font-bold w-[40%] text-start bg-blue-800 text-white p-2">Reported Issue:</p>
              <p className="p-2 w-[60%] text-start">{data.reportedIssue}</p>
            </div>
            <div className="flex w-full border">
              <p className="font-bold w-[40%] text-start bg-blue-800 text-white p-2">Client Notes:</p>
              <p className="p-2 w-[60%] text-start">{data.clientNotes}</p>
            </div>
            <div className="flex w-full border">
              <p className="font-bold w-[40%] text-start bg-blue-800 text-white p-2">Assigned Technician:</p>
              <p className="p-2 w-[60%] text-start">{data.assignedTechnician}</p>
            </div>
            <div className="flex w-full border">
              <p className="font-bold w-[40%] text-start bg-blue-800 text-white p-2">Estimate Amount:</p>
              <p className="p-2 w-[60%] text-start">{data.estimateAmount}</p>
            </div>
            <div className="flex w-full border">
              <p className="font-bold w-[40%] text-start bg-blue-800 text-white p-2">Deadline:</p>
              <p className="p-2 w-[60%] text-start">{data.Deadline}</p>
            </div>
            <div className="flex w-full border">
              <p className="font-bold w-[40%] text-start bg-blue-800 text-white p-2">Status:</p>
              <p className="p-2 w-[60%] text-start">{data.status}</p>
            </div>
            <div className="py-5">
              <p className="text-start font-bold text-[15px]">Add or Update Note:</p>
              <textarea
                className="w-full border-[2px] mb-3 p-2 text-[14px]"
                rows="3"
                name="updatedNotes"
                value={updatedNotes}
                onChange={(e) => setUpdatedNotes(e.target.value)}
              />
              <button
                className="bg-blue-800 text-white py-2 px-4 rounded w-full"
                onClick={handleSaveNote}
              >
                Save Note
              </button>
            </div>
            <div className="flex gap-3">
              <button
                className="text-blue-800 font-bold"
                onClick={() => setNewOpen2(true)} 
              >
                Edit
              </button>
              {newOpen2 && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex justify-center items-center">
                  <div className="bg-white p-8 rounded-lg shadow-lg w-[70%] h-[90%] relative">
                    <button
                      className="absolute right-2 -top-2 text-red-600 text-2xl font-bold py-2 px-4 rounded ml-4"
                      onClick={() => setNewOpen2(false)}
                    >
                      x
                    </button>
                    <h2 className="text-xl font-bold mb-4 uppercase bg-blue-800 text-white p-4 rounded-t-xl text-center">
                      Edit Job Sheet
                    </h2>
                    <Edit
                      setNewOpen={setNewOpen2}
                      fetchClients={fetchClients}
                      clientId={clientId}
                    />
                  </div>
                </div>
              )}
              <button
                className="text-blue-800 font-bold"
                onClick={handleDeleteClient}
              >
                Delete
              </button>
            </div>
            <div>
              <button
                onClick={() => setNewOpen(false)}
                className="text-blue-800 font-bold"
              >
                Back
              </button>
            </div>
            <div className="py-5">
              
            </div>
            <button
        className="bg-slate-200 text-black py-2 px-4 rounded"
        onClick={handleDownloadPDF}
      >
        Save as PDF
      </button>
          </>
        )}

        {/* View Uploads Modal */}
        {viewUploads && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[70%] h-[90%] relative">
              <button
                className="absolute right-2 -top-2 text-red-600 text-2xl font-bold py-2 px-4 rounded ml-4"
                onClick={() => setViewUploads(false)}
              >
                x
              </button>
              <h2 className="text-xl font-bold mb-4 uppercase bg-blue-800 text-white p-4 rounded-t-xl text-center">
                Uploaded Documents
              </h2>

              <div className="grid grid-cols-4 overflow-auto h-[70%]"> 
                {documents && documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <a
                        href={doc} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-700 text-xl"
                      >
                        Document {index+1}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="col-span-4 text-center">No documents available.</p>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  className="text-white bg-blue-800 font-bold py-2 px-4 rounded"
                  onClick={() => setViewUploads(false)}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default View;
