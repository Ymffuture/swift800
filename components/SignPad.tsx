import React, { useRef, useEffect } from "react";
import SignaturePad from "signature_pad";

interface Props {
  onEnd: (dataUrl: string) => void;
}

export default function SignPad({ onEnd }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sigPadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    sigPadRef.current = new SignaturePad(canvasRef.current);

    // Use the official typed event
    sigPadRef.current.addEventListener("endStroke", () => {
      const data = sigPadRef.current?.toDataURL() ?? "";
      onEnd(data);
    });

    return () => {
      sigPadRef.current?.off(); // cleanup if needed
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={250}
      style={{ border: "1px solid #ccc" }}
    />
  );
}
