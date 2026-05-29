"use client";

import { useRef } from "react";
import Image from "next/image";
import { getStaffToken } from "@/lib/staff-client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Star, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface ProductImageManagerProps {
  images: string[];
  category: string;
  onChange: (images: string[]) => void;
  isUploading: boolean;
  onUploadingChange: (v: boolean) => void;
}

export default function ProductImageManager({
  images,
  category,
  onChange,
  isUploading,
  onUploadingChange,
}: ProductImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !category) return;

    const token = getStaffToken();

    onUploadingChange(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("category", category);
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            credentials: "include",
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Upload failed");
          return data.url as string;
        })
      );
      onChange([...images, ...urls]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      onUploadingChange(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const setFeatured = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [img] = next.splice(index, 1);
    next.unshift(img);
    onChange(next);
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= images.length) return;
    const arr = [...images];
    [arr[index], arr[next]] = [arr[next], arr[index]];
    onChange(arr);
  };

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Product images</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isUploading || !category}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>
      {!category && <p className="text-xs text-amber-600">Select a category before uploading.</p>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((url, i) => (
          <div key={url + i} className="relative group rounded-lg border overflow-hidden bg-brand-gray-50">
            <div className="aspect-square relative">
              <Image src={url} alt="" fill className="object-cover" sizes="120px" />
            </div>
            {i === 0 && (
              <span className="absolute top-1 left-1 bg-brand-green text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Star className="h-3 w-3" /> Featured
              </span>
            )}
            <div className="absolute bottom-0 inset-x-0 flex justify-center gap-1 p-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              {i !== 0 && (
                <button type="button" onClick={() => setFeatured(i)} className="p-1 text-white" title="Set featured">
                  <Star className="h-3.5 w-3.5" />
                </button>
              )}
              <button type="button" onClick={() => move(i, -1)} className="p-1 text-white" disabled={i === 0}>
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => move(i, 1)} className="p-1 text-white" disabled={i === images.length - 1}>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => remove(i)} className="p-1 text-brand-red">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
