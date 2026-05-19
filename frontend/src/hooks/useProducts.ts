"use client";

import { useState, useEffect } from "react";
import { getProducts, Product } from "@/lib/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const fetchDBProducts = async () => {
      try {
        const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
          ? 'http://localhost:5000/api/products' 
          : '/api/products';
          
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          // Sync backend data to local cache for instant loading next time
          localStorage.setItem('ke_products', JSON.stringify(data));
        } else {
          // Fallback to local cache if db is empty
          setProducts(getProducts());
        }
      } catch (err) {
        console.error("Using offline local mode:", err);
        setProducts(getProducts());
      }
    };

    fetchDBProducts();

    // Listener for cross-tab updates (native storage event)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ke_products') fetchDBProducts();
    };

    // Listener for same-tab updates (custom event)
    const handleLocalUpdate = () => {
      fetchDBProducts();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('products-updated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('products-updated', handleLocalUpdate);
    };
  }, []);

  if (!isMounted) return [];

  return products;
}
