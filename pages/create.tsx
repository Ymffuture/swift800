// pages/create.tsx
import React, { useState } from 'react';
import axios from 'axios';
import SignPad from '../components/SignPad';
import { useRouter } from 'next/router';

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('Agreement');
  const [body, setBody] = useState('Contract terms go here...');
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [emailB, setEmailB] = useState('');
  const [phoneB, setPhoneB] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setIdPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleCreate() {
    if (!name || !idNumber || !signature) return alert('Please fill name, id number and sign.');
    try {
      const payload = {
        title,
        body,
        signerA: { name, idNumber, idPhoto, signature },
        notify: { email: emailB, phone: phoneB } // optional notify for userB
      };
      const res = await axios.post('/api/contracts', payload);
      const { shortCode } = res.data;
      alert(`Contract created. Code: ${shortCode}`);
      // optionally navigate to contract page
      router.push(`/contract/${shortCode}`);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || 'Error');
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Create Contract (User A)</h1>

      <label className="block mt-4">Your name
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border mt-1" />
      </label>

      <label className="block mt-2">Your ID number
        <input value={idNumber} onChange={e=>setIdNumber(e.target.value)} className="w-full p-2 border mt-1" />
      </label>

      <label className="block mt-2">Upload ID photo
        <input type="file" accept="image/*" onChange={handleFile} className="mt-1" />
      </label>

      <label className="block mt-4">Contract text
        <textarea value={body} onChange={e=>setBody(e.target.value)} className="w-full p-2 border mt-1 h-32" />
      </label>

      <div className="mt-4">
        <h3 className="font-semibold">Sign here</h3>
        <SignPad onSave={(d)=>setSignature(d)} />
      </div>

      <div className="mt-4 p-4 border rounded">
        <h4 className="font-semibold">Notify next signer (optional)</h4>
        <input placeholder="Signer B email" value={emailB} onChange={e=>setEmailB(e.target.value)} className="w-full p-2 border mt-2" />
        <input placeholder="Signer B phone (+countrycode)" value={phoneB} onChange={e=>setPhoneB(e.target.value)} className="w-full p-2 border mt-2" />
      </div>

      <div className="mt-4">
        <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create & Notify</button>
      </div>
    </div>
  );
}
