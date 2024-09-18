import React, { useEffect, useState } from "react";
import axios from "axios";
import New from "../component/New";
import View from "../component/View";
import Edit from "../component/Edit";


function DashBoard() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]); // Add state to store filtered clients
  const [searchQuery, setSearchQuery] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [newOpen1, setNewOpen1] = useState(false);
  const [newOpen2, setNewOpen2] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch all clients from the backend
  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/client");
      setClients(response.data.data);
      setFilteredClients(response.data.data); // Set filtered clients to be the same as the full client list initially
    } catch (error) {
      console.log("Error fetching clients:", error);
    }
  };

  useEffect(() => {
  
    
    const filtered = clients.filter(
      (client) =>
        (client.clientName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (client._id || "").includes(searchQuery)
    );
    

    setFilteredClients(filtered);
  }, [searchQuery, clients]);
  

  const handleDelete = async (_id) => {
    try {
      await axios.delete("http://localhost:3000/api/client", {
        data: { _id },
      });
      fetchClients(); 
    } catch (error) {
      console.log("Error deleting client:", error);
    }
  };


  return (
    <div className="bg-gray-100 w-full mt-0 p-10 h-full">
      <div className="bg-white p-10 rounded-lg">
        <div className="bg-blue-800 text-white uppercase flex rounded-t-xl justify-center text-2xl py-6 font-bold">
          Client Management Dashboard
        </div>

        <div className="w-full py-8 flex justify-between">
          <input
            className="w-full border border-gray-400 p-2 rounded-md"
            placeholder="Search By Client Name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query in real-time
          />
        </div>

        <div className="w-full flex justify-center">
          <button
            className="font-semibold bg-blue-800 text-white py-2 px-5 rounded-md"
            onClick={() => setNewOpen(true)}
          >
            New Job Sheet
          </button>
        </div>

        {newOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[70%] h-[90%] relative">
              <button
                className="absolute right-2 -top-2 text-red-600 text-2xl font-bold py-2 px-4 rounded ml-4"
                onClick={() => setNewOpen(false)}
              >
                x
              </button>
              <h2 className="text-xl font-bold mb-4 uppercase bg-blue-800 text-white p-4 rounded-t-xl text-center">
                Create New Job Sheet
              </h2>
              <New setNewOpen={setNewOpen} fetchClients={fetchClients} />
            </div>
          </div>
        )}

        <div className="py-8 text-white text-[16px] overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border bg-blue-800">
                <th className="p-2">#</th>
                <th className="p-2">Client Id</th>
                <th className="p-2">Client Name</th>
                <th className="p-2">Contact Info</th>
                <th className="p-2">Received Date</th>
                <th className="p-2">Inventory Received</th>
                <th className="p-2">Reported Issues</th>
                <th className="p-2">Client Notes</th>
                <th className="p-2">Assigned Technician</th>
                <th className="p-2">Estimated Amount</th>
                <th className="p-2">Deadline</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {filteredClients.length > 0 ? (
                filteredClients.map((client, index) => (
                  <tr
                    key={client._id}
                    className="bg-gray-200 text-black border text-center"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{client._id}</td>
                    <td className="p-2">{client.clientName}</td>
                    <td className="p-2">{client.contactInfo}</td>
                    <td className="p-2">{client.receivedDate}</td>
                    <td className="p-2">{client.inventoryRecieved}</td>
                    <td className="p-2">{client.reportedIssue}</td>
                    <td className="p-2">{client.clientNotes}</td>
                    <td className="p-2">{client.assignedTechnician}</td>
                    <td className="p-2">{client.estimateAmount}</td>
                    <td className="p-2">{client.Deadline}</td>
                    <td className="p-2">{client.status}</td>
                    <td className="flex gap-2 p-4">
                      <button
                        className="bg-blue-800 text-white py-1 px-2 rounded"
                        onClick={() => {
                          setSelectedClientId(client.clientId);
                          setNewOpen1(true);
                        }}
                      >
                        View
                      </button>

                      {newOpen1 && selectedClientId === client.clientId && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex justify-center items-center">
                          <div className="bg-white p-8 rounded-lg shadow-lg w-[70%] h-[90%] relative">
                            <button
                              className="absolute right-2 -top-2 text-red-600 text-2xl font-bold py-2 px-4 rounded ml-4"
                              onClick={() => setNewOpen1(false)}
                            >
                              x
                            </button>
                            <h2 className="text-xl font-bold mb-4 uppercase bg-blue-800 text-white p-4 rounded-t-xl text-center">
                              View Job Sheet
                            </h2>
                            <View
                              setNewOpen={setNewOpen1}
                              fetchClients={fetchClients}
                              clientId={client._id}
                              handleDelete={handleDelete}
                            />
                           
                          </div>
                          
                        </div>
                      )}

                      <button
                        className="bg-yellow-500 text-white py-1 px-2 rounded"
                        onClick={() => {
                          setSelectedClientId(client.clientId);
                          setNewOpen2(true);
                        }}
                      >
                        Edit
                      </button>

                      {newOpen2 && selectedClientId === client.clientId && (
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
                              clientId={client._id}
                            />
                          </div>
                        </div>
                      )}
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded"
                        onClick={() => handleDelete(client._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="text-center text-black font-extrabold text-xl pt-4">
                    No Clients Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="text-center font-medium bg-blue-800 p-4 text-white rounded-b-xl mt-4">
          <p>© 2024 Client Management</p>
        </footer>
      </div>
    </div>
  );
}

export default DashBoard;
