import { useEffect } from "react";

const useDynamicTitle = (title) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title ? `Admin | ${title}` : "Innliv";
    
    return () => {
      document.title = originalTitle; 
    };
  }, [title]);
};

export default useDynamicTitle;
