import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../../components/Alert";

export default function SendMessage() {
  const [templates, setTemplates] = useState([]);
  const [recipient, setRecipient] = useState("all");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    fetch("https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch((err) => console.error("Error fetching templates:", err));
  }, []);

  useEffect(() => {
    fetch("https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/drivers")
      .then((res) => res.json())
      .then((data) => setDrivers(data))
      .catch((err) => console.error("Error fetching drivers:", err));
  }, []);

  const handleSend = async () => {
    const template = templates.find((t) => t._id === selectedTemplateId);

    if (!template) {
      setAlert({
        visible: true,
        title: "Invalid Template",
        message: "Please select a valid template before sending.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/messages/send",
        {
          title: template.title,
          body: template.body,
          recipientId: recipient === "all" ? null : recipient,
        }
      );

      setAlert({
        visible: true,
        title: "Message Sent",
        message:
          response.data.message || "Your message has been sent successfully.",
      });

      setRecipient("all");
      setSelectedTemplateId("");
    } catch (error) {
      setAlert({
        visible: true,
        title: "Send Failed",
        message:
          error.response?.data?.message ||
          "Something went wrong while sending the message.",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#510A32] via-[#3A3A52] to-[#FFDA44] mt-16 text-white">
      {alert.visible && (
        <Alert
          title={alert.title}
          message={alert.message}
          setAlertVisible={(visible) =>
            setAlert((prev) => ({ ...prev, visible }))
          }
        />
      )}

      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2 text-[#FFDA44]">
          Send Messages
        </h1>
        <p className="text-gray-300">Send alerts and updates to drivers</p>
      </div>

      {/* Recipient Selection */}
      <div className="mb-10 p-6 bg-gradient-to-r from-[#3D1E3D] via-[#2D2D44] to-[#FFDA44] text-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-[#FFDA44]">
          Select Recipient
        </h2>
        <select
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-3 bg-[#2A2A40] text-white rounded-md border border-gray-600"
        >
          <option value="all">All Drivers</option>
          {drivers.map((driver) => (
            <option key={driver._id} value={driver._id}>
              {driver.full_name}
            </option>
          ))}
        </select>
      </div>

      {/* Template Selection */}
      <div className="p-6 bg-gradient-to-r from-[#2D1E2F] via-[#313147] to-[#FFDA44] text-white rounded-xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-4 text-[#FFDA44]">
          Select Message Template
        </h2>
        <select
          value={selectedTemplateId}
          onChange={(e) => setSelectedTemplateId(e.target.value)}
          className="w-full p-3 bg-[#2A2A40] text-white rounded-md border border-gray-600"
        >
          <option value="">Select Template</option>
          {templates.map((template) => (
            <option key={template._id} value={template._id}>
              {template.title}
            </option>
          ))}
        </select>

        {selectedTemplateId && (
          <div className="mt-4 text-sm text-gray-300 bg-[#292942] p-4 rounded-md border border-gray-600">
            <strong>Message:</strong> <br />
            {templates.find((t) => t._id === selectedTemplateId)?.body}
          </div>
        )}
      </div>

      {/* Send Button */}
      <div className="mt-10">
        <button
          onClick={handleSend}
          className="w-full p-4 bg-gradient-to-r from-[#711C2F] via-[#393960] to-[#FFDA44] text-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
