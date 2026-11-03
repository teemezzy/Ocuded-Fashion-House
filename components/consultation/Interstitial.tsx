"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import AnimatedScript from "./AnimatedScript";

const HOLD = 1300; // pause after a line finishes writing
const FADE = 500; // fade-out duration before the next line / advance

export default function Interstitial({
  name,
  onContinue,
}: {
  name?: string;
  onContinue: () => void;
}) {
  const first = name ? name.trim().split(" ")[0] : "";
  const lines = [
    `Thank you for sharing your vision${first ? `, ${first}` : ""}.`,
    "Now — let us know when and where you'd like us to meet.",
  ];

  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  const handleDone = () => {
    // let the finished line rest, then fade out and advance automatically
    setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        if (step < lines.length - 1) {
          setStep((s) => s + 1);
          setExiting(false);
        } else {
          onContinue();
        }
      }, FADE);
    }, HOLD);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-center px-[24px] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#A85D34,#7E4526_62%,#3F2413)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgba(214,168,116,0.25),rgba(214,168,116,0)_70%)]" />

      <div className="relative max-w-[720px] text-bg">
        <div className="flex justify-center mb-[30px]">
          <Logo size={48} color="#F1E7D3" />
        </div>

        <div
          className={`transition-opacity ease-out ${
            exiting ? "opacity-0" : "opacity-100"
          }`}
          style={{ transitionDuration: `${FADE}ms` }}
        >
          <AnimatedScript
            key={step}
            text={lines[step]}
            className="font-script text-clay-light text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.2] block"
            charDelay={55}
            showCaret={false}
            onDone={handleDone}
          />
        </div>
      </div>
    </div>
  );
}
