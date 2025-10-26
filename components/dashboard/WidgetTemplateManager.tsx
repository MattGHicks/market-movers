'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bookmark, Plus, Trash2 } from 'lucide-react';
import { WidgetConfig } from '@/types/widget.types';

interface WidgetTemplate {
  id: string;
  name: string;
  description?: string;
  widgetType: string;
  config: Omit<WidgetConfig, 'id' | 'layout'>;
  timestamp: number;
}

interface WidgetTemplateManagerProps {
  onAddFromTemplate?: (template: WidgetTemplate) => void;
  currentWidget?: WidgetConfig;
}

export function WidgetTemplateManager({
  onAddFromTemplate,
  currentWidget
}: WidgetTemplateManagerProps) {
  const [templates, setTemplates] = useState<WidgetTemplate[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Load templates from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('market-movers-widget-templates');
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load templates:', error);
      }
    }
  }, []);

  // Save templates to localStorage
  const persistTemplates = (newTemplates: WidgetTemplate[]) => {
    localStorage.setItem('market-movers-widget-templates', JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !currentWidget) return;

    const newTemplate: WidgetTemplate = {
      id: crypto.randomUUID(),
      name: templateName.trim(),
      description: templateDescription.trim() || undefined,
      widgetType: currentWidget.type,
      config: {
        type: currentWidget.type,
        version: currentWidget.version,
        name: currentWidget.name,
        settings: currentWidget.settings,
      },
      timestamp: Date.now(),
    };

    const updated = [...templates, newTemplate];
    persistTemplates(updated);
    setTemplateName('');
    setTemplateDescription('');
    setIsSaveDialogOpen(false);
  };

  const handleAddFromTemplate = () => {
    if (!selectedTemplate) return;

    const template = templates.find((t) => t.id === selectedTemplate);
    if (template && onAddFromTemplate) {
      onAddFromTemplate(template);
      setIsLoadDialogOpen(false);
      setSelectedTemplate('');
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updated = templates.filter((t) => t.id !== templateId);
    persistTemplates(updated);
    if (selectedTemplate === templateId) {
      setSelectedTemplate('');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-2">
        {currentWidget && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSaveDialogOpen(true)}
            className="gap-2"
          >
            <Bookmark className="h-4 w-4" />
            Save as Template
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsLoadDialogOpen(true)}
          className="gap-2"
          disabled={templates.length === 0}
        >
          <Plus className="h-4 w-4" />
          Add from Template
        </Button>
      </div>

      {/* Save Template Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Widget as Template</DialogTitle>
            <DialogDescription>
              Save this widget configuration as a reusable template.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="Top Gainers Scanner"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveTemplate();
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template-description">Description (Optional)</Label>
              <Input
                id="template-description"
                placeholder="Scanner configured for stocks gaining 5%+"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
              />
            </div>
            {currentWidget && (
              <div className="rounded-lg border p-3 bg-muted/50">
                <p className="text-sm font-medium">{currentWidget.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Type: {currentWidget.type}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setTemplateName('');
                setTemplateDescription('');
                setIsSaveDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Template Dialog */}
      <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Widget from Template</DialogTitle>
            <DialogDescription>
              Select a saved template to add a pre-configured widget to your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {templates.length > 0 ? (
              <div className="space-y-2">
                <Label>Available Templates</Label>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`flex items-start justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{template.name}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                            {template.widgetType}
                          </span>
                        </div>
                        {template.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {formatDate(template.timestamp)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template.id);
                        }}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No templates saved yet</p>
                <p className="text-sm mt-1">
                  Configure a widget and save it as a template for quick reuse.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTemplate('');
                setIsLoadDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddFromTemplate}
              disabled={!selectedTemplate}
            >
              Add Widget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
