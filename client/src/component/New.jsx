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
      await axios.post("/api/client", formData, {
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
    <div className="overflow-y-auto h-[80%] p-4 sm:p-6 md:p-8">
      <form onSubmit={handleNewClientSubmit} encType="multipart/form-data" className="space-y-4">
        <label htmlFor="clientName" className="block font-bold">Client Name:</label>
        <input
          className="border p-2 rounded w-full"
          type="text"
          name="clientName"
          value={newClient.clientName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="contactInfo" className="block font-bold">Contact Info:</label>
        <input
          className="border p-2 rounded w-full"
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

        <label htmlFor="receivedDate" className="block font-bold">Received Date:</label>
        <input
          className="border p-2 rounded w-full"
          type="date"
          name="receivedDate"
          value={newClient.receivedDate}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="inventoryRecieved" className="block font-bold">Inventory Received:</label>
        <input
          className="border p-2 rounded w-full"
          type="text"
          name="inventoryRecieved"
          value={newClient.inventoryRecieved}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="file" className="block font-bold">Upload Inventory Image/Document/Video:</label>
        <input
          className="border p-2 rounded w-full"
          type="file"
          name="file"
          multiple
          onChange={handleFileChange}
          required
        />

        <label htmlFor="reportedIssue" className="block font-bold">Reported Issue:</label>
        <textarea
          className="border p-2 rounded w-full"
          name="reportedIssue"
          value={newClient.reportedIssue}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="clientNotes" className="block font-bold">Client Notes:</label>
        <textarea
          className="border p-2 rounded w-full"
          name="clientNotes"
          value={newClient.clientNotes}
          onChange={handleInputChange}
        />

        <label htmlFor="assignedTechnician" className="block font-bold">Assigned Technician:</label>
        <input
          className="border p-2 rounded w-full"
          type="text"
          name="assignedTechnician"
          value={newClient.assignedTechnician}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="estimateAmount" className="block font-bold">Estimate Amount:</label>
        <input
          className="border p-2 rounded w-full"
          type="number"
          name="estimateAmount"
          value={newClient.estimateAmount}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="Deadline" className="block font-bold">Deadline:</label>
        <input
          className="border p-2 rounded w-full"
          type="date"
          name="Deadline"
          value={newClient.Deadline}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="status" className="block font-bold">Status:</label>
        <select
          className="border p-2 rounded w-full"
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
          className="bg-blue-800 text-white py-2 px-4 font-semibold rounded-md w-full sm:w-auto"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default New;
