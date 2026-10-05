"use client";

import { useId, useState } from "react";
import { Mail } from "lucide-react";
import Link from "@/components/ui/site-link";
import { promptReportEmail } from "@/lib/prompts/report";

export function PromptReport({ email, path }: { email: string; path: string }) {
  const fieldId = useId();
  const [issue, setIssue] = useState("Result differs from the instructions");
  const [tool, setTool] = useState("");
  const [description, setDescription] = useState("");
  return (
    <details className="prompt-report">
      <summary>Report a prompt issue</summary>
      {email ? (
        <div className="report-fields">
          <div className="report-field">
            <label htmlFor={`${fieldId}-issue`}>Issue</label>
            <select
              id={`${fieldId}-issue`}
              value={issue}
              onChange={(event) => setIssue(event.target.value)}
            >
              <option>Result differs from the instructions</option>
              <option>Likeness or anatomy problem</option>
              <option>Misleading preview or guidance</option>
              <option>Broken page or copying control</option>
              <option>Rights or safety concern</option>
            </select>
          </div>
          <div className="report-field">
            <label htmlFor={`${fieldId}-tool`}>Tool / model (optional)</label>
            <input
              id={`${fieldId}-tool`}
              value={tool}
              onChange={(event) => setTool(event.target.value)}
              maxLength={120}
              autoComplete="off"
            />
          </div>
          <div className="report-field">
            <label htmlFor={`${fieldId}-description`}>What happened?</label>
            <textarea
              id={`${fieldId}-description`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={1200}
              rows={4}
            />
          </div>
          <p className="fine-print">
            No photos, passwords or private details. Nothing is submitted to
            PicMagic from this form; your email app opens a draft for you to
            review and send.
          </p>
          <a
            className="button secondary"
            href={promptReportEmail(email, path, issue, tool, description)}
          >
            <Mail size={16} aria-hidden="true" /> Prepare issue email
          </a>
        </div>
      ) : (
        <p>
          <Link href="/contact">Contact PicMagic</Link> with this page address
          and the problem. Do not send private photographs.
        </p>
      )}
    </details>
  );
}
