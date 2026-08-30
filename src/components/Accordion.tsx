"use client";

import { useState } from "react";
import MultilineText from "./MultilineText";

type AccordionItem = {
  q: string;
  a: string;
};

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-2 overflow-hidden rounded-2xl bg-pure-white shadow-sm">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-text2 text-green-3">{item.q}</span>
              <span
                className={`shrink-0 text-2xl leading-none text-green-3 transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-6">
                <MultilineText text={item.a} className="text-text5 text-gray-4" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
