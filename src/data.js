// Contenido de la landing. Las sentencias conservan la redacción original del TP.
export const startup = {
  nombre: "NEXO",
  rubro: "Servicios y reparaciones",
  objetivo:
    "Conexión entre clientes y profesionales de reparaciones según servicio, ubicación y disponibilidad.",
  bloque: "Permisos y contratación",
  sorteo: "S11-B",
};

// kind: start | tool | decision | action | human | end   ·   d: true = decisión de diseño del grupo
export const propuestas = [
  {
    id: "r3",
    regla: "R3",
    sentencia:
      "Si el cliente todavía no autorizó una propuesta concreta, el sistema la mantiene pendiente y no envía una solicitud de contratación.",
    titulo: "El guardián de la autorización",
    beneficio:
      "El agente protege al cliente: ninguna contratación sale sin su autorización expresa. La propuesta queda visible y pendiente, sin perderse ni avanzar sola.",
    ficha: {
      datos: "Estado de autorización de la propuesta concreta",
      condicion: "El cliente todavía NO autorizó esa propuesta",
      consecuencia: "La propuesta queda pendiente y NO se envía solicitud de contratación",
    },
    casos: { yes: "Caso A · el cliente todavía no autorizó", no: "Caso B · el cliente ya autorizó" },
    flujo: [
      { id: "r3-receive-proposal", kind: "start", t: "El cliente recibe una propuesta concreta de un profesional" },
      { id: "r3-check-authorization", kind: "tool", t: "El agente consulta el estado de autorización de esa propuesta" },
      {
        id: "r3-authorization-decision",
        kind: "decision",
        t: "¿El cliente todavía NO autorizó la propuesta?",
        yes: [
          { id: "r3-keep-pending", kind: "action", t: "Mantener la propuesta pendiente (no se envía solicitud)" },
          { id: "r3-remind-authorization", kind: "action", d: true, t: "Recordar al cliente que falta su autorización" },
          { id: "r3-pending-result", kind: "end", t: "Propuesta pendiente, sin solicitud enviada" },
        ],
        no: [
          { id: "r3-authorization-already-given", kind: "end", t: "La regla no aplica: continúa en el Flujo 2 (R4)" },
        ],
      },
    ],
    detalles: [
      ["Qué datos entran", "La propuesta concreta (profesional, servicio, precio) y su estado de autorización, consultado en el registro de propuestas."],
      ["Qué se decide", "Si el cliente todavía no autorizó. La sentencia no pide más: no se evalúa al profesional en esta regla."],
      ["Qué acción se propone", "Mantener la propuesta pendiente y bloquear el envío de la solicitud de contratación."],
      ["Resultado esperado", "La propuesta sigue visible como pendiente y no se genera ninguna solicitud."],
      ["Excepción e intervención humana", "Caso límite: el cliente toca «contratar» sin haber autorizado una propuesta concreta (por ejemplo, hay varias abiertas). El agente no elige por él: le pide que seleccione una. Si el cliente reclama que sí autorizó, una persona del equipo revisa el registro. Decisión del grupo, no de la sentencia."],
    ],
  },
  {
    id: "r4",
    regla: "R4",
    sentencia:
      "Si el cliente autoriza una propuesta vigente de un profesional verificado y disponible, el sistema envía la solicitud y la muestra pendiente de aceptación del profesional.",
    titulo: "Del «sí» del cliente a la solicitud",
    beneficio:
      "Cuando todo está en regla, el agente convierte la autorización en una solicitud enviada, sin pasos manuales. El cliente ve en todo momento que se espera la respuesta del profesional.",
    ficha: {
      datos: "Autorización del cliente, vigencia de la propuesta, verificación y disponibilidad del profesional",
      condicion: "Autorizó Y la propuesta está vigente Y el profesional está verificado Y disponible",
      consecuencia: "Se envía la solicitud y se muestra pendiente de aceptación del profesional",
    },
    casos: { yes: "Caso A · cumple las tres condiciones", no: "Caso B · el profesional ya no está disponible" },
    flujo: [
      { id: "r4-client-authorizes", kind: "start", t: "El cliente autoriza una propuesta" },
      { id: "r4-check-conditions", kind: "tool", t: "El agente consulta vigencia de la propuesta, verificación y disponibilidad del profesional" },
      {
        id: "r4-conditions-decision",
        kind: "decision",
        t: "¿Vigente Y profesional verificado Y disponible?",
        yes: [
          { id: "r4-send-request", kind: "action", t: "Enviar la solicitud de contratación" },
          { id: "r4-show-pending", kind: "action", t: "Mostrarla «pendiente de aceptación del profesional»" },
          { id: "r4-wait-for-professional", kind: "end", t: "A la espera de la respuesta del profesional" },
        ],
        no: [
          { id: "r4-review-conditions", kind: "human", d: true, t: "Una persona revisa el motivo (vencida, no verificado o no disponible)" },
          { id: "r4-inform-client", kind: "action", d: true, t: "Informar al cliente y ofrecerle otras propuestas" },
          { id: "r4-no-request-result", kind: "end", t: "Sin solicitud enviada; el cliente decide cómo seguir" },
        ],
      },
    ],
    detalles: [
      ["Qué datos entran", "La autorización del cliente y, desde el registro de profesionales y la agenda, la vigencia de la propuesta, el estado de verificación y la disponibilidad."],
      ["Qué se decide", "Si se cumplen TODAS las condiciones a la vez (Y). Si falta una sola, la regla no se aplica."],
      ["Qué acción se propone", "Enviar la solicitud de contratación y mostrarla como pendiente de aceptación. El agente no acepta por el profesional."],
      ["Resultado esperado", "Solicitud enviada, visible para el cliente como pendiente hasta que el profesional responda."],
      ["Excepción e intervención humana", "Caso límite: el profesional deja de estar disponible entre la autorización y el envío; se vuelve a consultar justo antes de enviar. La sentencia no define qué pasa si no se cumple alguna condición: derivar a una persona e informar al cliente es una decisión de diseño del grupo."],
    ],
  },
];
