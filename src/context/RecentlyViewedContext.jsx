import { createContext, useContext, useEffect, useState } from "react";

const RecentlyViewedContext = createContext();

export function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    setRecentlyViewed(stored);
  }, []);

  const addRecentlyViewed = (product) => {
    const updated = [
      product,
      ...recentlyViewed.filter((item) => item.id !== product.id),
    ].slice(0, 8);

    setRecentlyViewed(updated);

    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(updated)
    );
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export const useRecentlyViewed = () =>
  useContext(RecentlyViewedContext);