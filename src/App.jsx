import { useEffect, useLayoutEffect, useRef } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import gsap from "gsap";
import Flow from "./Flow.jsx";
import { propuestas, startup } from "./data.js";

function Logo() {
  // El logo original de la startup va en /public/logo-nexo.png (ver README).
  return (
    <img
      className="logo"
      src="./logo-nexo.png"
      alt="Logo de NEXO"
      onError={(e) => {
        e.currentTarget.replaceWith(Object.assign(document.createElement("div"), { className: "logo-fallback", textContent: "NEXO (falta public/logo-nexo.png)" }));
      }}
    />
  );
}

function SectionLink({ id, children }) {
  const location = useLocation();
  return (
    <Link
      to={`/#${id}`}
      onClick={() => {
        if (location.pathname === "/" && location.hash === `#${id}`) {
          document.getElementById(id)?.scrollIntoView();
        }
      }}
    >
      {children}
    </Link>
  );
}

function Home() {
  const raiz = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const targetId = location.hash.slice(1);
    if (targetId) document.getElementById(targetId)?.scrollIntoView();
  }, [location.hash]);

  useLayoutEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".reveal", { opacity: 0, y: 24, duration: 0.6, stagger: 0.1, ease: "power2.out", clearProps: "all" });
    }, raiz);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={raiz}>
      <section id="startup" className="hero reveal">
        <Logo />
        <div>
          <p className="eyebrow">{startup.rubro} · Bloque: {startup.bloque}</p>
          <h1>NEXO: dos sentencias, dos soluciones</h1>
          <p>{startup.objetivo}</p>
          <p className="muted">Startup creada por estudiantes del IFTS 16. Propuesta del Grupo 7 del IFTS 29 · Desarrollo de Sistemas Web · Front End 2026.</p>
        </div>
      </section>

      <section className="reveal">
        <h2>La necesidad</h2>
        <p>
          Contratar un servicio de reparación implica confianza: el cliente debe decidir él mismo cuándo avanzar, y el profesional debe estar verificado y disponible.
          Nuestras dos propuestas describen cómo un futuro agente cuidaría ambas cosas. Esta página sólo explica y dibuja; no ejecuta ningún agente.
        </p>
      </section>

      <section id="propuestas">
        <h2 className="reveal">Dos propuestas</h2>
        <div className="grid2">
          {propuestas.map((p, i) => (
            <article className="card reveal" key={p.id}>
              <p className="eyebrow">Sentencia {i + 1} · {p.regla}</p>
              <blockquote>{p.sentencia}</blockquote>
              <h3>{p.titulo}</h3>
              <p>{p.beneficio}</p>
              <SectionLink id={`flujo-${p.id}`}>Ver el diagrama ↓</SectionLink>
            </article>
          ))}
        </div>
      </section>

      {propuestas.map((p, i) => (
        <section id={`flujo-${p.id}`} className="reveal" key={p.id}>
          <h2>Flujo {i + 1}: {p.titulo}</h2>
          <div className="ficha">
            <div><b>Datos necesarios</b>{p.ficha.datos}</div>
            <div><b>Condición</b>{p.ficha.condicion}</div>
            <div><b>Consecuencia</b>{p.ficha.consecuencia}</div>
          </div>
          <Flow propuesta={p} />
          <div className="detalles">
            {p.detalles.map(([titulo, texto]) => (
              <details key={titulo}>
                <summary>{titulo}</summary>
                <p>{texto}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

export default function App() {
  return (
    <>
      <header className="top">
        <Link to="/">NEXO · Grupo 7 · IFTS 29</Link>
        <nav>
          <SectionLink id="startup">Startup</SectionLink>
          <SectionLink id="propuestas">Propuestas</SectionLink>
          <SectionLink id="flujo-r3">Flujo 1</SectionLink>
          <SectionLink id="flujo-r4">Flujo 2</SectionLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<main><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></main>} />
      </Routes>
      <footer>TP3 · Dos sentencias. Dos soluciones. · Construido 100 % con agentes de programación · Startup original: IFTS 16</footer>
    </>
  );
}
