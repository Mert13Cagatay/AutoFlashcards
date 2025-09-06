'use client';

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  showDontAskAgain?: boolean;
  onConfirm: (dontAskAgain?: boolean) => void;
  onCancel?: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  showDontAskAgain = false,
  onConfirm,
  onCancel,
}) => {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const handleConfirm = () => {
    onConfirm(dontAskAgain);
    setDontAskAgain(false); // Reset for next time
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setDontAskAgain(false); // Reset for next time
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            {variant === 'destructive' && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            )}
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <DialogDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </DialogDescription>

        {showDontAskAgain && (
          <div className="flex items-center space-x-2 py-2">
            <input
              type="checkbox"
              id="dont-ask-again"
              checked={dontAskAgain}
              onChange={(e) => setDontAskAgain(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label 
              htmlFor="dont-ask-again" 
              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Don't ask me again for deleting flashcards
            </label>
          </div>
        )}

        <DialogFooter className="flex space-x-2 sm:space-x-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Hook for managing confirmation dialogs
export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
    showDontAskAgain?: boolean;
    onConfirm: (dontAskAgain?: boolean) => void;
    onCancel?: () => void;
  } | null>(null);

  const showConfirm = (options: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
    showDontAskAgain?: boolean;
    onConfirm: (dontAskAgain?: boolean) => void;
    onCancel?: () => void;
  }) => {
    setConfig(options);
    setIsOpen(true);
  };

  const hideConfirm = () => {
    setIsOpen(false);
    setConfig(null);
  };

  const ConfirmDialogComponent = config ? (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      {...config}
    />
  ) : null;

  return {
    showConfirm,
    hideConfirm,
    ConfirmDialogComponent,
  };
};

