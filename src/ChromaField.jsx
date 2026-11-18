import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ChromaField({ children, radius = 260, className = "" }) {
  const rootRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const r = root.getBoundingClientRect();
    pos.current = { x: r.width / 2, y: r.height / 2 };
    root.style.setProperty("--chroma-r", `${radius}px`);

    const apply = () => {
      root.style.setProperty("--chroma-x", `${pos.current.x}px`);
      root.style.setProperty("--chroma-y", `${pos.current.y}px`);
    };
    apply();

    const onMove = (e) => {
      const b = root.getBoundingClientRect();
      gsap.to(pos.current, { x: e.clientX - b.left, y: e.clientY - b.top, duration: 0.45, ease: "power3.out", overwrite: true, onUpdate: apply });
      const card = e.target.closest?.(".node, .chroma-card");
      if (card) {
        const c = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - c.left}px`);
        card.style.setProperty("--my", `${e.clientY - c.top}px`);
      }
    };
    const onEnter = () => root.classList.add("is-chroma");
    const onLeave = () => root.classList.remove("is-chroma");

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      gsap.killTweensOf(pos.current);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [radius]);

  return (
    <div ref={rootRef} className={`chroma-field ${className}`}>
      {children}
      <div className="chroma-overlay" aria-hidden="true" />
    </div>
  );
}