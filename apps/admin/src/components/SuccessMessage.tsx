"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessMessage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setMessage(searchParams.get("success"));
  }, [searchParams]);

  if (!message) return null;
  return (
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
      {message}
    </div>
  );
} 