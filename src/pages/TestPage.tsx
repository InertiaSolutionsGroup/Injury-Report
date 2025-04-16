import React from 'react';
import TestHarness from '../components/testing/TestHarness';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-xl font-semibold text-gray-900">Injury Report Testing</h1>
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">
        <TestHarness />
      </main>
    </div>
  );
};

export default TestPage;
