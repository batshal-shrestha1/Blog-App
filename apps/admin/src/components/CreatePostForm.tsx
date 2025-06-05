'use client';

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import RichTextEditor from './RichTextEditor';
import Image from "next/image";

interface FormErrors {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  tags?: string;
  category?: string;
  general?: string;
}

export default function CreatePostForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    tags: "",
    category: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 200) {
      newErrors.description = "Description is too long. Maximum is 200 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = "This is not a valid URL";
      }
    }

    if (!formData.tags.trim()) {
      newErrors.tags = "At least one tag is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setErrors(prev => ({
        ...prev,
        general: "Please fix the errors before saving"
      }));
      return;
    }

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create post');
      }

      setErrors({});
      setSuccessMessage("Post updated successfully");
      // Optionally, clear the form or refresh data here if needed
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors(prev => ({
        ...prev,
        general: error instanceof Error ? error.message : "Error creating post"
      }));
    }
  };

  const handlePreviewToggle = () => {
    if (showPreview) {
      setShowPreview(false);
      // Restore cursor position when closing preview
      if (contentRef.current && cursorPosition !== null) {
        contentRef.current.focus();
        contentRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    } else {
      // Save cursor position when opening preview
      if (contentRef.current) {
        setCursorPosition(contentRef.current.selectionStart);
      }
      setShowPreview(true);
    }
  };

  // Add this function to handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
        setErrors(prev => ({ ...prev, imageUrl: undefined }));
      } else {
        setErrors(prev => ({ ...prev, imageUrl: 'Image upload failed' }));
      }
    } catch {
      setErrors(prev => ({ ...prev, imageUrl: 'Image upload failed' }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <a href="/" className="text-indigo-600 hover:underline font-medium">&larr; Back to Homepage</a>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {successMessage && (
          <div
            style={{
              background: "#d1fae5",
              color: "#065f46",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              textAlign: "center",
              fontWeight: "bold",
            }}
            data-test-id="success-message"
          >
            {successMessage}
          </div>
        )}
        {errors.general && (
          <div className="text-red-600 bg-red-50 p-4 rounded">
            {errors.general}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <button
              type="button"
              onClick={handlePreviewToggle}
              className="text-indigo-600 hover:text-indigo-900"
            >
              {showPreview ? "Close Preview" : "Preview"}
            </button>
          </div>
          {showPreview ? (
            <div data-test-id="content-preview" className="prose mt-4 p-4 border rounded-md">
              <ReactMarkdown>{formData.content}</ReactMarkdown>
            </div>
          ) : (
            <div>
              {/* Fallback textarea for accessibility and testing, visually hidden but accessible */}
              <textarea
                id="content"
                ref={contentRef}
                value={formData.content}
                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="sr-only"
                tabIndex={0}
                aria-label="Content"
              />
              <RichTextEditor
                value={formData.content}
                onChange={(val: string) => setFormData(prev => ({ ...prev, content: val }))}
                placeholder="Write your content..."
              />
            </div>
          )}
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
            <input
              type="text"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <label className="relative inline-flex items-center h-[38px]">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <span className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-600 text-white rounded-md shadow-sm font-medium text-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border border-indigo-600 whitespace-nowrap">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
                Upload Image
              </span>
            </label>
          </div>
          {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
          {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
          {formData.imageUrl && (
            <Image
              src={formData.imageUrl}
              alt="Preview"
              className="mt-2 max-w-xs rounded"
              data-test-id="image-preview"
              width={400}
              height={300}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== '/placeholder.png') {
                  target.src = '/placeholder.png';
                }
              }}
            />
          )}
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}