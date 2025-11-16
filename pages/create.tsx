// pages/create.tsx
import { useState } from "react";
import type { NextPage } from "next";
import axios from "axios";

const Create: NextPage = () => {
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await axios.post("/api/contracts", { title });
      alert("Contract created!");
    } catch (error) {
      if (error instanceof Error) alert(error.message);
      else alert("Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Contract title"
        className="border p-2 rounded w-full mb-4"
      />
      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Contract"}
      </button>
    </div>
  );
};

export default Create;
