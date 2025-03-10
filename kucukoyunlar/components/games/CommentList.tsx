'use client';

import React, { useState, useEffect } from 'react';
import { getGameComments, Comment } from '@/lib/services/comment-service';
import { useAuth } from '@/lib/context/AuthContext';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// CommentForm bileşeni henüz oluşturulmadığı için geçici bir bileşen tanımlıyoruz
const CommentForm = ({ gameId, commentId, initialContent, initialRating, onCommentAdded, onCommentUpdated, onCancel }: any) => {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <p className="text-center">Yorum formu henüz oluşturulmadı. Lütfen önce CommentForm.tsx dosyasını oluşturun.</p>
    </div>
  );
};

interface CommentListProps {
  gameId: string;
}

export default function CommentList({ gameId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadComments();
  }, [gameId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await getGameComments(gameId, {
        sort_by: 'created_at',
        sort_order: 'desc'
      });

      if (error) {
        throw new Error(error.message);
      }

      setComments(data || []);
      setError(null);
    } catch (err) {
      console.error('Yorumlar yüklenirken hata oluştu:', err);
      setError('Yorumlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments(prevComments => [newComment, ...prevComments]);
  };

  const handleCommentUpdated = (updatedComment: Comment) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments(prevComments => 
      prevComments.filter(comment => comment.id !== commentId)
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Yorumlar</h2>
      
      {user && (
        <div className="mb-8">
          <CommentForm 
            gameId={gameId} 
            onCommentAdded={handleCommentAdded}
            onCommentUpdated={handleCommentUpdated}
          />
        </div>
      )}
      
      {loading ? (
        <CommentListSkeleton />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              currentUserId={user?.id}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onCommentUpdated: (comment: Comment) => void;
  onCommentDeleted: (commentId: string) => void;
}

function CommentItem({ comment, currentUserId, onCommentUpdated, onCommentDeleted }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const isOwner = currentUserId === comment.user_id;
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleCommentUpdated = (updatedComment: Comment) => {
    onCommentUpdated(updatedComment);
    setIsEditing(false);
  };
  
  if (isEditing) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <CommentForm 
          gameId={comment.game_id}
          commentId={comment.id}
          initialContent={comment.content}
          initialRating={comment.rating}
          onCommentUpdated={handleCommentUpdated}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }
  
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
            {comment.user?.avatar_url ? (
              <img 
                src={comment.user.avatar_url} 
                alt={comment.user.name || 'Kullanıcı'} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold">
                {(comment.user?.name || 'K').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="font-semibold">{comment.user?.name || 'Kullanıcı'}</div>
            <div className="text-sm text-muted-foreground">{formatDate(comment.created_at)}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-lg ${i < comment.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <button 
                onClick={handleEditClick}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Düzenle
              </button>
              <button 
                onClick={() => onCommentDeleted(comment.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Sil
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="mt-2">{comment.content}</p>
    </div>
  );
}

function CommentListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-card border border-border rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <Skeleton className="w-10 h-10 rounded-full mr-3" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
} 