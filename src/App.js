import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Egg, Timer, MousePointerClick, Trophy, Store, Dices, RotateCcw } from 'lucide-react';
import Ajolote from './components/Ajolote';
import { EDIFICIOS, MEJORAS, LOGROS, SIMBOLOS, PREMIO_PAR, NIVELES_APUESTA, BONO_POR_LOGRO } from './data';
import {
  reducer, cargarPartida, guardarPartida, porSegundo, porClick, produccionEdificio,
  precioEdificios, maximoComprable, mejoraDisponible, apuestaBase,
  formato, formatoDecimal, formatoTiempo,
} from './juego';

const TICK_MS = 100;
const GUARDADO_MS = 5000;

export default function App() {
  const [s, dispatch] = useReducer(reducer, undefined, cargarPartida);
  const [pestana, setPestana] = useState('tienda');

  // Produccion automatica
  useEffect(() => {
    const id = setInterval(() => dispatch({ tipo: 'tick', dt: TICK_MS / 1000 }), TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Guardado automatico y al cerrar la pestana
  const ref = useRef(s);
  ref.current = s;
  useEffect(() => {
    const guardar = () => guardarPartida(ref.current);
    const id = setInterval(guardar, GUARDADO_MS);
    window.addEventListener('beforeunload', guardar);
    document.addEventListener('visibilitychange', guardar);
    return () => {
      clearInterval(id);
      window.removeEventListener('beforeunload', guardar);
      document.removeEventListener('visibilitychange', guardar);
    };
  }, []);

  // Titulo de la pestana con los huevos actuales
  useEffect(() => {
    document.title = `${formato(s.huevos)} huevos · Ajolote Tycoon`;
  }, [s.huevos]);

  const ps = porSegundo(s);

  return (
    <div className="min-h-screen bg-agua text-slate-800 relative overflow-x-hidden">
      <Burbujas />

      <header className="relative z-10 max-w-7xl mx-auto px-4 pt-5 pb-3">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Ajolote className="w-12 h-12 drop-shadow" />
          <h1 className="titulo text-3xl sm:text-4xl font-bold text-white drop-shadow-md">Ajolote Tycoon</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icono={<Egg />} valor={formato(s.huevos)} etiqueta="Huevos" color="text-pink-600" />
          <Stat icono={<Timer />} valor={`${formatoDecimal(ps)}/s`} etiqueta="Por segundo" color="text-sky-600" />
          <Stat icono={<MousePointerClick />} valor={`+${formatoDecimal(porClick(s))}`} etiqueta="Por clic" color="text-violet-600" />
          <Stat icono={<Trophy />} valor={`${s.logros.length}/${LOGROS.length}`} etiqueta="Logros" color="text-amber-600" />
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-8 grid gap-5 lg:grid-cols-[1fr_440px] items-start">
        <Clicker s={s} dispatch={dispatch} />

        <section className="bg-white/90 backdrop-blur rounded-3xl shadow-xl overflow-hidden lg:sticky lg:top-4">
          <nav className="grid grid-cols-3 border-b border-slate-200">
            <Pestana activa={pestana === 'tienda'} onClick={() => setPestana('tienda')} icono={<Store className="w-5 h-5" />} texto="Tienda" />
            <Pestana activa={pestana === 'suerte'} onClick={() => setPestana('suerte')} icono={<Dices className="w-5 h-5" />} texto="Suerte" />
            <Pestana activa={pestana === 'logros'} onClick={() => setPestana('logros')} icono={<Trophy className="w-5 h-5" />} texto="Logros" />
          </nav>
          <div className="p-4 max-h-none lg:max-h-[calc(100vh-11rem)] overflow-y-auto">
            {pestana === 'tienda' && <Tienda s={s} dispatch={dispatch} />}
            {pestana === 'suerte' && <Tragamonedas s={s} dispatch={dispatch} />}
            {pestana === 'logros' && <Logros s={s} dispatch={dispatch} />}
          </div>
        </section>
      </main>

      <footer className="relative z-10 text-center text-white/80 text-sm pb-6">
        Hecho por <a className="underline hover:text-white" href="https://github.com/paniwis">Evelyn Larraga</a> · Tu progreso se guarda en este navegador
      </footer>

      <Toasts toasts={s.toasts} dispatch={dispatch} />
      {s.bienvenida && <Bienvenida datos={s.bienvenida} onCerrar={() => dispatch({ tipo: 'cerrarBienvenida' })} />}
    </div>
  );
}

// ---------- Piezas pequeñas ----------

function Stat({ icono, valor, etiqueta, color }) {
  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl px-3 py-2.5 shadow-md flex items-center gap-3">
      <div className={`${color} shrink-0 [&>svg]:w-6 [&>svg]:h-6`}>{icono}</div>
      <div className="min-w-0">
        <div className={`text-xl sm:text-2xl font-bold tabular-nums truncate ${color}`}>{valor}</div>
        <div className="text-xs text-slate-500">{etiqueta}</div>
      </div>
    </div>
  );
}

function Pestana({ activa, onClick, icono, texto }) {
  return (
    <button
      onClick={onClick}
      className={`py-3 font-semibold flex items-center justify-center gap-2 transition ${
        activa ? 'text-pink-600 border-b-4 border-pink-500 bg-pink-50' : 'text-slate-500 border-b-4 border-transparent hover:bg-slate-50'
      }`}
    >
      {icono}
      {texto}
    </button>
  );
}

function Burbujas() {
  const burbujas = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 8 + Math.random() * 26,
      dur: 9 + Math.random() * 12,
      delay: -Math.random() * 20,
    }))
  ).current;
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      {burbujas.map((b) => (
        <span
          key={b.id}
          className="burbuja"
          style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}
        />
      ))}
    </div>
  );
}

