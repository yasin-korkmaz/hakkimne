import React from "react";
import type { NoticeMessage } from "@/lib/receipt/buildNotices";

interface NoticeListProps {
  notices: NoticeMessage[];
}

export default function NoticeList({ notices }: NoticeListProps) {
  if (!notices || notices.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {notices.map((notice, idx) => {
        const isWarning = notice.kind === "warning";

        return (
          <div
            key={`${notice.code}-${idx}`}
            role={isWarning ? "alert" : "status"}
            className={`flex items-start gap-3 p-4 rounded-xl border text-sm leading-relaxed ${
              isWarning
                ? "bg-amber-50/80 border-amber-200 text-amber-900"
                : "bg-blue-50/70 border-blue-200 text-blue-900"
            }`}
          >
            {/* İkon */}
            <div className="shrink-0 mt-0.5">
              {isWarning ? (
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              )}
            </div>

            {/* Metin */}
            <div className="flex-1 font-medium">{notice.text}</div>
          </div>
        );
      })}
    </div>
  );
}
