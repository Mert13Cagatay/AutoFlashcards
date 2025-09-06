'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { AppFlashcard } from '@/lib/store';
import { getCategoryColor } from '@/lib/openai';

interface FlashcardProps {
  flashcard: AppFlashcard;
  showAnswer?: boolean;
  onFlip?: () => void;
  onEdit?: (flashcard: AppFlashcard) => void;
  onDelete?: (id: string) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({
  flashcard,
  showAnswer = false,
  onFlip,
  onEdit,
  onDelete,
  className = '',
  size = 'medium',
  interactive = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(showAnswer);
  const [isFlipping, setIsFlipping] = useState(false);

  // Sync internal state with prop changes
  useEffect(() => {
    setIsFlipped(showAnswer);
  }, [showAnswer]);

  const handleFlip = () => {
    if (!interactive) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipped(!isFlipped);
      setIsFlipping(false);
      onFlip?.();
    }, 150);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'min-h-[200px] p-4';
      case 'large':
        return 'min-h-[400px] p-8';
      default:
        return 'min-h-[300px] p-6';
    }
  };

  const categoryColor = getCategoryColor(flashcard.category);

  return (
    <div className={`group perspective-1000 ${className}`}>
      <Card
        className={`
          relative w-full ${getSizeClasses()} 
          cursor-pointer transform-gpu transition-all duration-300
          hover:shadow-xl hover:scale-[1.02]
          ${isFlipping ? 'scale-95' : ''}
          ${interactive ? 'hover:shadow-xl' : ''}
        `}
        style={{
          transform: isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
        }}
        onClick={handleFlip}
      >
        {/* Category Color Strip */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
          style={{ backgroundColor: categoryColor }}
        />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {flashcard.category}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(flashcard.difficulty)}`}>
              {flashcard.difficulty}
            </span>
            
            {interactive && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(flashcard);
                    }}
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
                
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(flashcard.id);
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center space-y-4">
            {!isFlipped ? (
              // Question Side
              <>
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
                  {flashcard.question}
                </h3>
                {interactive && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to reveal answer
                  </p>
                )}
              </>
            ) : (
              // Answer Side
              <>
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <EyeOff className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {flashcard.answer}
                  </p>
                  {interactive && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click to see question again
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-1">
            {flashcard.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded"
              >
                {tag}
              </span>
            ))}
            {flashcard.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded">
                +{flashcard.tags.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            {flashcard.review_count > 0 && (
              <span>
                {flashcard.review_count} reviews
              </span>
            )}
            {flashcard.success_count > 0 && flashcard.review_count > 0 && (
              <span>
                ({Math.round((flashcard.success_count / flashcard.review_count) * 100)}% success)
              </span>
            )}
          </div>
        </div>

        {/* Flip Icon */}
        {interactive && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <RotateCcw className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Flashcard;