// ---------- Clicker ----------

function Clicker({ s, dispatch }) {
  const [numeros, setNumeros] = useState([]);
  const [golpe, setGolpe] = useState(0);
  const valor = porClick(s);

  const clic = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX || rect.left + rect.width / 2) - rect.left;
    const y = (e.clientY || rect.top + rect.height / 2) - rect.top;
    const id = Date.now() + Math.random();
    setNumeros((prev) => [...prev.slice(-15), { id, x, y, valor }]);
    setTimeout(() => setNumeros((prev) => prev.filter((n) => n.id !== id)), 900);
    setGolpe((g) => g + 1);
    dispatch({ tipo: 'click' });
  };

  return (
    <section className="flex flex-col items-center justify-center py-6 lg:py-12 lg:min-h-[560px]">
      <button
        onClick={clic}
        className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 shadow-2xl ring-8 ring-white/60 select-none outline-none focus-visible:ring-pink-300 transition-transform active:scale-95 hover:scale-[1.03]"
        aria-label="Haz clic en el ajolote"
      >
        <div key={golpe} className={golpe ? 'rebote' : ''}>
          <Ajolote feliz={numeros.length > 0} className="w-full h-full p-6 nadando" />
        </div>
        {numeros.map((n) => (
          <span key={n.id} className="numero-flotante absolute text-3xl font-bold text-amber-300 pointer-events-none" style={{ left: n.x, top: n.y }}>
            +{formatoDecimal(n.valor)}
          </span>
        ))}
      </button>

      <p className="mt-6 text-white text-xl font-semibold drop-shadow">¡Haz clic en el ajolote!</p>
      <p className="text-white/80 text-sm mt-1">{formato(s.total)} huevos en total · {formato(s.clicks)} clics</p>
    </section>
  );
}

// ---------- Tienda ----------

