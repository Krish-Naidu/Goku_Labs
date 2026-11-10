import { useEffect, useRef, useState, type ReactNode } from "react";

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-in")),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        ref.current!.style.transform = `translate(${dx * 0.3}px, ${dy * 0.4}px)`;
      }}
      onMouseLeave={() => (ref.current!.style.transform = "")}
    >
      {children}
    </span>
  );
}

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
export function Scramble({ text }: { text: string }) {
  const [out, setOut] = useState(text);
  const run = () => {
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      setOut(text.split("").map((c, i) => (i < frame / 2 || c === " " ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(""));
      if (frame / 2 >= text.length) clearInterval(id);
    }, 30);
  };
  return <span onMouseEnter={run}>{out}</span>;
}

export function LondonClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t || "--:--:--"}</span>;
}
