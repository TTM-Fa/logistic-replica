import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LaneOverview from './pages/lanes/LaneOverview';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dynamic lane pages */}
        <Route path="/lanes/overview" element={<LaneOverview />} />
        
        {/* Default - redirect to static site */}
        <Route path="*" element={<RedirectToStatic />} />
      </Routes>
    </BrowserRouter>
  );
}

function RedirectToStatic() {
  useEffect(() => {
    window.location.href = '/road-freight-perspectives.html';
  }, []);
  
  return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>Loading...</div>;
}
