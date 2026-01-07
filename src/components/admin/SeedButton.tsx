"use client";
import { useState } from 'react';
import { Database, RefreshCw, CheckCircle } from 'lucide-react';

export default function SeedButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setIsSuccess(false);
    
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          location.reload();
        }, 1500);
      } else {
        console.error('Seed failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Seed error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button 
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
        isSuccess 
          ? 'bg-green-500 text-white shadow-green-lg transform scale-105' 
          : isLoading 
          ? 'bg-purple-400 text-white cursor-not-allowed shadow-purple-md'
          : 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-purple-md hover:shadow-purple-lg transform hover:-translate-y-0.5'
      }`}
      type="button" 
      onClick={onClick}
      disabled={isLoading}
    >
      {isSuccess ? (
        <>
          <CheckCircle className="w-5 h-5" />
          <span>Success!</span>
        </>
      ) : isLoading ? (
        <>
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Seeding...</span>
        </>
      ) : (
        <>
          <Database className="w-5 h-5" />
          <span>Seed Files → DB</span>
        </>
      )}
      
      {/* Loading ripple effect */}
      {isLoading && (
        <span className="absolute inset-0 rounded-xl bg-white/20 scale-0 animate-ping"></span>
      )}
    </button>
  );
}