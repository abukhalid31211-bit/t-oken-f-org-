import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, description, children, maxWidth = "max-w-lg" }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
      dir="rtl"
    >
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }}
        onClick={onClose}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          pointerEvents: "none",
        }}
      >
        <div
          ref={contentRef}
          className={`relative w-full ${maxWidth} bg-background border border-border rounded-sm shadow-2xl p-6`}
          style={{ pointerEvents: "all" }}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || description) && (
            <div className="mb-5">
              {title && (
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-bold tracking-tight flex-1">{title}</h2>
                  <button
                    onClick={onClose}
                    className="size-8 grid place-items-center text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors shrink-0 mt-0.5"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
