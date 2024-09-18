import React, { useState, useEffect } from "react";
import axios from "axios";

function Edit({ setNewOpen, fetchClients, clientId }) {
  const [newClient, setNewClient] = useState({
    _id: "",
    clientName: "",
    contactInfo: "",
    receivedDate: "",
    inventoryReceived: "",
    file: [],
    reportedIssue: "",
    clientNotes: "",
    assignedTechnician: "",
    estimateAmount: "",
    deadline: "",
    status: "",
  });

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(
          `/api/clientById/${clientId}`
        );
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
      file: e.target.files // Multiple files handling
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
    <div className="overflow-y-auto h-[80%]">
      <form onSubmit={handleNewClientSubmit}>
        {/* <input
          className="border p-2 rounded w-full mb-4 hidden"
          name="clientId"
          value={newClient._id}
          onChange={handleNewClientChange}
          required
          disabled // Client ID should be disabled for editing
        /> */}
        <input
          className="border p-2 rounded w-full mb-4 hidden"
          name="_id"
          value={newClient._id}
          onChange={handleNewClientChange}
          disabled // Client ID should be disabled for editing
        />

        <label htmlFor="clientName" className="flex font-bold">
          Client Name:
        </label>
        <input
          className="border p-2 rounded w-full mb-4"
          name="clientName"
          value={newClient.clientName}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="contactInfo" className="flex font-bold">
          Contact Info:
        </label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="text"
          name="contactInfo"
          value={newClient.contactInfo}
          onChange={(e) => {
            const value = e.target.value;
            // Allow only numbers and limit the length to 10 digits
            if (/^\d{0,10}$/.test(value)) {
              handleInputChange(e);
            }
          }}
          maxLength={10} 
          placeholder="Enter 10 digit contact number"
          required
        />

        <label htmlFor="receivedDate" className="flex font-bold">
          Received Date:
        </label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="date"
          name="receivedDate"
          value={newClient.receivedDate}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="inventoryRecieved" className="flex font-bold">
          Inventory Received:
        </label>
        <input
          className="border p-2 rounded w-full mb-4"
          name="inventoryRecieved"
          value={newClient.inventoryRecieved}
          onChange={handleNewClientChange}
          required
        />

<label htmlFor="file" className="flex font-bold">
          Upload Inventory Image/Document/Video:
        </label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="file"
          name="file"
          onChange={handleFileChange}
          multiple
        />

        <label htmlFor="reportedIssue" className="flex font-bold">
          Reported Issues:
        </label>
        <textarea
          className="border p-2 rounded w-full mb-4"
          name="reportedIssue"
          value={newClient.reportedIssue}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="clientNotes" className="flex font-bold">
          Client Notes:
        </label>
        <textarea
          className="border p-2 rounded w-full mb-4"
          name="clientNotes"
          value={newClient.clientNotes}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="assignedTechnician" className="flex font-bold">
          Assigned Technician:
        </label>
        <input
          className="border p-2 rounded w-full mb-4"
          name="assignedTechnician"
          value={newClient.assignedTechnician}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="Deadline" className="flex font-bold">
          Deadline:
        </label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="date"
          name="Deadline"
          value={newClient.Deadline}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="estimateAmount" className="flex font-bold">
          Estimated Amount:
        </label>
        <input
          className="border p-2 rounded w-full mb-4"
          type="number"
          name="estimateAmount"
          value={newClient.estimateAmount}
          onChange={handleNewClientChange}
          required
        />

        <label htmlFor="status" className="flex font-bold">
          Status:
        </label>
        <select
          className="border p-2 rounded w-full mb-4"
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
          className="bg-blue-800 font-bold text-white py-2 px-4 rounded w-full"
          type="submit"
          onClick={() => fetchClients()}
        >
          Save Changes
        </button>
        <button
          className="text-blue-800 font-bold py-2 px-4 rounded w-full my-3"
          onClick={() => setNewOpen(false)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Edit;
