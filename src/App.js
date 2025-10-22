import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

const AjoloteClicker = () => {
  const [huevos, setHuevos] = useState(0);
  const [huevosPorClick, setHuevosPorClick] = useState(1);
  const [huevosPorSegundo, setHuevosPorSegundo] = useState(0);
  const [totalHuevos, setTotalHuevos] = useState(0);
  const [floatingNumbers, setFloatingNumbers] = useState([]);

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

  const calcularPrecio = (precioBase, cantidad) => {
    return Math.floor(precioBase * Math.pow(1.15, cantidad));
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now() + Math.random();
    setFloatingNumbers(prev => [...prev, { id, x, y, value: huevosPorClick }]);
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-screen">
        
        {/* Panel Izquierdo - Clicker */}
        <div className="lg:col-span-2 bg-gradient-to-b from-blue-300 to-blue-500 p-8 flex flex-col items-center justify-center overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
              🦎 Ajolote Clicker 🦎
            </h1>
            <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-2xl mb-4 inline-block">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {formatNumber(huevos)}
              </div>
              <div className="text-lg text-gray-600">huevos de ajolote</div>
              <div className="text-sm text-gray-500 mt-2">
                por segundo: {huevosPorSegundo.toFixed(1)}
              </div>
            </div>
          </div>

          <div 
            className="relative cursor-pointer transform transition hover:scale-105 active:scale-95"
            onClick={handleClick}
          >
            <div className="w-64 h-64 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full shadow-2xl flex items-center justify-center border-8 border-pink-500 hover:border-pink-600 transition">
              <div className="text-9xl animate-pulse">🦎</div>
            </div>
            
            {floatingNumbers.map(num => (
              <div
                key={num.id}
                className="absolute text-4xl font-bold text-yellow-300 pointer-events-none animate-float"
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

          <div className="mt-8 text-center text-white text-lg font-semibold">
            +{huevosPorClick} huevos por clic
          </div>

          <style jsx>{`
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

        {/* Panel Derecho - Tienda */}
        <div className="bg-amber-50 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-amber-900 flex items-center gap-2">
            <DollarSign /> Tienda
          </h2>

          {/* Mejoras */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-purple-700 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Mejoras
            </h3>
            <div className="space-y-2">
              {mejoras.filter(m => !m.comprada).map((mejora, index) => (
                <button
                  key={index}
                  onClick={() => comprarMejora(mejoras.indexOf(mejora))}
                  disabled={huevos < mejora.precio}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition shadow-lg text-left"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg">{mejora.nombre}</div>
                      <div className="text-sm opacity-90">{mejora.descripcion}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{formatNumber(mejora.precio)}</div>
                      <div className="text-xs">huevos</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Edificios */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-amber-900">Edificios</h3>
            <div className="space-y-3">
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
                    className="w-full bg-white border-4 border-amber-200 hover:border-amber-400 disabled:border-gray-300 p-4 rounded-lg transition shadow-md text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{edificio.emoji}</div>
                        <div>
                          <div className="font-bold text-lg text-gray-800">{edificio.nombre}</div>
                          <div className="text-sm text-gray-600">{edificio.descripcion}</div>
                        </div>
                      </div>
                      <div className="bg-amber-100 px-3 py-1 rounded-full font-bold text-amber-900">
                        {edificio.cantidad}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-green-600 font-semibold">
                        +{produccionTotal.toFixed(1)}/seg
                      </div>
                      <div className="text-lg font-bold text-amber-600">
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
    </div>
  );
};

export default AjoloteClicker;
