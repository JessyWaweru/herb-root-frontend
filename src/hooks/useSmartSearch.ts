import { useNavigate } from 'react-router-dom';

/** Sends free text to the smart results page; the backend works out what it means. */
export function useSmartSearchNavigate() {
  const navigate = useNavigate();

  return (text: string) => {
    const trimmed = text.trim();
    navigate(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : '/shop');
  };
}
