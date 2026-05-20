"use client";

import { useState, useEffect } from "react";
import { getProducts, Product } from "@/lib/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const fetchDBProducts = async () => {
      // Always load from localStorage immediately for instant render
      setProducts(getProducts());

      try {
        const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://localhost:5000/api/products'
          : '/api/products';

        // 3-second timeout so we don't hang when backend is offline
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3000);

        const res = await fetch(API_URL, { signal: controller.signal });
        clearTimeout(timer);

        if (!res.ok) throw new Error("API not OK");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          localStorage.setItem('ke_products', JSON.stringify(data));
        }
      } catch {
        // Backend offline or unreachable — already loaded from localStorage above, no action needed
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
