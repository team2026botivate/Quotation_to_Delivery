'use client';

import React from "react"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { WorkflowItem } from '@/context/WorkflowContext';
import { StageConfig } from '@/lib/stageConfigs';
import { X } from 'lucide-react';

interface UpdateModalProps {
  item: WorkflowItem;
  stage: string;
  config: StageConfig;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: WorkflowItem, data: any) => void;
}

export default function UpdateModal({ item, stage, config, isOpen, onClose, onSubmit }: UpdateModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; url: string }>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (name: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedFiles((prev) => ({
        ...prev,
        [name]: { name: file.name, url },
      }));
      handleInputChange(name, url);
    }
  };

  const removeFile = (name: string) => {
    setUploadedFiles((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
    handleInputChange(name, null);
  };

  const handleSubmit = () => {
    onSubmit(item, formData);
    setFormData({});
    setUploadedFiles({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update {config.title}</DialogTitle>
          <DialogDescription>
            Customer: <span className="font-semibold text-foreground">{item.customerName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 max-h-96 overflow-y-auto">
          {config.formFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-foreground">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === 'text' && (
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="border-border"
                />
              )}

              {field.type === 'number' && (
                <Input
                  id={field.name}
                  type="number"
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="border-border"
                />
              )}

              {field.type === 'textarea' && (
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="border-border"
                  rows={3}
                />
              )}

              {field.type === 'date' && (
                <Input
                  id={field.name}
                  type="date"
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="border-border"
                />
              )}

              {field.type === 'select' && (
                <Select value={formData[field.name] || ''} onValueChange={(value) => handleInputChange(field.name, value)}>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === 'slider' && (
                <div className="space-y-2">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[formData[field.name] || 0]}
                    onValueChange={(value) => handleInputChange(field.name, value[0])}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">{formData[field.name] || 0}%</p>
                </div>
              )}

              {field.type === 'file' && (
                <div className="space-y-2">
                  <input
                    ref={(el) => {
                      if (el) fileInputs.current[field.name] = el;
                    }}
                    type="file"
                    onChange={(e) => handleFileUpload(field.name, e)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputs.current[field.name]?.click()}
                    className="w-full border-border"
                  >
                    {uploadedFiles[field.name] ? 'Change File' : 'Choose File'}
                  </Button>

                  {uploadedFiles[field.name] && (
                    <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">{uploadedFiles[field.name].name}</p>
                        {field.type === 'file' && field.label.toLowerCase().includes('image') && (
                          <img
                            src={uploadedFiles[field.name].url || "/placeholder.svg"}
                            alt="preview"
                            className="mt-2 max-h-48 rounded"
                          />
                        )}
                        {field.type === 'file' && field.label.toLowerCase().includes('video') && (
                          <video
                            src={uploadedFiles[field.name].url}
                            controls
                            className="mt-2 max-h-48 rounded"
                          />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(field.name)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {field.type === 'checkbox' && (
                <div className="flex items-center gap-2">
                  <input
                    id={field.name}
                    type="checkbox"
                    checked={formData[field.name] || false}
                    onChange={(e) => handleInputChange(field.name, e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor={field.name} className="text-sm cursor-pointer text-foreground">
                    {field.label}
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-border bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
