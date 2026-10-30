import { EDIFICIOS, MEJORAS, LOGROS, BONO_POR_LOGRO } from './data';

const CLAVE_GUARDADO = 'ajoloteTycoon:v1';
const CRECIMIENTO = 1.15;
const MAX_OFFLINE_SEG = 8 * 60 * 60;
const FACTOR_OFFLINE = 0.5;

export const estadoInicial = () => ({
  huevos: 0,
  total: 0,
  clicks: 0,
  giros: 0,
  jackpots: 0,
  edificios: EDIFICIOS.map(() => 0),
  mejoras: [],
  logros: [],
  toasts: [],
  bienvenida: null,
});

// ---------- Calculos derivados ----------

const mejorasCompradas = (s) => MEJORAS.filter((m) => s.mejoras.includes(m.id));

export const multiplicadorGlobal = (s) => {
  let m = 1 + s.logros.length * BONO_POR_LOGRO;
  mejorasCompradas(s)
    .filter((x) => x.efecto === 'global')
    .forEach((x) => (m *= x.multiplicador));
  return m;
};

export const produccionEdificio = (s, i) => {
  let m = 1;
  mejorasCompradas(s)
    .filter((x) => x.efecto === 'edificio' && x.edificioIndex === i)
    .forEach((x) => (m *= x.multiplicador));
  return EDIFICIOS[i].produccion * m * multiplicadorGlobal(s);
};

export const porSegundo = (s) =>
  s.edificios.reduce((acc, cantidad, i) => acc + cantidad * produccionEdificio(s, i), 0);

export const porClick = (s) => {
  let base = 1;
  let porcentaje = 0;
  mejorasCompradas(s).forEach((x) => {
    if (x.efecto === 'click') base *= x.multiplicador;
    if (x.efecto === 'clicPorcentaje') porcentaje += x.valor;
  });
  return base + porSegundo(s) * porcentaje;
};

// Precio de comprar n edificios cuando ya tienes "cantidad"
export const precioEdificios = (i, cantidad, n = 1) => {
  const base = EDIFICIOS[i].precioBase * Math.pow(CRECIMIENTO, cantidad);
  return Math.ceil((base * (Math.pow(CRECIMIENTO, n) - 1)) / (CRECIMIENTO - 1));
};

export const maximoComprable = (i, cantidad, huevos) => {
  const base = EDIFICIOS[i].precioBase * Math.pow(CRECIMIENTO, cantidad);
  const n = Math.floor(Math.log((huevos * (CRECIMIENTO - 1)) / base + 1) / Math.log(CRECIMIENTO));
  return Math.max(0, n);
};

export const mejoraDisponible = (s, m) =>
  !s.mejoras.includes(m.id) && (m.requiere === undefined || s.edificios[m.edificioIndex] >= m.requiere);

// La apuesta crece con tu produccion para que la tragamonedas siga teniendo sentido
export const apuestaBase = (s) => Math.max(50, Math.round(porSegundo(s) * 30));

// ---------- Logros ----------

const revisarLogros = (s) => {
  const nuevos = LOGROS.filter((l) => !s.logros.includes(l.id) && l.cumple(s));
  if (nuevos.length === 0) return s;
  return {
    ...s,
    logros: [...s.logros, ...nuevos.map((l) => l.id)],
    toasts: [
      ...s.toasts,
      ...nuevos.map((l) => ({ id: `${l.id}-${Date.now()}`, emoji: l.emoji, titulo: '¡Logro desbloqueado!', texto: l.nombre })),
    ],
  };
};

// ---------- Reducer ----------

const ganar = (s, cantidad) => ({ ...s, huevos: s.huevos + cantidad, total: s.total + cantidad });

export function reducer(s, accion) {
  switch (accion.tipo) {
    case 'tick': {
      const ps = porSegundo(s);
      if (ps === 0) return s;
      return revisarLogros(ganar(s, ps * accion.dt));
    }
    case 'click':
      return revisarLogros({ ...ganar(s, porClick(s)), clicks: s.clicks + 1 });

    case 'comprarEdificio': {
      const { i, n } = accion;
      if (n <= 0) return s;
      const precio = precioEdificios(i, s.edificios[i], n);
      if (s.huevos < precio) return s;
      const edificios = [...s.edificios];
      edificios[i] += n;
      return revisarLogros({ ...s, huevos: s.huevos - precio, edificios });
    }
    case 'comprarMejora': {
      const m = MEJORAS.find((x) => x.id === accion.id);
      if (!m || !mejoraDisponible(s, m) || s.huevos < m.precio) return s;
      return revisarLogros({ ...s, huevos: s.huevos - m.precio, mejoras: [...s.mejoras, m.id] });
    }
    case 'apostar':
      if (s.huevos < accion.monto) return s;
      return revisarLogros({ ...s, huevos: s.huevos - accion.monto, giros: s.giros + 1 });

    case 'premio':
      return revisarLogros({
        ...s,
        huevos: s.huevos + accion.ganancia,
        jackpots: s.jackpots + (accion.jackpot ? 1 : 0),
      });

    case 'quitarToast':
      return { ...s, toasts: s.toasts.filter((t) => t.id !== accion.id) };

    case 'cerrarBienvenida':
      return { ...s, bienvenida: null };

    case 'reiniciar':
      borrarPartida();
      return estadoInicial();

    default:
      return s;
  }
}

// ---------- Guardado ----------

export function guardarPartida(s) {
  const { toasts, bienvenida, ...datos } = s;
  try {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify({ ...datos, ultimaVez: Date.now() }));
  } catch (e) {
    // Sin almacenamiento disponible (modo privado): el juego sigue sin guardar
  }
}

function borrarPartida() {
  try {
    localStorage.removeItem(CLAVE_GUARDADO);
  } catch (e) {
    // nada que borrar
  }
}

export function cargarPartida() {
  const base = estadoInicial();
  let datos;
  try {
    datos = JSON.parse(localStorage.getItem(CLAVE_GUARDADO));
  } catch (e) {
    return base;
  }
  if (!datos) return base;

  const s = {
    ...base,
    ...datos,
    edificios: EDIFICIOS.map((_, i) => Number(datos.edificios?.[i]) || 0),
    mejoras: Array.isArray(datos.mejoras) ? datos.mejoras : [],
    logros: Array.isArray(datos.logros) ? datos.logros : [],
    toasts: [],
  };
  delete s.ultimaVez;

  // Ganancias mientras no estabas
  const segundos = Math.min(MAX_OFFLINE_SEG, Math.max(0, (Date.now() - (datos.ultimaVez || Date.now())) / 1000));
  const ganancia = porSegundo(s) * segundos * FACTOR_OFFLINE;
  if (segundos > 60 && ganancia >= 1) {
    return { ...ganar(s, ganancia), bienvenida: { segundos, ganancia } };
  }
  return s;
}

// ---------- Formato ----------

const SUFIJOS = [
  [1e18, 'Qi'],
  [1e15, 'Qa'],
  [1e12, 'T'],
  [1e9, 'B'],
  [1e6, 'M'],
  [1e3, 'K'],
];

export const formato = (num) => {
  for (const [valor, sufijo] of SUFIJOS) {
    if (num >= valor) return (num / valor).toFixed(2) + sufijo;
  }
  return Math.floor(num).toLocaleString('es-EC');
};

export const formatoDecimal = (num) => (num < 1000 ? num.toFixed(1) : formato(num));

export const formatoTiempo = (seg) => {
  const h = Math.floor(seg / 3600);
  const m = Math.floor((seg % 3600) / 60);
  if (h > 0) return `${h} h ${m} min`;
  return `${m} min`;
};
