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
import { X, Star } from 'lucide-react';

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
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (name: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const currentFiles = formData[name] || [];
      
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));

      handleInputChange(name, [...currentFiles, ...newFiles]);
    }
  };

  const removeFile = (name: string, index: number) => {
    const currentFiles = formData[name] || [];
    const updatedFiles = currentFiles.filter((_: any, i: number) => i !== index);
    handleInputChange(name, updatedFiles);
  };

  const handleSubmit = () => {
    onSubmit(item, formData);
    setFormData({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg">Update {config.title}</DialogTitle>
          <DialogDescription className="text-xs">
            Customer: <span className="font-semibold text-foreground">{item.customerName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 max-h-[70vh] overflow-y-auto">
          {config.formFields.map((field) => {
            const isCallDate = field.name === 'callDate';
            const showCallDate = isCallDate ? formData['status'] === 'need_time' : true;

            if (!showCallDate) return null;

            return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-foreground text-xs font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === 'text' && (
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="border-border h-8 text-xs"
                />
              )}

              {field.type === 'number' && (
                <Input
                  id={field.name}
                  type="number"
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="border-border h-8 text-xs"
                />
              )}

              {field.type === 'textarea' && (
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="border-border text-xs"
                  rows={2}
                />
              )}

              {field.type === 'date' && (
                <Input
                  id={field.name}
                  type="date"
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="border-border h-8 text-xs"
                />
              )}

              {field.type === 'select' && (
                <Select value={formData[field.name] || ''} onValueChange={(value) => handleInputChange(field.name, value)}>
                  <SelectTrigger className="border-border h-8 text-xs">
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-[10px]">
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
                <div className="space-y-4">
                  <input
                    ref={(el) => {
                      if (el) fileInputs.current[field.name] = el;
                    }}
                    type="file"
                    multiple
                    accept={field.label.toLowerCase().includes('video') ? 'video/*' : field.label.toLowerCase().includes('image') ? 'image/*' : '*/*'}
                    onChange={(e) => handleFileUpload(field.name, e)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputs.current[field.name]?.click()}
                    className="w-full border-border h-10 border-dashed text-xs"
                  >
                    {`Upload ${field.label}`}
                  </Button>

                  {/* File Preview Grid */}
                  {formData[field.name]?.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {formData[field.name].map((file: any, index: number) => {
                        const isVideo = file.name.match(/\.(mp4|webm|ogg)$/i) || field.label.toLowerCase().includes('video');
                        const isImage = file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) || field.label.toLowerCase().includes('image');
                        
                        return (
                        <div key={index} className="relative group bg-muted/40 rounded-lg p-1.5 border border-border">
                            {isVideo ? (
                                <video
                                    src={file.url}
                                    controls
                                    className="w-full h-16 object-cover rounded-md"
                                />
                            ) : isImage ? (
                                <img
                                    src={file.url || "/placeholder.svg"}
                                    alt="preview"
                                    className="w-full h-16 object-cover rounded-md"
                                />
                            ) : (
                                <div className="w-full h-16 bg-muted flex items-center justify-center rounded-md border border-border">
                                    <span className="text-xs font-medium text-muted-foreground uppercase">
                                        {file.name.split('.').pop() || 'FILE'}
                                    </span>
                                </div>
                            )}
                            <div className="mt-1 flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground truncate max-w-[60px]" title={file.name}>
                                    {file.name}
                                </span>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => removeFile(field.name, index)}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                      )})}
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

              {field.type === 'star-rating' && (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleInputChange(field.name, star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          (formData[field.name] || 0) >= star
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            );
          })}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button variant="outline" onClick={onClose} className="border-border bg-transparent h-8 text-xs">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
