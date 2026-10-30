<p align="center">
  <img src="public/logo192.png" width="110" alt="Ajolote Tycoon" />
</p>

<h1 align="center">Ajolote Tycoon</h1>

<p align="center">
  Juego clicker de ajolotes hecho con React y Tailwind CSS.<br />
  Junta huevos, construye acuarios, compra mejoras y prueba suerte en la tragamonedas.
</p>

<p align="center">
  <a href="https://paniwis.github.io/ajoloteTycoon"><b>🎮 Jugar ahora</b></a>
</p>

<p align="center">
  <a href="https://ko-fi.com/paniwis"><img src="https://img.shields.io/badge/Invítame%20un%20café-Ko--fi-FF6433?style=for-the-badge&logo=kofi&logoColor=white" alt="Invítame un café en Ko-fi" /></a>
</p>

## ✨ Características

- **Ajolote ilustrado en SVG** con animaciones de nado y branquias.
- **8 edificios** de producción automática, con compra de x1, x10 o el máximo posible.
- **Mejoras** de clic, por edificio y globales que se desbloquean conforme avanzas.
- **Tragamonedas** con rodillos que se detienen uno por uno; la apuesta escala con tu producción.
- **15 logros**, cada uno aumenta tu producción un 2%.
- **Guardado automático** en el navegador y ganancias mientras no estás (hasta 8 horas).
- Diseño **responsive** para computadora y celular.

## 🛠️ Tecnologías

React 19 · Tailwind CSS 3 · Lucide Icons · GitHub Actions · GitHub Pages

## 🚀 Ejecutarlo en tu computadora

```bash
npm install
npm start
```

Se abre en `http://localhost:3000`.

## 📦 Publicación

Cada push a `main` compila el proyecto y lo publica en GitHub Pages con el flujo `.github/workflows/pages.yml`.

## 📁 Estructura

```
src/
├── App.js              # Interfaz: clicker, tienda, tragamonedas y logros
├── juego.js            # Lógica: reducer, cálculos, guardado y formato de números
├── data.js             # Edificios, mejoras, logros y símbolos
└── components/
    └── Ajolote.js      # Ilustración SVG del ajolote
```

## ☕ Apoya el proyecto

Si te gustó Ajolote Tycoon, puedes invitarme un café en [Ko-fi](https://ko-fi.com/paniwis). ¡Me ayuda a seguir creando juegos y proyectos!

---

Hecho por [Evelyn Larraga](https://github.com/paniwis)
