"use client";
import { useState } from "react";
const FAQListitem = ({ qa }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <li key={qa.question} className="mb-6">
      <button
        className="py-5 font-semibold border-b w-full text-left flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p>{qa.question}</p>

        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-4"
          >
            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <div className={`${isOpen ? "block" : "hidden"} mt-3 mb-6 opacity-90`}>
        {qa.answer}
      </div>
    </li>
  );
};

export default FAQListitem;
