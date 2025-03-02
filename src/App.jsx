import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/play');  // Redirect to /play on first load
  }, []);

  return null; // This ensures App itself doesn't render anything
}
