'use client';

import { ReactNode, useState } from 'react';
import { GripVertical, Settings, RefreshCw, X, Maximize2, Minimize2, Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface BaseWidgetProps {
  title: string;
  children: ReactNode;
  onRefresh?: () => void;
  onConfigure?: () => void;
  onRemove?: () => void;
  onMaximize?: () => void;
  onRename?: (newName: string) => void;
  isLoading?: boolean;
  error?: string;
  footer?: ReactNode;
  className?: string;
}

export function BaseWidget({
  title,
  children,
  onRefresh,
  onConfigure,
  onRemove,
  onMaximize,
  onRename,
  isLoading = false,
  error,
  footer,
  className,
}: BaseWidgetProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(title);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (onMaximize) {
      onMaximize();
    }
  };

  const handleStartEdit = () => {
    setEditedName(title);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (editedName.trim() && editedName !== title && onRename) {
      onRename(editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditedName(title);
    setIsEditingName(false);
  };

  return (
    <div
      className={cn(
        'group flex h-full flex-col bg-card',
        isMaximized && 'fixed inset-0 z-50 m-0 rounded-none',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-2 py-1.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="widget-drag-handle cursor-move">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          {isEditingName ? (
            <div className="flex items-center gap-1 flex-1">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveName();
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
                className="h-7 text-sm font-semibold"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveName}
                className="h-7 w-7"
              >
                <Check className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-semibold truncate">{title}</h3>
              {onRename && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStartEdit}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Rename"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
            </>
          )}
          {isLoading && (
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center gap-1">
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              className="h-8 w-8"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMaximize}
            className="h-8 w-8"
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          {onConfigure && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onConfigure}
              className="h-8 w-8"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 text-destructive"
              title="Remove"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-2">
        {error ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t px-2 py-1 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
