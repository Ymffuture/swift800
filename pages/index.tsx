// pages/index.tsx
import Link from 'next/link';
export default function Home() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Two-Party Contract Signing</h1>
      <p>Create a contract as User A and get a short code for User B to sign.</p>
      <div className="mt-6">
        <Link href="/create"><a className="px-4 py-2 bg-blue-600 text-white rounded">Create contract (User A)</a></Link>
      </div>
    </div>
  );
}
