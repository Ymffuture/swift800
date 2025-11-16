// pages/contract/[code].tsx
import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SignPad from '../../components/SignPad';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ContractPage() {
  const router = useRouter();
  const { code } = router.query as { code?: string };
  const [contract, setContract] = useState<any>(null);
  const [nameB, setNameB] = useState('');
  const [emailB, setEmailB] = useState('');
  const [signatureB, setSignatureB] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (code) fetchContract(code); }, [code]);

  async function fetchContract(c: string) {
    try {
      const res = await axios.get('/api/contracts/code', { params: { code: c } });
      setContract(res.data.contract);
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message);
    }
  }

  async function submitSignature() {
    if (!contract?._id) return;
    if (!signatureB || !nameB) return alert('Please provide name and signature.');
    try {
      const res = await axios.post(`/api/contracts/${contract._id}`, {
        name: nameB, email: emailB, signature: signatureB
      });
      setContract(res.data.contract);
      alert('Signed! Server generated PDF and sent notifications.');
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message);
    }
  }

  async function downloadPdfClient() {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    pdf.addImage(img, 'PNG', 0, 0, pageWidth, (canvas.height * pageWidth) / canvas.width);
    pdf.save('contract-signed.pdf');
  }

  function printPreview() {
    if (!previewRef.current) return;
    const w = window.open('', '_blank');
    w!.document.write(`<html><head><title>Contract</title></head><body>${previewRef.current!.innerHTML}</body></html>`);
    w!.document.close();
    w!.focus();
    setTimeout(() => { w!.print(); }, 500);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold">Contract</h1>
      {!contract && <p>Loading...</p>}
      {contract && (
        <>
          <div ref={previewRef} className="p-4 border bg-white mt-4">
            <h2 className="font-semibold text-lg">{contract.title}</h2>
            <p className="mt-2 whitespace-pre-line">{contract.body}</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-2 border">
                <h3 className="font-semibold">Signer A</h3>
                <p>Name: {contract.signerA.name}</p>
                <p>ID: {contract.signerA.idNumber}</p>
                {contract.signerA.idPhotoUrl && <img src={contract.signerA.idPhotoUrl} alt="ID" style={{ maxWidth: '100%' }} />}
                {contract.signerA.signatureUrl && <img src={contract.signerA.signatureUrl} alt="sigA" style={{ maxWidth: 200 }} />}
                <p>Signed at: {contract.signerA.signedAt}</p>
              </div>
              <div className="p-2 border">
                <h3 className="font-semibold">Signer B</h3>
                {contract.signerB ? <>
                  <p>Name: {contract.signerB.name}</p>
                  <p>Signed at: {contract.signerB.signedAt}</p>
                  {contract.signerB.signatureUrl && <img src={contract.signerB.signatureUrl} style={{ maxWidth: 200 }} />}
                </> : <p>Not signed yet.</p>}
              </div>
            </div>
            {contract.pdfUrl && <div className="mt-4">Final PDF: <a className="underline" href={contract.pdfUrl} target="_blank" rel="noreferrer">Download</a></div>}
          </div>

          {!contract.signerB && (
            <div className="mt-6 p-4 border rounded">
              <h3 className="font-semibold">Sign this contract (User B)</h3>
              <input placeholder="Your name" value={nameB} onChange={e => setNameB(e.target.value)} className="w-full p-2 mt-2 border" />
              <input placeholder="Email (optional)" value={emailB} onChange={e => setEmailB(e.target.value)} className="w-full p-2 mt-2 border" />
              <div className="mt-4"><SignPad onSave={(d) => setSignatureB(d)} /></div>
              <button onClick={submitSignature} className="mt-3 px-3 py-1 bg-green-600 text-white rounded">Submit Signature</button>
            </div>
          )}

          {contract.signerB && (
            <div className="mt-4 flex gap-2">
              <button onClick={() => window.open(contract.pdfUrl || '#', '_blank')} className="px-3 py-1 bg-blue-600 text-white rounded">Open Server PDF</button>
              <button onClick={downloadPdfClient} className="px-3 py-1 border rounded">Download (client)</button>
              <button onClick={printPreview} className="px-3 py-1 border rounded">Print</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
