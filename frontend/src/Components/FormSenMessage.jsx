import React, { useState } from "react";
import emailjs from "emailjs-com";

const FormSenMessage = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔄 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Simple validation
  const validate = () => {
    if (!formData.businessName.trim()) return "Business name is required";
    if (!formData.ownerName.trim()) return "Owner name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.phone.trim()) return "Phone is required";
    if (!formData.address.trim()) return "Address is required";
    return "";
  };

  // 📩 Send email
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    const emailText = `
New Business Contact Request

Business Name: ${formData.businessName}
Owner Name: ${formData.ownerName}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}
`;

    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          message: emailText, // ONE variable
        },
        "YOUR_PUBLIC_KEY"
      )
      .then(() => {
        alert("Message sent successfully ✅");
        setFormData({
          businessName: "",
          ownerName: "",
          email: "",
          phone: "",
          address: "",
        });
      })
      .catch(() => {
        setError("Failed to send message. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="bg-white md:w-[70%] w-full mx-auto rounded-2xl shadow-lg p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Two Column Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Business Name"
              className="input"
            />

            <input
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Owner Name"
              className="input"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="input"
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="input"
            />
          </div>

          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Business Address"
            className="input"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0EA5C9] to-[#1BB38C] text-white py-4 rounded-lg text-lg disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormSenMessage;
