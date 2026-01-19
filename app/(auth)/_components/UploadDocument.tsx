"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { handleUploadDocument } from "@/lib/actions/business-actions";

type SnackbarState = { message: string; type: "success" | "error" | null };

const Snackbar = ({ message, type }: SnackbarState) => {
  if (!type) return null;
  const baseClasses =
    "fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 transition-opacity duration-300 font-crimsonpro font-medium";
  const colorClasses =
    type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white";
  return <div className={`${baseClasses} ${colorClasses}`}>{message}</div>;
};

export default function UploadDocumentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: "",
    type: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (snackbar.type) {
      const timer = setTimeout(
        () => setSnackbar({ message: "", type: null }),
        4000,
      );
      return () => clearTimeout(timer);
    }
  }, [snackbar.type]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    if (selectedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    setFile(droppedFile);
    if (droppedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(droppedFile));
    } else {
      setPreview(null);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleUpload = async () => {
    if (!file) {
      setSnackbar({
        message: "Please select a file to upload.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setSnackbar({ message: "", type: null });

    try {
      const token = localStorage.getItem("tempToken");
      if (!token)
        throw new Error("Authentication token missing. Please register again.");

      const formData = new FormData();
      formData.append("document", file);

      const result = await handleUploadDocument(formData, token);

      if (result.success) {
        setSnackbar({
          message: "Document uploaded successfully! Wait for admin approval.",
          type: "success",
        });

        setTimeout(() => {
          localStorage.removeItem("tempToken");
          window.location.href = "/login";
        }, 2000);

        setFile(null);
        setPreview(null);
      } else {
        setSnackbar({ message: result.message, type: "error" });
      }
    } catch (err: any) {
      setSnackbar({
        message: err.message || "An error occurred.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 font-crimsonpro">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Upload Your Business Document
      </h1>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center mb-4 cursor-pointer hover:border-green-700 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="mx-auto max-h-40 object-contain mb-2"
          />
        ) : (
          <div className="py-8">
            <p className="text-gray-500">
              Drag & drop your document here or click to select file
            </p>
            {file && !preview && (
              <p className="mt-2 text-[#0B3D0B] font-medium">{file.name}</p>
            )}
          </div>
        )}
        <p className="text-gray-400 text-sm">
          Allowed: jpeg, jpg, png, pdf, doc, docx
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
      />

      <button
        onClick={handleUpload}
        disabled={isLoading}
        className={`w-full py-3 text-white text-lg rounded-xl font-medium transition ${
          isLoading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-[#0B3D0B] hover:bg-green-900"
        }`}
      >
        {isLoading ? "Uploading..." : "Upload Document"}
      </button>

      <Snackbar message={snackbar.message} type={snackbar.type} />
    </div>
  );
}
