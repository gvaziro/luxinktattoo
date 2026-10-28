"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { whatsappLink } from "@/content/site";
import { WhatsAppIcon } from "./icons";

export function FloatingWhatsApp({ label, message }: { label: string; message: string }) {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 900;
    setShow(y > window.innerHeight * 0.85 && !nearEnd);
  });

  return (
    <AnimatePresence>
      {show ? (
        <motion.a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="group fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-blood text-bone shadow-[0_10px_40px_-10px_rgba(200,22,29,0.7)] md:bottom-8 md:right-8 md:size-16"
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-blood/40 [animation-duration:2.4s]" aria-hidden="true" />
          <WhatsAppIcon className="relative size-6 transition-transform duration-500 group-hover:rotate-12 md:size-7" />
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
