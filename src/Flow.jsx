import { useState } from "react";

const ETIQUETA = { start: "Inicio", tool: "Consulta", decision: "Decisión", action: "Acción", human: "Persona", end: "Resultado" };

function Seq({ steps, active }) {
  return steps.map((s, i) => (
    <div className="seq" key={s.id}>
      {i > 0 && <span className="arrow" aria-hidden="true">↓</span>}
      <div className={`node n-${s.kind}${s.d ? " design" : ""}`}>
        <small>{ETIQUETA[s.kind]}{s.d ? " · decisión del grupo" : ""}</small>
        {s.t}
      </div>
      {s.kind === "decision" && (
        <>
          <span className="arrow" aria-hidden="true">↓</span>
          <div className="branches">
            {["yes", "no"].map((k) => (
              <div key={k} className={`branch${active && active !== k ? " off" : ""}`}>
                <b className={`tag ${k}`}>{k === "yes" ? "SÍ" : "NO"}</b>
                <Seq steps={s[k]} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  ));
}

export default function Flow({ propuesta }) {
  const [caso, setCaso] = useState("yes");
  return (
    <div className="flow">
      <fieldset className="casos">
        <legend>Recorrer un caso</legend>
        <div className="casos-opciones">
          {["yes", "no"].map((k) => (
            <button key={k} aria-pressed={caso === k} onClick={() => setCaso(k)}>
              {propuesta.casos[k]}
            </button>
          ))}
        </div>
      </fieldset>
      <Seq steps={propuesta.flujo} active={caso} />
      <p className="leyenda"><span className="design-dot" /> Borde punteado: alternativa agregada por el grupo, no definida por la sentencia.</p>
    </div>
  );
}
