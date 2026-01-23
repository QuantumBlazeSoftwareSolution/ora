"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, X, FileIcon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  bucketName?: string;
  folder?: string;
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  allowedTypes?: string[]; // e.g. ['image/png', 'image/jpeg']
  maxSizeMB?: number; // e.g. 5
  label?: string;
  defaultValue?: string;
}

export function FileUpload({
  bucketName = "documents",
  onUploadComplete,
  onUploadError,
  className,
  allowedTypes,
  maxSizeMB = 5,
  label = "Upload File",
  defaultValue,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate Type
      if (allowedTypes && !allowedTypes.includes(selectedFile.type)) {
        alert(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`);
        return;
      }

      // Validate Size
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        alert(`File too large. Max size: ${maxSizeMB}MB`);
        return;
      }

      setFile(selectedFile);

      // Create local preview if image
      if (selectedFile.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setProgress(10); // Start progress

      const timestamp = new Date().getTime();
      const fileExt = file.name.split(".").pop();
      // Generate clean filename
      const fileName = `${timestamp}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      setProgress(80);

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(fileName);

      setProgress(100);
      onUploadComplete(publicUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      if (onUploadError) {
        onUploadError(error as Error);
      } else {
        alert("Upload failed. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border-2 border-dashed border-border rounded-xl p-6 transition-colors",
          !file && "hover:border-primary/50 hover:bg-muted/50 cursor-pointer",
          isUploading && "opacity-50 pointer-events-none",
        )}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
          accept={allowedTypes?.join(",")}
        />

        {!file && !preview ? (
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <UploadCloud size={24} />
            </div>
            <div className="text-sm font-medium text-foreground">{label}</div>
            <p className="text-xs text-muted-foreground">
              Max size {maxSizeMB}MB.{" "}
              {allowedTypes ? allowedTypes.join(", ") : "All files"} allowed.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Preview Section */}
            {preview ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                <FileIcon className="text-muted-foreground" />
              </div>
            )}

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {file ? file.name : "Current File"}
              </p>
              <p className="text-xs text-muted-foreground">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Ready"}
              </p>
              {progress === 100 && (
                <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-1">
                  <CheckCircle size={12} /> Uploaded
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {file && !isUploading && progress !== 100 && (
                <Button size="sm" onClick={handleUpload}>
                  Upload
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                disabled={isUploading}
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="mt-4 space-y-1">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Uploading... {progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
