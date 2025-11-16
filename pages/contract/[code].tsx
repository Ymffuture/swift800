import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import axios from "axios";

interface ContractData {
  title: string;
  userAIdPhoto: string;
  userBIdPhoto?: string;
  signatures: string[];
}

const ContractPage: NextPage = () => {
  const [contract, setContract] = useState<ContractData | null>(null);

  useEffect(() => {
    async function fetchContract() {
      try {
        const res = await axios.get<ContractData>("/api/contracts/code123");
        setContract(res.data);
      } catch (err: unknown) {
        if (err instanceof Error) console.error(err.message);
      }
    }
    fetchContract();
  }, []);

  if (!contract) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{contract.title}</h1>
      <div className="flex gap-4 mt-4">
        <div>
          <p>User A ID</p>
          <Image
            src={contract.userAIdPhoto}
            alt="User A ID"
            width={200}
            height={120}
            className="border"
          />
        </div>
        {contract.userBIdPhoto && (
          <div>
            <p>User B ID</p>
            <Image
              src={contract.userBIdPhoto}
              alt="User B ID"
              width={200}
              height={120}
              className="border"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractPage;
