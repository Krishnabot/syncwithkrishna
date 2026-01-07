"use client";
import { Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function DeleteButton({ slug }: { slug: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onClick = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000); // Auto-hide after 3 seconds
      return;
    }

    setIsDeleting(true);
    try {
      await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
      location.reload();
    } catch (error) {
      console.error('Failed to delete post:', error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="relative">
      <button 
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          showConfirm 
            ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg transform scale-105' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
        } ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
        type="button" 
        onClick={onClick}
        disabled={isDeleting}
      >
        {showConfirm ? (
          <>
            <AlertTriangle className="w-4 h-4" />
            <span>Confirm Delete</span>
          </>
        ) : (
          <>
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </>
        )}
      </button>
      
      {/* Ripple effect */}
      {showConfirm && (
        <span className="absolute inset-0 rounded-lg bg-red-400/20 scale-0 animate-ping"></span>
      )}
    </div>
  );
}