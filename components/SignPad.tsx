// components/SignPad.tsx
import { useRef, useEffect } from "react";
import SignaturePad from "signature_pad";

interface SignPadProps {
  onEnd: (dataURL: string) => void;
}

const SignPad: React.FC<SignPadProps> = ({ onEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sigPadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      sigPadRef.current = new SignaturePad(canvasRef.current);
      sigPadRef.current.onEnd = () => {
        const data = sigPadRef.current?.toDataURL() ?? "";
        onEnd(data);
      };
    }
  }, [onEnd]);

  const clear = () => sigPadRef.current?.clear();

  return (
    <div className="border p-2">
      <canvas ref={canvasRef} className="w-full h-64 border" />
      <button onClick={clear} className="mt-2 bg-red-600 text-white px-4 py-2 rounded">
        Clear
      </button>
    </div>
  );
};

export default SignPad;
