import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">404 — Page not found</h1>
      <p className="mt-2">The page you requested does not exist.</p>
      <div className="mt-4">
        <Link to="/" className="text-brand-500 hover:underline">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
