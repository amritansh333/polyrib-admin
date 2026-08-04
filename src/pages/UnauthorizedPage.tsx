import React from 'react';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Unauthorized</h1>
      <p className="mt-2">You don't have permission to access this resource.</p>
      <div className="mt-4">
        <Link to="/" className="text-brand-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
