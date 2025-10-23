import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, TrendingUp, Zap, Gift, Home, MousePointerClick, ShoppingBag } from 'lucide-react';

const AjoloteClicker = () => {
  const [huevos, setHuevos] = useState(0);
  const [huevosPorClick, setHuevosPorClick] = useState(1);
  const [huevosPorSegundo, setHuevosPorSegundo] = useState(0);
  const [totalHuevos, setTotalHuevos] = useState(0);
  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [recompensas, setRecompensas] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  
  // Estados de la tragamonedas
  const [slotGirando, setSlotGirando] = useState(false);
  const [slotResultado, setSlotResultado] = useState(['🦎', '🦎', '🦎']);
  const [ultimaGanancia, setUltimaGanancia] = useState(null);
  const [historialGiros, setHistorialGiros] = useState([]);

  const [edificios, setEdificios] = useState([
    { 
      nombre: 'Acuario Pequeño', 
      cantidad: 0, 
      precioBase: 15, 
      produccion: 0.1,
      emoji: '🏠',
      descripcion: 'Un pequeño tanque que cuida ajolotes'
    },
    { 
      nombre: 'Granja de Huevos', 
      cantidad: 0, 
      precioBase: 100, 
      produccion: 1,
      emoji: '🥚',
      descripcion: 'Recolecta huevos automáticamente'
    },
    { 
      nombre: 'Laboratorio Genético', 
      cantidad: 0, 
      precioBase: 1100, 
      produccion: 8,
      emoji: '🧬',
      descripcion: 'Investiga nuevas variantes de ajolotes'
    },
    { 
      nombre: 'Acuario Industrial', 
      cantidad: 0, 
      precioBase: 12000, 
      produccion: 47,
      emoji: '🏭',
      descripcion: 'Producción masiva de ajolotes'
    },
    { 
      nombre: 'Centro de Conservación', 
      cantidad: 0, 
      precioBase: 130000, 
      produccion: 260,
      emoji: '🏛️',
      descripcion: 'Protege y multiplica la especie'
    },
    { 
      nombre: 'Reserva Natural', 
      cantidad: 0, 
      precioBase: 1400000, 
      produccion: 1400,
      emoji: '🌳',
      descripcion: 'Hábitat natural para miles de ajolotes'
    },
    { 
      nombre: 'Portal Dimensional', 
      cantidad: 0, 
      precioBase: 20000000, 
      produccion: 7800,
      emoji: '🌀',
      descripcion: 'Trae ajolotes de otras dimensiones'
    },
    { 
      nombre: 'Templo Azteca', 
      cantidad: 0, 
      precioBase: 330000000, 
      produccion: 44000,
      emoji: '⛩️',
      descripcion: 'Los antiguos dioses bendicen tus ajolotes'
    }
  ]);

  const [mejoras, setMejoras] = useState([
    {
      nombre: 'Clic Doble',
      precio: 100,
      comprada: false,
      efecto: 'click',
      multiplicador: 2,
      descripcion: 'Duplica huevos por clic'
    },
    {
      nombre: 'Manos Rápidas',
      precio: 500,
      comprada: false,
      efecto: 'click',
      multiplicador: 2,
      descripcion: 'x2 huevos por clic'
    },
    {
      nombre: 'Super Clic',
      precio: 10000,
      comprada: false,
      efecto: 'click',
      multiplicador: 5,
      descripcion: 'x5 huevos por clic'
    },
    {
      nombre: 'Acuarios Mejorados',
      precio: 1000,
      comprada: false,
      efecto: 'edificio',
      edificioIndex: 0,
      multiplicador: 2,
      descripcion: 'Acuarios producen el doble'
    },
    {
      nombre: 'Granjas Optimizadas',
      precio: 5000,
      comprada: false,
      efecto: 'edificio',
      edificioIndex: 1,
      multiplicador: 2,
      descripcion: 'Granjas producen el doble'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHuevos(h => h + huevosPorSegundo / 10);
      setTotalHuevos(t => t + huevosPorSegundo / 10);
    }, 100);

    return () => clearInterval(interval);
  }, [huevosPorSegundo]);

  useEffect(() => {
    let total = 0;
    edificios.forEach((edificio, index) => {
      const mejorasEdificio = mejoras.filter(
        m => m.comprada && m.efecto === 'edificio' && m.edificioIndex === index
      );
      let multiplicador = 1;
      mejorasEdificio.forEach(m => multiplicador *= m.multiplicador);
      total += edificio.cantidad * edificio.produccion * multiplicador;
    });
    setHuevosPorSegundo(total);
  }, [edificios, mejoras]);



  const simbolos = ['🦎', '🥚', '💎', '⭐', '🎁', '🔥', '👑'];
  const preciosSlot = [
    { nombre: 'Básico', precio: 50, multiplicador: 1 },
    { nombre: 'Premium', precio: 200, multiplicador: 3 },
    { nombre: 'Épico', precio: 1000, multiplicador: 10 },
    { nombre: 'Legendario', precio: 5000, multiplicador: 25 }
  ];

  const girarSlot = (precioIndex) => {
    const slot = preciosSlot[precioIndex];
    if (huevos < slot.precio || slotGirando) return;

    setHuevos(huevos - slot.precio);
    setSlotGirando(true);
    setUltimaGanancia(null);

    // Animación de giro
    let giros = 0;
    const maxGiros = 20;
    const intervalo = setInterval(() => {
      setSlotResultado([
        simbolos[Math.floor(Math.random() * simbolos.length)],
        simbolos[Math.floor(Math.random() * simbolos.length)],
        simbolos[Math.floor(Math.random() * simbolos.length)]
      ]);
      giros++;

      if (giros >= maxGiros) {
        clearInterval(intervalo);
        calcularResultado(slot);
      }
    }, 100);
  };

  const calcularResultado = (slot) => {
    // Resultado final
    const resultado = [
      simbolos[Math.floor(Math.random() * simbolos.length)],
      simbolos[Math.floor(Math.random() * simbolos.length)],
      simbolos[Math.floor(Math.random() * simbolos.length)]
    ];
    
    setSlotResultado(resultado);

    // Calcular premio
    let ganancia = 0;
    let mensaje = '';

    if (resultado[0] === resultado[1] && resultado[1] === resultado[2]) {
      // ¡JACKPOT! Tres iguales
      const premios = {
        '🦎': slot.precio * 5 * slot.multiplicador,
        '🥚': slot.precio * 3 * slot.multiplicador,
        '💎': slot.precio * 10 * slot.multiplicador,
        '⭐': slot.precio * 7 * slot.multiplicador,
        '🎁': slot.precio * 4 * slot.multiplicador,
        '🔥': slot.precio * 8 * slot.multiplicador,
        '👑': slot.precio * 20 * slot.multiplicador
      };
      ganancia = premios[resultado[0]] || slot.precio * 5 * slot.multiplicador;
      mensaje = '🎰 ¡JACKPOT! 🎰';
    } else if (resultado[0] === resultado[1] || resultado[1] === resultado[2] || resultado[0] === resultado[2]) {
      // Dos iguales
      ganancia = slot.precio * 2 * slot.multiplicador;
      mensaje = '✨ ¡Dos iguales! ✨';
    } else {
      // Sin premio
      mensaje = '😢 Intenta de nuevo';
      ganancia = 0;
    }

    setHuevos(h => h + ganancia);
    setUltimaGanancia({ ganancia, mensaje });
    setHistorialGiros(prev => [
      { resultado: [...resultado], ganancia, mensaje, timestamp: Date.now() },
      ...prev.slice(0, 4)
    ]);

    setTimeout(() => {
      setSlotGirando(false);
    }, 500);
  };

  const calcularPrecio = (precioBase, cantidad) => {
    return Math.floor(precioBase * Math.pow(1.15, cantidad));
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now() + Math.random();
    setFloatingNumbers(prev => [...prev, { id, x, y, value: huevosPorClick, isScroll: false }]);
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(n => n.id !== id));
    }, 1000);

    setHuevos(huevos + huevosPorClick);
    setTotalHuevos(totalHuevos + huevosPorClick);
  };

  const comprarEdificio = (index) => {
    const edificio = edificios[index];
    const precio = calcularPrecio(edificio.precioBase, edificio.cantidad);
    
    if (huevos >= precio) {
      setHuevos(huevos - precio);
      const nuevosEdificios = [...edificios];
      nuevosEdificios[index].cantidad += 1;
      setEdificios(nuevosEdificios);
    }
  };

  const comprarMejora = (index) => {
    const mejora = mejoras[index];
    if (huevos >= mejora.precio && !mejora.comprada) {
      setHuevos(huevos - mejora.precio);
      const nuevasMejoras = [...mejoras];
      nuevasMejoras[index].comprada = true;
      setMejoras(nuevasMejoras);

      if (mejora.efecto === 'click') {
        setHuevosPorClick(huevosPorClick * mejora.multiplicador);
      }
    }
  };

  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex flex-col">
      {/* Header con stats */}
      <div className="bg-white shadow-lg p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-3">
            🦎 Ajolote Clicker 🦎
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-green-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{formatNumber(huevos)}</div>
              <div className="text-xs text-gray-600">Huevos</div>
            </div>
            <div className="bg-blue-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{huevosPorSegundo.toFixed(1)}/s</div>
              <div className="text-xs text-gray-600">Por segundo</div>
            </div>
            <div className="bg-purple-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">{historialGiros.length}</div>
              <div className="text-xs text-gray-600">Giros totales</div>
            </div>
            <div className="bg-pink-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-pink-600">{edificios.reduce((sum, e) => sum + e.cantidad, 0)}</div>
              <div className="text-xs text-gray-600">Edificios</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-4 px-6 font-semibold transition flex items-center justify-center gap-2 ${
              activeTab === 'home'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Home className="w-5 h-5" />
            Clicker
          </button>
          <button
            onClick={() => setActiveTab('slot')}
            className={`flex-1 py-4 px-6 font-semibold transition flex items-center justify-center gap-2 ${
              activeTab === 'slot'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Gift className="w-5 h-5" />
            Tragamonedas
            {ultimaGanancia && ultimaGanancia.ganancia > 0 && (
              <span className="bg-yellow-400 text-purple-900 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                WIN!
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-4 px-6 font-semibold transition flex items-center justify-center gap-2 ${
              activeTab === 'shop'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Tienda
          </button>
        </div>
      </div>

      {/* Recompensas flotantes globales */}
      {recompensas.map(recompensa => (
        <div
          key={recompensa.id}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce"
        >
          <div className="bg-yellow-400 text-white px-8 py-4 rounded-full shadow-2xl text-2xl font-bold border-4 border-yellow-500">
            {recompensa.emoji} {recompensa.texto}
          </div>
        </div>
      ))}

      {/* Contenido según pestaña activa */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'home' && (
          <div className="h-full bg-gradient-to-b from-blue-300 to-blue-500 flex flex-col items-center justify-center p-8">
            <div 
              className="relative cursor-pointer transform transition hover:scale-105 active:scale-95"
              onClick={handleClick}
            >
              <div className="w-72 h-72 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full shadow-2xl flex items-center justify-center border-8 border-pink-500 hover:border-pink-600 transition">
                <div className="text-9xl animate-pulse">🦎</div>
              </div>
              
              {floatingNumbers.filter(n => !n.isScroll).map(num => (
                <div
                  key={num.id}
                  className="absolute text-4xl font-bold text-yellow-300 pointer-events-none"
                  style={{
                    left: num.x,
                    top: num.y,
                    animation: 'float 1s ease-out forwards'
                  }}
                >
                  +{num.value}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="text-white text-2xl font-bold mb-2">
                🖱️ +{huevosPorClick} huevos por clic
              </div>
              <div className="bg-white bg-opacity-90 rounded-lg px-6 py-3 inline-block">
                <p className="text-gray-700 font-semibold">¡Haz clic en el ajolote!</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'slot' && (
          <div className="h-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {/* Máquina Tragamonedas */}
              <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-3xl p-8 shadow-2xl mb-6 border-8 border-yellow-700">
                <h2 className="text-4xl font-bold text-center text-white mb-6 drop-shadow-lg">
                  🎰 TRAGAMONEDAS DE AJOLOTES 🎰
                </h2>

                {/* Pantalla de slots */}
                <div className="bg-gray-900 rounded-2xl p-6 mb-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {slotResultado.map((simbolo, index) => (
                      <div
                        key={index}
                        className={`bg-white rounded-xl p-8 text-center shadow-lg transform transition ${
                          slotGirando ? 'animate-bounce' : 'scale-100'
                        }`}
                      >
                        <div className="text-8xl">{simbolo}</div>
                      </div>
                    ))}
                  </div>

                  {/* Resultado */}
                  {ultimaGanancia && (
                    <div className={`text-center p-4 rounded-xl ${
                      ultimaGanancia.ganancia > 0 
                        ? 'bg-green-500 animate-pulse' 
                        : 'bg-red-500'
                    }`}>
                      <div className="text-3xl font-bold text-white mb-2">
                        {ultimaGanancia.mensaje}
                      </div>
                      {ultimaGanancia.ganancia > 0 && (
                        <div className="text-4xl font-bold text-yellow-300">
                          +{formatNumber(ultimaGanancia.ganancia)} 🥚
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Botones de apuesta */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {preciosSlot.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => girarSlot(index)}
                      disabled={huevos < slot.precio || slotGirando}
                      className={`p-6 rounded-xl font-bold text-white shadow-lg transform transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                        index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
                        index === 1 ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                        index === 2 ? 'bg-gradient-to-br from-orange-500 to-orange-700' :
                        'bg-gradient-to-br from-pink-500 to-pink-700'
                      }`}
                    >
                      <div className="text-2xl mb-2">{slot.nombre}</div>
                      <div className="text-3xl font-bold mb-1">{slot.precio} 🥚</div>
                      <div className="text-sm opacity-90">x{slot.multiplicador} premio</div>
                    </button>
                  ))}
                </div>

                {/* Tabla de premios */}
                <div className="bg-white bg-opacity-90 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    💰 Tabla de Premios
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    {simbolos.map((simbolo, index) => (
                      <div key={index} className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-3">
                        <div className="text-4xl mb-2">{simbolo}</div>
                        <div className="font-bold text-gray-700">
                          {simbolo === '👑' ? 'x20' : 
                           simbolo === '💎' ? 'x10' : 
                           simbolo === '🔥' ? 'x8' :
                           simbolo === '⭐' ? 'x7' :
                           simbolo === '🦎' ? 'x5' :
                           simbolo === '🎁' ? 'x4' : 'x3'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-gray-600">
                    <p className="font-semibold">🎰 3 iguales = JACKPOT multiplicado</p>
                    <p className="text-sm">2 iguales = x2 de tu apuesta</p>
                  </div>
                </div>
              </div>

              {/* Historial de giros */}
              {historialGiros.length > 0 && (
                <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    📜 Últimos Giros
                  </h3>
                  <div className="space-y-3">
                    {historialGiros.map((giro, index) => (
                      <div
                        key={giro.timestamp}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          giro.ganancia > 0 ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl flex gap-1">
                            {giro.resultado.map((s, i) => (
                              <span key={i}>{s}</span>
                            ))}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-700">{giro.mensaje}</div>
                            {giro.ganancia > 0 && (
                              <div className="text-green-600 font-bold">
                                +{formatNumber(giro.ganancia)} 🥚
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="h-full bg-amber-50 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-amber-900 flex items-center gap-2">
                <ShoppingBag /> Tienda
              </h2>

              {/* Mejoras */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-purple-700 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" /> Mejoras
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mejoras.filter(m => !m.comprada).map((mejora, index) => (
                    <button
                      key={index}
                      onClick={() => comprarMejora(mejoras.indexOf(mejora))}
                      disabled={huevos < mejora.precio}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-5 rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition shadow-lg text-left"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {mejora.efecto === 'scroll' && <Zap className="w-5 h-5" />}
                          <div className="font-bold text-xl">{mejora.nombre}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{formatNumber(mejora.precio)}</div>
                          <div className="text-xs">huevos</div>
                        </div>
                      </div>
                      <div className="text-sm opacity-90">{mejora.descripcion}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Edificios */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-amber-900">Edificios de Producción</h3>
                <div className="space-y-4">
                  {edificios.map((edificio, index) => {
                    const precio = calcularPrecio(edificio.precioBase, edificio.cantidad);
                    const mejorasEdificio = mejoras.filter(
                      m => m.comprada && m.efecto === 'edificio' && m.edificioIndex === index
                    );
                    let produccionTotal = edificio.produccion;
                    mejorasEdificio.forEach(m => produccionTotal *= m.multiplicador);

                    return (
                      <button
                        key={index}
                        onClick={() => comprarEdificio(index)}
                        disabled={huevos < precio}
                        className="w-full bg-white border-4 border-amber-200 hover:border-amber-400 disabled:border-gray-300 p-5 rounded-xl transition shadow-md text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className="text-5xl">{edificio.emoji}</div>
                            <div>
                              <div className="font-bold text-xl text-gray-800">{edificio.nombre}</div>
                              <div className="text-sm text-gray-600">{edificio.descripcion}</div>
                            </div>
                          </div>
                          <div className="bg-amber-100 px-4 py-2 rounded-full font-bold text-amber-900 text-lg">
                            {edificio.cantidad}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-green-600 font-bold text-lg">
                            +{produccionTotal.toFixed(1)}/seg
                          </div>
                          <div className="text-xl font-bold text-amber-600">
                            {formatNumber(precio)} 🥚
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px);
          }
        }
      `}</style>
    </div>
  );
};

export default AjoloteClicker;
