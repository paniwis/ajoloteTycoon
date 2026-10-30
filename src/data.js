// Datos fijos del juego: edificios, mejoras, logros y simbolos de la tragamonedas

export const EDIFICIOS = [
  { nombre: 'Acuario Pequeño', precioBase: 15, produccion: 0.1, emoji: '🏠', descripcion: 'Un pequeño tanque que cuida ajolotes' },
  { nombre: 'Granja de Huevos', precioBase: 100, produccion: 1, emoji: '🥚', descripcion: 'Recolecta huevos automáticamente' },
  { nombre: 'Laboratorio Genético', precioBase: 1100, produccion: 8, emoji: '🧬', descripcion: 'Investiga nuevas variantes de ajolotes' },
  { nombre: 'Acuario Industrial', precioBase: 12000, produccion: 47, emoji: '🏭', descripcion: 'Producción masiva de ajolotes' },
  { nombre: 'Centro de Conservación', precioBase: 130000, produccion: 260, emoji: '🏛️', descripcion: 'Protege y multiplica la especie' },
  { nombre: 'Reserva Natural', precioBase: 1400000, produccion: 1400, emoji: '🌳', descripcion: 'Hábitat natural para miles de ajolotes' },
  { nombre: 'Portal Dimensional', precioBase: 20000000, produccion: 7800, emoji: '🌀', descripcion: 'Trae ajolotes de otras dimensiones' },
  { nombre: 'Templo Azteca', precioBase: 330000000, produccion: 44000, emoji: '⛩️', descripcion: 'Los antiguos dioses bendicen tus ajolotes' },
];

const MEJORAS_CLIC = [
  { id: 'clic-doble', nombre: 'Clic Doble', precio: 100, efecto: 'click', multiplicador: 2, descripcion: 'Duplica los huevos por clic', emoji: '👆' },
  { id: 'manos-rapidas', nombre: 'Manos Rápidas', precio: 500, efecto: 'click', multiplicador: 2, descripcion: 'x2 huevos por clic', emoji: '🙌' },
  { id: 'super-clic', nombre: 'Super Clic', precio: 10000, efecto: 'click', multiplicador: 5, descripcion: 'x5 huevos por clic', emoji: '⚡' },
  { id: 'clic-inteligente', nombre: 'Clic Inteligente', precio: 50000, efecto: 'clicPorcentaje', valor: 0.05, descripcion: 'Cada clic suma además el 5% de tu producción por segundo', emoji: '🧠' },
  { id: 'clic-legendario', nombre: 'Clic Legendario', precio: 2000000, efecto: 'click', multiplicador: 10, descripcion: 'x10 huevos por clic', emoji: '👑' },
];

const NOMBRES_MEJORA_EDIFICIO = [
  'Acuarios Mejorados', 'Granjas Optimizadas', 'ADN Brillante', 'Filtros Industriales',
  'Voluntarios Expertos', 'Lagos Cristalinos', 'Portales Estables', 'Bendición de Xólotl',
];

const MEJORAS_EDIFICIO = EDIFICIOS.map((e, i) => ({
  id: `edificio-${i}`,
  nombre: NOMBRES_MEJORA_EDIFICIO[i],
  precio: e.precioBase * 10,
  efecto: 'edificio',
  edificioIndex: i,
  multiplicador: 2,
  descripcion: `${e.nombre} producen el doble`,
  emoji: e.emoji,
  requiere: 1,
}));

const MEJORAS_GLOBALES = [
  { id: 'agua-cristalina', nombre: 'Agua Cristalina', precio: 250000, efecto: 'global', multiplicador: 1.5, descripcion: 'Toda la producción sube un 50%', emoji: '💧' },
  { id: 'lago-xochimilco', nombre: 'Lago de Xochimilco', precio: 50000000, efecto: 'global', multiplicador: 2, descripcion: 'Toda la producción se duplica', emoji: '🌺' },
];

