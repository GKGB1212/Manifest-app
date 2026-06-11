import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { IconButton } from './primitives';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

export function Modal({ open, onClose, title, children, footer, size = 'md' }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-indigo-deep/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog" aria-modal="true" aria-label={title}
            className={`glass relative z-10 w-full ${widths[size]} max-h-[92dvh] overflow-y-auto scroll-thin rounded-t-3xl sm:rounded-3xl`}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.32 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[rgb(var(--border))]/50 bg-[rgb(var(--surface-glass))]/70 px-5 py-3.5 backdrop-blur-xl">
              <h3 className="text-lg font-semibold">{title}</h3>
              <IconButton label="Close" onClick={onClose}><X size={18} /></IconButton>
            </div>
            <div className="px-5 py-4">{children}</div>
            {footer && (
              <div className="sticky bottom-0 flex justify-end gap-2 border-t border-[rgb(var(--border))]/50 bg-[rgb(var(--surface-glass))]/70 px-5 py-3 backdrop-blur-xl">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
