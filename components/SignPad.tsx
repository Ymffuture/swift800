// components/SignPad.tsx
import React, { useRef, useEffect } from 'react';
import SignaturePad from 'signature_pad';

type Props = {
  onSave: (dataUrl: string | null) => void;
  height?: number;
};

export default function SignPad({ onSave, height = 180 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const pad = new SignaturePad(canvas, { backgroundColor: 'rgba(255,255,255,0)' });
    padRef.current = pad;

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d')!.scale(ratio, ratio);
      pad.clear();
    };
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  function clear() { padRef.current?.clear(); }
  function save() {
    if (!padRef.current || padRef.current.isEmpty()) return onSave(null);
    const url = padRef.current.toDataURL('image/png');
    onSave(url);
  }

  return (
    <div>
      <div style={{ height }} className="border rounded">
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="mt-2 flex gap-2">
        <button className="px-3 py-1 border" onClick={clear}>Clear</button>
        <button className="px-3 py-1 border" onClick={save}>Save</button>
      </div>
    </div>
  );
}