export const MEJORAS = [...MEJORAS_CLIC, ...MEJORAS_EDIFICIO, ...MEJORAS_GLOBALES];

export const BONO_POR_LOGRO = 0.02;

export const LOGROS = [
  { id: 'primer-huevo', nombre: 'Primer huevo', descripcion: 'Consigue tu primer huevo', emoji: '🥚', cumple: (s) => s.total >= 1 },
  { id: 'cien-huevos', nombre: 'Nido lleno', descripcion: 'Junta 100 huevos en total', emoji: '🪺', cumple: (s) => s.total >= 100 },
  { id: 'mil-huevos', nombre: 'Criadero', descripcion: 'Junta 1.000 huevos en total', emoji: '🐣', cumple: (s) => s.total >= 1e3 },
  { id: 'millon-huevos', nombre: 'Magnate acuático', descripcion: 'Junta 1 millón de huevos', emoji: '💰', cumple: (s) => s.total >= 1e6 },
  { id: 'mil-millones', nombre: 'Imperio ajolote', descripcion: 'Junta mil millones de huevos', emoji: '🏰', cumple: (s) => s.total >= 1e9 },
  { id: 'cien-clics', nombre: 'Dedo caliente', descripcion: 'Haz 100 clics', emoji: '🖱️', cumple: (s) => s.clicks >= 100 },
  { id: 'mil-clics', nombre: 'Clic incansable', descripcion: 'Haz 1.000 clics', emoji: '🔥', cumple: (s) => s.clicks >= 1000 },
  { id: 'primer-edificio', nombre: 'Primera construcción', descripcion: 'Compra tu primer edificio', emoji: '🏠', cumple: (s) => s.edificios.some((c) => c > 0) },
  { id: 'cincuenta-edificios', nombre: 'Urbanista', descripcion: 'Ten 50 edificios', emoji: '🏙️', cumple: (s) => s.edificios.reduce((a, b) => a + b, 0) >= 50 },
  { id: 'todos-edificios', nombre: 'Coleccionista', descripcion: 'Ten al menos uno de cada edificio', emoji: '🗂️', cumple: (s) => s.edificios.every((c) => c > 0) },
  { id: 'templo', nombre: 'Favor de los dioses', descripcion: 'Construye un Templo Azteca', emoji: '⛩️', cumple: (s) => s.edificios[7] > 0 },
  { id: 'primer-giro', nombre: 'Probando suerte', descripcion: 'Gira la tragamonedas', emoji: '🎰', cumple: (s) => s.giros >= 1 },
  { id: 'apostador', nombre: 'Apostador', descripcion: 'Gira 50 veces', emoji: '🎲', cumple: (s) => s.giros >= 50 },
  { id: 'jackpot', nombre: '¡Jackpot!', descripcion: 'Saca tres símbolos iguales', emoji: '💎', cumple: (s) => s.jackpots >= 1 },
  { id: 'todas-mejoras', nombre: 'Científica loca', descripcion: 'Compra 10 mejoras', emoji: '🧪', cumple: (s) => s.mejoras.length >= 10 },
];

// Simbolos de la tragamonedas con su premio para tres iguales (veces la apuesta)
export const SIMBOLOS = [
  { s: '🦎', premio: 5 },
  { s: '🥚', premio: 3 },
  { s: '💎', premio: 10 },
  { s: '⭐', premio: 7 },
  { s: '🎁', premio: 4 },
  { s: '🔥', premio: 8 },
  { s: '👑', premio: 20 },
];
export const PREMIO_PAR = 2;

export const NIVELES_APUESTA = [
  { nombre: 'Básica', factor: 1, color: 'from-sky-500 to-blue-600' },
  { nombre: 'Premium', factor: 5, color: 'from-violet-500 to-purple-700' },
  { nombre: 'Épica', factor: 25, color: 'from-orange-500 to-red-600' },
  { nombre: 'Legendaria', factor: 100, color: 'from-pink-500 to-fuchsia-700' },
];
