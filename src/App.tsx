import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components (will create these next)
const TeacherForm = React.lazy(() => import('./components/TeacherForm'));
const FrontDeskView = React.lazy(() => import('./components/FrontDeskView'));
const MemoView = React.lazy(() => import('./components/MemoView'));
const Layout = React.lazy(() => import('./components/Layout'));
const TestPage = React.lazy(() => import('./pages/TestPage'));

function App() {
  return (
    <Router>
      <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/teacher" replace />} />
            <Route path="teacher" element={<TeacherForm />} />
            <Route path="front-desk" element={<FrontDeskView />} />
            <Route path="memo/:reportId" element={<MemoView />} />
          </Route>
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
