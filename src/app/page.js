"use client";

import Link from "next/link";
import TypingTest from "@/components/TypingTest";

export default function Home() {
  return (
    <div>
      <TypingTest />

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            What this typing test measures
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Every test gives you two core numbers: your words per minute
            (WPM), a standard measure of raw typing speed, and your
            accuracy, the percentage of characters typed correctly. Beyond
            that, you get a per-key error heatmap showing exactly which
            keys are slowing you down — most typing tests only give you a
            final score and leave you guessing why. This one is built to
            actually show you where to improve.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Why typing speed matters
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Most office and administrative roles list a minimum WPM
            requirement, and faster typing directly reduces the friction
            between having a thought and getting it down — whether that's
            an email, a document, or a line of code. Students use typing
            speed to keep up with note-taking, and developers benefit from
            a related but distinct skill: comfort with the symbols and
            syntax that make up real code, which is different enough from
            plain-word typing that we built a{" "}
            <Link href="/code-typing-test" className="underline" style={{ color: "var(--accent-dark)" }}>
              dedicated code typing test
            </Link>{" "}
            for it.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            More ways to practice
          </h2>
          <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
            Beyond the standard test above, YourTyping includes a few other
            ways to build speed depending on what you're working on:
          </p>
          <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: "var(--text-secondary)" }}>
            <li>
              <Link href="/1-minute-typing-test" className="underline" style={{ color: "var(--accent-dark)" }}>
                1-minute typing test
              </Link>{" "}
              — a quick, standardized test length, the same one most typing
              certifications use
            </li>
            <li>
              <Link href="/code-typing-test" className="underline" style={{ color: "var(--accent-dark)" }}>
                Code typing test
              </Link>{" "}
              — practice on real programming keywords and symbols instead
              of plain English words
            </li>
            <li>
              <Link href="/game" className="underline" style={{ color: "var(--accent-dark)" }}>
                Typing game
              </Link>{" "}
              — a lower-pressure way to build repetition without a
              countdown timer
            </li>
            <li>
              <Link href="/blog" className="underline" style={{ color: "var(--accent-dark)" }}>
                Blog
              </Link>{" "}
              — guides and data on typing speed, including realistic
              benchmarks by age and profession
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
