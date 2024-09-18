import React, { useState } from "react";
import axios from "axios";

const initialState = {
  clientId: "",
  clientName: "",
  contactInfo: "",
  receivedDate: "",
  inventoryRecieved: "",
  files: [],
  reportedIssue: "",
  clientNotes: "",
  assignedTechnician: "",
  estimateAmount: "",
  Deadline: "",
  status: "",
};

function New({ setNewOpen, fetchClients }) {
  const [newClient, setNewClient] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewClient((prevState) => ({
      ...prevState,
      files: e.target.files,
    }));
  };

  const handleNewClientSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(newClient).forEach((key) => {
      if (key === "files") {
        for (let i = 0; i < newClient.files.length; i++) {
          formData.append("files", newClient.files[i]);
        }
      } else {
        formData.append(key, newClient[key]);
      }
    });

    try {
      await axios.post("http://localhost:3000/api/client", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setNewOpen(false);
      fetchClients();
      setNewClient(initialState);
    } catch (error) {
      console.log("Error adding client:", error);
    }
  };

  return (
    <div className="overflow-y-auto h-[80%]">
      <form onSubmit={handleNewClientSubmit} encType="multipart/form-data">
        {/* <label htmlFor="clientId" className="font-bold hidden">Client ID:</label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="text"
          name="clientId"
          value={newClient.clientId}
          onChange={handleInputChange}

        /> */}

        <label htmlFor="clientName" className="font-bold">Client Name:</label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="text"
          name="clientName"
          value={newClient.clientName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="contactInfo" className="font-bold">Contact Info:</label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="text" 
          name="contactInfo"
          value={newClient.contactInfo}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
              handleInputChange(e);
            }
          }}
          maxLength={10} 
          placeholder="Enter 10 digit contact number"
          required
        />

        <label htmlFor="receivedDate" className="font-bold">Received Date:</label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="date"
          name="receivedDate"
          value={newClient.receivedDate}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="inventoryRecieved" className="font-bold">Inventory Received:</label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="text"
          name="inventoryRecieved"
          value={newClient.inventoryRecieved}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="file" className="font-bold">Upload Inventory Image/Document/Video:</label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="file"
          name="file"
          multiple
          onChange={handleFileChange}
          required
        />
        <label htmlFor="reportedIssue" className="font-bold">Reported Issue:</label>
        <textarea
          className="border p-2 rounded w-full mb-4"
          type="text"
          name="reportedIssue"
          value={newClient.reportedIssue}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="clientNotes" className="font-bold">Client Notes:</label>
        <textarea
          className="border p-2 rounded w-full mb-4"
          type="text"
          name="clientNotes"
          value={newClient.clientNotes}
          onChange={handleInputChange}
        />

        <label htmlFor="assignedTechnician" className="font-bold">Assigned Technician:</label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="text"
          name="assignedTechnician"
          value={newClient.assignedTechnician}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="estimateAmount" className="font-bold">Estimate Amount:</label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="number"
          name="estimateAmount"
          value={newClient.estimateAmount}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="Deadline" className="font-bold">Deadline:</label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="date"
          name="Deadline"
          value={newClient.Deadline}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="status" className="font-bold">
          Status:
        </label>
        <select
          className="border p-2 rounded w-full mb-4"
          name="status"
          value={newClient.status}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-progress</option>
          <option value="completed">Completed</option>
        </select>

        

        <button
          type="submit"
          className="bg-blue-800 text-white py-2 px-5 font-semibold rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default New;
