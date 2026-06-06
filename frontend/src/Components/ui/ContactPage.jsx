import React, { useState } from "react";
import axios from "axios";
import { Video, MessageSquare, MapPin, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccess("");
      setError("");

      const res = await axios.post(
        "http://localhost:8989/contact/send-message",
        formData
      );

        if(res.data.success){
          setTimeout(() => {
            toast.success("Thanks for connecting!");
          }, 3000);
        }
      setSuccess(res.data.message);

      // reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen px-6 py-20 overflow-hidden bg-white" id="contacts">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[25%] top-[30%] w-[700px] h-[700px] bg-green-50 rounded-full blur-[130px]" />
      </div>

      <div className="grid items-center max-w-6xl gap-12 mx-auto lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div>
          <span className="text-sm font-medium text-green-600">
            CONTACT US
          </span>

          <h1 className="mt-3 text-4xl font-bold lg:text-6xl">
            Let's talk about your{" "}
            <span className="text-green-500">interview journey.</span>
          </h1>

          <p className="max-w-md mt-6 leading-8 text-slate-600">
            Whether you're preparing for your first interview or polishing
            your skills, we're here to help.
          </p>

          {/* contact info */}
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <Video size={18} /> Book demo session
            </div>

            <div className="flex items-center gap-3">
              <MessageSquare size={18} /> Live support
            </div>
          </div>

          <div className="pt-8 mt-10 space-y-3 border-t">
            <div className="flex items-center gap-2">
              <Mail size={18} /> support@interviewprep.ai
            </div>
            <div className="flex items-center gap-2">
              <Phone size={18} /> +91 98765 43210
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} /> Mohali, Punjab
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-8 border rounded-3xl">
          <h2 className="text-2xl font-semibold">Send us a message</h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 border rounded-xl"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 border rounded-xl"
              required
            />

            <textarea
              name="message"
              rows={5}
              placeholder="Your message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-4 border rounded-xl"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-white bg-green-500 rounded-full"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {/* success/error */}
            {success && (
              <p className="text-sm text-green-600">{success}</p>
            )}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;