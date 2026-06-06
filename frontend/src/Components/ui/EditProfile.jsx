import { useState, useEffect } from "react";

export default function EditProfile({ isOpen, onClose, user, onSave }) {
  const [form, setForm] = useState(user || {});

  useEffect(() => {
    setForm(user || {});
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">

      <div className="bg-white w-[400px] p-5 rounded-xl space-y-3">

        <h2 className="text-lg font-bold">Edit Profile</h2>

        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Name"
        />

        <input
          name="email"
          value={form.email || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Email"
        />

        <input
          name="role"
          value={form.role || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Role"
        />

        {/* BUTTONS */}
        <div className="flex gap-2">

          <button
            onClick={onClose}
            className="w-1/2 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="w-1/2 py-2 text-white bg-green-500 rounded"
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
}