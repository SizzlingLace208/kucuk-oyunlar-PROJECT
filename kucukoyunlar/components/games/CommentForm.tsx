'use client';

import React, { useState, useEffect } from 'react';
import { addComment, updateComment, hasUserCommentedGame, Comment } from '@/lib/services/comment-service';

interface CommentFormProps {
  gameId: string;
  commentId?: string;
  initialContent?: string;
  initialRating?: number;
  onCommentAdded?: (comment: Comment) => void;
  onCommentUpdated?: (comment: Comment) => void;
  onCancel?: () => void;
}

export default function CommentForm({
  gameId,
  commentId,
  initialContent = '',
  initialRating = 5,
  onCommentAdded,
  onCommentUpdated,
  onCancel
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCommented, setHasCommented] = useState(false);
  
  const isEditing = !!commentId;

  useEffect(() => {
    if (!isEditing) {
      checkUserComment();
    }
  }, [gameId, isEditing]);

  const checkUserComment = async () => {
    try {
      const { hasCommented, error } = await hasUserCommentedGame(gameId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setHasCommented(hasCommented);
    } catch (err) {
      console.error('Kullanıcı yorumu kontrol edilirken hata oluştu:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim() === '') {
      setError('Lütfen bir yorum yazın');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (isEditing) {
        // Yorumu güncelle
        const { data, error } = await updateComment(commentId, content, rating);
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data && onCommentUpdated) {
          onCommentUpdated(data);
        }
      } else {
        // Yeni yorum ekle
        const { data, error } = await addComment(gameId, content, rating);
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data && onCommentAdded) {
          onCommentAdded(data);
          setContent('');
          setRating(5);
          setHasCommented(true);
        }
      }
    } catch (err) {
      console.error('Yorum gönderilirken hata oluştu:', err);
      setError('Yorum gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (hasCommented && !isEditing) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
        <p>Bu oyun için zaten bir yorum yapmışsınız. Yorumunuzu düzenlemek isterseniz yorumlar bölümünden düzenleyebilirsiniz.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium mb-1">
          Puanınız
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-2xl focus:outline-none"
            >
              <span className={`${
                (hoveredRating || rating) >= star
                  ? 'text-yellow-500'
                  : 'text-gray-300'
              }`}>
                ★
              </span>
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating} / 5
          </span>
        </div>
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Yorumunuz
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Bu oyun hakkında ne düşünüyorsunuz?"
        />
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
            disabled={loading}
          >
            İptal
          </button>
        )}
        
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          disabled={loading}
        >
          {loading ? 'Gönderiliyor...' : isEditing ? 'Güncelle' : 'Gönder'}
        </button>
      </div>
    </form>
  );
} 