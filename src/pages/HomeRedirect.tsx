import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function HomeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Generate a random 8-character string
    const randomId = Math.random().toString(36).substring(2, 10);
    // Redirect to the new board
    navigate(`/${randomId}`, { replace: true });
  }, [navigate]);

  return null; // Or a loading spinner
}