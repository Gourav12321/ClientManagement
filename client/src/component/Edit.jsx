import React, { useState, useEffect } from "react";
import axios from "axios";

function Edit({ setNewOpen, fetchClients, clientId }) {
  const [newClient, setNewClient] = useState({
    _id: "",
    clientName: "",
    contactInfo: "",
    receivedDate: "",
    inventoryRecieved: "",
    file: [],
    reportedIssue: "",
    clientNotes: "",
    assignedTechnician: "",
    estimateAmount: "",
    Deadline: "",
    status: "",
  });

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`/api/clientById/${clientId}`);
        const data = response.data.data;
        setNewClient(data);
      } catch (error) {
        console.log("Error fetching client data:", error);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleNewClientChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewClient((prevState) => ({
      ...prevState,
      file: e.target.files
    }));
  };
  
  const handleNewClientSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    for (const key in newClient) {
      if (key === 'file' && newClient[key]) {
        Array.from(newClient[key]).forEach(file => {
          formData.append('files', file);
        });
      } else {
        formData.append(key, newClient[key]);
      }
    }
  
    try {
      const response = await axios.put(
        `/api/client`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      if (response.status === 200) {
        setNewOpen(false);
        fetchClients();
      }
    } catch (error) {
      console.log("Error updating client:", error);
    }
  };

  return (
    <div className="overflow-y-auto h-[80%] p-4 sm:p-6 md:p-8">
      <form onSubmit={handleNewClientSubmit} className="space-y-4">
        <input
          className="border p-2 rounded w-full hidden"
          name="_id"
          value={newClient._id}
          onChange={handleNewClientChange}
          disabled
        />

        <label htmlFor="clientName" className="block font-bold text-start">Client Name:</label>
        <input
          className="border p-2 rounded w-full"
          name="clientName"
          value={newClient.clientName}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="contactInfo" className="block font-bold text-start">Contact Info:</label>
        <input
          className="border p-2 rounded w-full"
          type="text"
          name="contactInfo"
          value={newClient.contactInfo}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
              handleNewClientChange(e);
            }
          }}
          maxLength={10}
          placeholder="Enter 10 digit contact number"
          required
        />

        <label htmlFor="receivedDate" className="block font-bold text-start">Received Date:</label>
        <input
          className="border p-2 rounded w-full"
          type="date"
          name="receivedDate"
          value={newClient.receivedDate}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="inventoryReceived" className="block font-bold text-start">Inventory Received:</label>
        <input
          className="border p-2 rounded w-full"
          type="text"
          name="inventoryRecieved"
          value={newClient.inventoryRecieved}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="file" className="block font-bold text-start">Upload Inventory Image/Document/Video:</label>
        <input
          className="border p-2 rounded w-full"
          type="file"
          name="file"
          multiple
          onChange={handleFileChange}
        />

        <label htmlFor="reportedIssue" className="block font-bold text-start">Reported Issue:</label>
        <textarea
          className="border p-2 rounded w-full"
          name="reportedIssue"
          value={newClient.reportedIssue}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="clientNotes" className="block font-bold text-start">Client Notes:</label>
        <textarea
          className="border p-2 rounded w-full"
          name="clientNotes"
          value={newClient.clientNotes}
          onChange={handleNewClientChange}
        />

        <label htmlFor="assignedTechnician" className="block font-bold text-start">Assigned Technician:</label>
        <input
          className="border p-2 rounded w-full"
          type="text"
          name="assignedTechnician"
          value={newClient.assignedTechnician}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="estimateAmount" className="block font-bold text-start">Estimate Amount:</label>
        <input
          className="border p-2 rounded w-full"
          type="number"
          name="estimateAmount"
          value={newClient.estimateAmount}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="deadline" className="block font-bold text-start">Deadline:</label>
        <input
          className="border p-2 rounded w-full"
          type="date"
          name="Deadline"
          value={newClient.Deadline}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="status" className="block font-bold text-start">Status:</label>
        <select
          className="border p-2 rounded w-full"
          name="status"
          value={newClient.status}
          onChange={handleNewClientChange}
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

export default Edit;
