import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const noise = (n = 1) => n / 2 - Math.random() * n;
const getXY = (distance, i, total) => {
  const angle = (((360 + noise(8)) / total) * i * Math.PI) / 180;
  return [distance * Math.cos(angle), distance * Math.sin(angle)];
};

export default function GooeyNav({
  items,
  animationTime = 500,
  particleCount = 12,
  particleDistances = [70, 8],
  particleR = 90,
  timeVariance = 250,
  colorCount = 4,
  ariaLabel = "Secciones de la página",
}) {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const lockUntil = useRef(0);
  const location = useLocation();
  const [active, setActive] = useState(0);

  const placeEffect = useCallback((li) => {
    const container = containerRef.current;
    if (!container || !li) return;
    const c = container.getBoundingClientRect();
    const p = li.getBoundingClientRect();
    const box = { left: `${p.x - c.x}px`, top: `${p.y - c.y}px`, width: `${p.width}px`, height: `${p.height}px` };
    for (const el of [filterRef.current, textRef.current]) if (el) Object.assign(el.style, box);
    if (textRef.current) textRef.current.textContent = li.innerText;
  }, []);

  const makeParticles = useCallback(
    (el) => {
      const bubbleTime = animationTime * 2 + timeVariance;
      el.style.setProperty("--time", `${bubbleTime}ms`);
      for (let i = 0; i < particleCount; i++) {
        const t = animationTime * 2 + noise(timeVariance * 2);
        const rotate = noise(particleR / 10);
        const start = getXY(particleDistances[0], particleR - i, particleR);
        const end = getXY(particleDistances[1] + noise(7), particleR - i, particleR);
        el.classList.remove("active");
        setTimeout(() => {
          const particle = document.createElement("span");
          const point = document.createElement("span");
          particle.className = "particle";
          particle.style.setProperty("--start-x", `${start[0]}px`);
          particle.style.setProperty("--start-y", `${start[1]}px`);
          particle.style.setProperty("--end-x", `${end[0]}px`);
          particle.style.setProperty("--end-y", `${end[1]}px`);
          particle.style.setProperty("--time", `${t}ms`);
          particle.style.setProperty("--scale", `${1 + noise(0.2)}`);
          particle.style.setProperty("--color", `var(--gooey-${Math.floor(Math.random() * colorCount) + 1}, #fff)`);
          particle.style.setProperty("--rotate", `${rotate > 0 ? (rotate + particleR / 20) * 10 : (rotate - particleR / 20) * 10}deg`);
          point.className = "point";
          particle.appendChild(point);
          el.appendChild(particle);
          requestAnimationFrame(() => el.classList.add("active"));
          setTimeout(() => particle.remove(), t);
        }, 30);
      }
    },
    [animationTime, particleCount, particleDistances, particleR, timeVariance, colorCount]
  );

  const select = (i, li) => {
    if (i !== active) setActive(i);
    lockUntil.current = Date.now() + 900;
    placeEffect(li);
    if (filterRef.current && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      filterRef.current.querySelectorAll(".particle").forEach((p) => p.remove());
      makeParticles(filterRef.current);
    }
    if (textRef.current) {
      textRef.current.classList.remove("active");
      void textRef.current.offsetWidth;
      textRef.current.classList.add("active");
    }
  };

  const onLinkClick = (item) => {
    if (location.pathname === "/" && location.hash === `#${item.id}`) {
      document.getElementById(item.id)?.scrollIntoView();
    }
  };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (Date.now() < lockUntil.current) return;
        let idx = 0;
        items.forEach((it, i) => {
          const el = document.getElementById(it.id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) idx = i;
        });
        setActive(idx);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  useLayoutEffect(() => {
    const li = navRef.current?.querySelectorAll("li")[active];
    placeEffect(li);
    textRef.current?.classList.add("active");
    const ro = new ResizeObserver(() => placeEffect(navRef.current?.querySelectorAll("li")[active]));
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [active, placeEffect]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav aria-label={ariaLabel}>
        <ul ref={navRef}>
          {items.map((item, i) => (
            <li key={item.id} className={active === i ? "active" : ""}>
              <Link
                to={`/#${item.id}`}
                aria-current={active === i ? "location" : undefined}
                onClick={(e) => {
                  onLinkClick(item);
                  select(i, e.currentTarget.parentElement);
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} aria-hidden="true" />
      <span className="effect text" ref={textRef} aria-hidden="true" />
    </div>
  );
}