function Tienda({ s, dispatch }) {
  const [cantidad, setCantidad] = useState(1);
  const mejoras = MEJORAS.filter((m) => mejoraDisponible(s, m)).sort((a, b) => a.precio - b.precio);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="titulo text-lg font-bold text-violet-700 mb-2">Mejoras</h2>
        {mejoras.length === 0 ? (
          <p className="text-sm text-slate-500">Compra edificios para desbloquear más mejoras.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {mejoras.slice(0, 6).map((m) => {
              const puede = s.huevos >= m.precio;
              return (
                <button
                  key={m.id}
                  onClick={() => dispatch({ tipo: 'comprarMejora', id: m.id })}
                  disabled={!puede}
                  title={m.descripcion}
                  className="text-left p-3 rounded-xl border-2 transition border-violet-200 bg-violet-50 hover:border-violet-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="font-semibold text-sm leading-tight">{m.nombre}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 hidden sm:block">{m.descripcion}</div>
                  <div className="text-sm font-bold text-violet-700 mt-1">{formato(m.precio)} 🥚</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="titulo text-lg font-bold text-sky-700">Edificios</h2>
          <div className="flex bg-slate-100 rounded-lg p-1 text-sm font-semibold">
            {[1, 10, 'max'].map((op) => (
              <button
                key={op}
                onClick={() => setCantidad(op)}
                className={`px-3 py-1 rounded-md transition ${cantidad === op ? 'bg-white shadow text-sky-700' : 'text-slate-500'}`}
              >
                {op === 'max' ? 'Máx' : `x${op}`}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {EDIFICIOS.map((e, i) => {
            const tiene = s.edificios[i];
            const visible = i === 0 || s.edificios[i - 1] > 0 || tiene > 0;
            const primeroBloqueado = EDIFICIOS.findIndex((_, j) => !(j === 0 || s.edificios[j - 1] > 0 || s.edificios[j] > 0));
            if (!visible && i > primeroBloqueado) return null;
            if (!visible) {
              return (
                <div key={i} className="p-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm flex items-center gap-3">
                  <span className="text-2xl grayscale opacity-40">❓</span> Edificio bloqueado
                </div>
              );
            }
            const n = cantidad === 'max' ? Math.max(1, maximoComprable(i, tiene, s.huevos)) : cantidad;
            const precio = precioEdificios(i, tiene, n);
            const puede = s.huevos >= precio;
            return (
              <button
                key={i}
                onClick={() => dispatch({ tipo: 'comprarEdificio', i, n })}
                disabled={!puede}
                className="w-full text-left p-3 rounded-xl border-2 border-sky-100 bg-white hover:border-sky-400 transition disabled:opacity-55 disabled:cursor-not-allowed flex items-center gap-3"
              >
                <span className="text-4xl shrink-0">{e.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold leading-tight">{e.nombre}</div>
                  <div className="text-xs text-slate-500 truncate">{e.descripcion}</div>
                  <div className="text-xs mt-0.5">
                    <span className="text-emerald-600 font-semibold">+{formatoDecimal(produccionEdificio(s, i))}/s</span>
                    <span className="text-slate-500"> c/u · comprar x{n}: </span>
                    <span className="font-bold text-amber-600">{formato(precio)} 🥚</span>
                  </div>
                </div>
                <span className="titulo text-2xl font-bold text-sky-700 tabular-nums">{tiene}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- Tragamonedas ----------

const simboloAlAzar = () => SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)].s;

function Tragamonedas({ s, dispatch }) {
  const [rodillos, setRodillos] = useState(['🦎', '🥚', '💎']);
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [historial, setHistorial] = useState([]);
  const base = apuestaBase(s);

  const girar = (nivel) => {
    const monto = base * nivel.factor;
    if (girando || s.huevos < monto) return;
    dispatch({ tipo: 'apostar', monto });
    setGirando(true);
    setResultado(null);

    const final = [simboloAlAzar(), simboloAlAzar(), simboloAlAzar()];
    let vueltas = 0;
    const id = setInterval(() => {
      vueltas += 1;
      // los rodillos se detienen uno por uno
      setRodillos((prev) => prev.map((r, i) => (vueltas > 10 + i * 5 ? final[i] : simboloAlAzar())));
      if (vueltas > 20) {
        clearInterval(id);
        let ganancia = 0;
        let mensaje = 'Sin suerte esta vez';
        let jackpot = false;
        if (final[0] === final[1] && final[1] === final[2]) {
          ganancia = monto * SIMBOLOS.find((x) => x.s === final[0]).premio;
          mensaje = '¡JACKPOT!';
          jackpot = true;
        } else if (final[0] === final[1] || final[1] === final[2] || final[0] === final[2]) {
          ganancia = monto * PREMIO_PAR;
          mensaje = '¡Dos iguales!';
        }
        if (ganancia > 0) dispatch({ tipo: 'premio', ganancia, jackpot });
        setResultado({ ganancia, mensaje, jackpot });
        setHistorial((h) => [{ id: Date.now(), final, ganancia }, ...h].slice(0, 5));
        setGirando(false);
      }
    }, 80);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-4 bg-gradient-to-b from-amber-300 to-amber-500 shadow-inner border-4 border-amber-600">
        <h2 className="titulo text-center text-xl font-bold text-amber-900 mb-3">🎰 Tragamonedas de ajolotes</h2>
        <div className="bg-slate-900 rounded-2xl p-3 grid grid-cols-3 gap-2">
          {rodillos.map((r, i) => (
            <div key={i} className={`bg-white rounded-xl aspect-square flex items-center justify-center text-5xl sm:text-6xl ${girando ? 'girando' : ''}`}>
              {r}
            </div>
          ))}
        </div>
        <div className="h-14 mt-3 flex items-center justify-center text-center">
          {resultado && (
            <div className={`font-bold ${resultado.ganancia > 0 ? 'text-emerald-900' : 'text-amber-900/70'} ${resultado.jackpot ? 'animate-bounce text-2xl' : 'text-lg'}`}>
              {resultado.mensaje}
              {resultado.ganancia > 0 && <span className="block text-xl">+{formato(resultado.ganancia)} 🥚</span>}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {NIVELES_APUESTA.map((nivel) => {
          const monto = base * nivel.factor;
          return (
            <button
              key={nivel.nombre}
              onClick={() => girar(nivel)}
              disabled={girando || s.huevos < monto}
              className={`p-3 rounded-xl text-white font-bold shadow bg-gradient-to-br ${nivel.color} transition hover:brightness-110 active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed`}
            >
              <div className="text-sm opacity-90">{nivel.nombre}</div>
              <div className="text-lg">{formato(monto)} 🥚</div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 text-center">La apuesta crece con tu producción. Dos iguales pagan x{PREMIO_PAR}.</p>

      <div className="grid grid-cols-4 gap-2 text-center">
        {SIMBOLOS.map((x) => (
          <div key={x.s} className="bg-amber-50 rounded-lg py-1.5">
            <div className="text-2xl">{x.s}</div>
            <div className="text-xs font-bold text-amber-700">x{x.premio}</div>
          </div>
        ))}
        <div className="bg-amber-50 rounded-lg py-1.5 flex flex-col items-center justify-center text-[11px] leading-tight text-amber-700 font-semibold">
          3 iguales
          <br />= premio
        </div>
      </div>

      {historial.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-600 text-sm mb-1">Últimos giros</h3>
          <ul className="space-y-1">
            {historial.map((h) => (
              <li key={h.id} className={`flex justify-between rounded-lg px-3 py-1.5 text-sm ${h.ganancia > 0 ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                <span className="text-lg">{h.final.join(' ')}</span>
                <span className={h.ganancia > 0 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                  {h.ganancia > 0 ? `+${formato(h.ganancia)}` : '0'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---------- Logros ----------

function Logros({ s, dispatch }) {
  const reiniciar = () => {
    if (window.confirm('¿Seguro que quieres borrar tu partida y empezar de cero?')) dispatch({ tipo: 'reiniciar' });
  };
  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 text-sm text-amber-800">
        Cada logro aumenta tu producción un {BONO_POR_LOGRO * 100}%. Bono actual: <b>+{Math.round(s.logros.length * BONO_POR_LOGRO * 100)}%</b>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {LOGROS.map((l) => {
          const ok = s.logros.includes(l.id);
          return (
            <div key={l.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 ${ok ? 'border-amber-300 bg-amber-50' : 'border-slate-100 bg-slate-50'}`}>
              <span className={`text-3xl ${ok ? '' : 'grayscale opacity-30'}`}>{l.emoji}</span>
              <div>
                <div className={`font-semibold text-sm ${ok ? 'text-amber-800' : 'text-slate-400'}`}>{ok ? l.nombre : '???'}</div>
                <div className="text-xs text-slate-500">{l.descripcion}</div>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={reiniciar} className="mt-6 mx-auto flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition">
        <RotateCcw className="w-4 h-4" /> Reiniciar partida
      </button>
    </div>
  );
}

// ---------- Avisos ----------

function Toasts({ toasts, dispatch }) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const id = setTimeout(() => dispatch({ tipo: 'quitarToast', id: toasts[0].id }), 3200);
    return () => clearTimeout(id);
  }, [toasts, dispatch]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 z-50 flex flex-col gap-2 items-center w-[min(92vw,320px)]">
      {toasts.slice(0, 3).map((t) => (
        <div key={t.id} className="toast w-full bg-white rounded-2xl shadow-2xl border-2 border-amber-300 px-4 py-3 flex items-center gap-3">
          <span className="text-3xl">{t.emoji}</span>
          <div>
            <div className="text-xs font-semibold text-amber-600">{t.titulo}</div>
            <div className="font-bold">{t.texto}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Bienvenida({ datos, onCerrar }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" onClick={onCerrar}>
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center toast" onClick={(e) => e.stopPropagation()}>
        <Ajolote feliz className="w-28 h-28 mx-auto" />
        <h2 className="titulo text-2xl font-bold text-pink-600 mt-2">¡Bienvenida de vuelta!</h2>
        <p className="text-slate-600 mt-2">
          Mientras no estabas ({formatoTiempo(datos.segundos)}) tus ajolotes pusieron
        </p>
        <p className="titulo text-3xl font-bold text-amber-500 my-2">+{formato(datos.ganancia)} 🥚</p>
        <button onClick={onCerrar} className="mt-2 w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold transition">
          ¡A seguir!
        </button>
      </div>
    </div>
  );
}
