# 🌌 Generador Avanzado de Galaxias Espirales - Three.js

Generador procedural de galaxias espirales con **randomness**, **gradientes de color**, **blending aditivo** y gestión de recursos. Esta versión incluye características avanzadas para crear galaxias realistas y visualmente impresionantes.

---

## 📋 Tabla de Contenidos

-   [Descripción General](#-descripción-general)
-   [Características](#-características)
-   [Parámetros de Configuración](#️-parámetros-de-configuración)
-   [Estructura del Código](#-estructura-del-código)
    -   [1. Limpieza de Recursos](#1-limpieza-de-recursos-previos)
    -   [2. Configuración de Material](#2-configuración-de-material)
    -   [3. Sistema de Partículas](#3-sistema-de-partículas)
    -   [4. Generación de Posiciones](#4-generación-de-posiciones-con-randomness)
    -   [5. Sistema de Colores](#5-sistema-de-colores-con-gradiente)
    -   [6. Configuración de Geometría](#6-configuración-de-geometría)
-   [Matemáticas y Algoritmos](#-matemáticas-y-algoritmos)
-   [Propiedades del Material](#-propiedades-del-material)
-   [Código Completo Comentado](#-código-completo-comentado)
-   [Optimización y Performance](#-optimización-y-performance)
-   [Personalización](#-personalización)

---

## 🎯 Descripción General

Este generador crea galaxias espirales procedurales con las siguientes características avanzadas:

-   🌀 **Brazos espirales** configurables con efecto de rotación
-   ✨ **Dispersión realista** de partículas usando randomness
-   🎨 **Gradientes de color** del centro al borde
-   💫 **Blending aditivo** para efecto de luz brillante
-   ♻️ **Gestión automática de memoria** (dispose de recursos previos)
-   ⚡ **Optimizado** para miles de partículas

---

## 🌟 Características

| Característica            | Descripción                                              |
| ------------------------- | -------------------------------------------------------- |
| **Randomness Controlado** | Dispersión de partículas con distribución personalizable |
| **Color Gradiente**       | Transición suave entre color interior y exterior         |
| **Blending Aditivo**      | Efecto de luz superpuesta (brillo)                       |
| **Limpieza de Recursos**  | Evita memory leaks al regenerar galaxias                 |
| **Size Attenuation**      | Partículas más pequeñas con la distancia                 |
| **Vertex Colors**         | Color único por partícula                                |

---

## ⚙️ Parámetros de Configuración

```javascript
const parameters = {
    count: 100000, // Número de partículas
    size: 0.01, // Tamaño de cada partícula
    radius: 5, // Radio máximo de la galaxia
    branches: 3, // Número de brazos espirales
    spin: 1, // Factor de rotación espiral
    randomness: 0.2, // Intensidad de dispersión (0-1)
    randomnessPower: 3, // Distribución de la dispersión (1-10)
    insideColor: "#ff6030", // Color del centro (hexadecimal)
    outsideColor: "#1b3984", // Color del borde (hexadecimal)
};
```

### Descripción Detallada de Parámetros

| Parámetro         | Tipo   | Rango       | Efecto                                                    |
| ----------------- | ------ | ----------- | --------------------------------------------------------- |
| `count`           | Number | 1000-200000 | Densidad de la galaxia (más = más densa)                  |
| `size`            | Number | 0.001-0.1   | Tamaño visual de cada estrella                            |
| `radius`          | Number | 1-20        | Tamaño total de la galaxia                                |
| `branches`        | Number | 2-10        | Cantidad de brazos espirales                              |
| `spin`            | Number | -3 a 3      | Rotación (positivo = horario, negativo = antihorario)     |
| `randomness`      | Number | 0-1         | Dispersión de partículas (0 = perfectamente alineadas)    |
| `randomnessPower` | Number | 1-10        | Concentración de dispersión (↑ = más cerca de los brazos) |
| `insideColor`     | String | Hex/CSS     | Color en el centro de la galaxia                          |
| `outsideColor`    | String | Hex/CSS     | Color en los bordes de la galaxia                         |

---

## 🏗️ Estructura del Código

### 1. Limpieza de Recursos Previos

```javascript
if (!!galaxy) {
    geometry?.dispose();
    material?.dispose();
    scene.remove(galaxy);
}
```

**Propósito:** Evitar **memory leaks** cuando regeneras la galaxia con nuevos parámetros.

**¿Qué hace cada línea?**

| Línea                  | Acción                            | ¿Por qué?                                    |
| ---------------------- | --------------------------------- | -------------------------------------------- |
| `if (!!galaxy)`        | Verifica si ya existe una galaxia | Evita errores en la primera ejecución        |
| `geometry?.dispose()`  | Libera memoria de la geometría    | WebGL no tiene garbage collection automático |
| `material?.dispose()`  | Libera memoria del material       | Las texturas y shaders ocupan memoria GPU    |
| `scene.remove(galaxy)` | Quita el objeto de la escena      | Deja de renderizarse                         |

**Operador `?.` (Optional Chaining):**

```javascript
geometry?.dispose(); // Si geometry existe, llama dispose()
// Equivalente a:
if (geometry) geometry.dispose();
```

**Operador `!!` (Double Negation):**

```javascript
!!galaxy; // Convierte a booleano
// null/undefined → false
// Objeto → true
```

---

### 2. Configuración de Material

```javascript
material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
});
```

#### Desglose de Propiedades

**`size: parameters.size`**

-   Tamaño de cada partícula en unidades de mundo
-   Ejemplo: `0.01` = partículas muy pequeñas

**`sizeAttenuation: true`** ⭐

-   `true`: Partículas más lejanas se ven más pequeñas (perspectiva realista)
-   `false`: Todas las partículas tienen el mismo tamaño visual

```
sizeAttenuation: true          sizeAttenuation: false
    •  •   •                       •  •  •
     • •                           • • •
      •   (más lejos, más          •  (mismo tamaño
           pequeño)                    siempre)
```

**`depthWrite: false`** ⭐

-   Desactiva escritura en el depth buffer
-   **Crucial** para evitar que partículas bloqueen otras partículas detrás
-   Sin esto: partículas opacas, se tapan entre sí

```
depthWrite: true               depthWrite: false
    •                              • • •
     X (tapa las de atrás)         • • • (se ven todas)
```

**`blending: THREE.AdditiveBlending`** ⭐

-   **Additive Blending:** Suma los colores de partículas superpuestas
-   Crea efecto de **luz brillante** cuando se acumulan partículas

```
Color de fondo: negro (0, 0, 0)
Partícula 1: rojo (1, 0, 0)
Partícula 2: azul (0, 0, 1)
Superpuestas: (1, 0, 1) = magenta brillante ✨
```

Modos de blending disponibles:

```javascript
THREE.NormalBlending; // Normal (opaco)
THREE.AdditiveBlending; // Suma colores (brillo) ⭐ Recomendado para galaxias
THREE.SubtractiveBlending; // Resta colores
THREE.MultiplyBlending; // Multiplica colores
```

**`vertexColors: true`** ⭐

-   Permite que **cada partícula tenga su propio color**
-   Los colores vienen del attribute `color` de la geometría
-   Sin esto: todas las partículas tendrían el color del material

---

### 3. Sistema de Partículas

```javascript
geometry = new THREE.BufferGeometry();
galaxy = new THREE.Points(geometry, material);
```

**`BufferGeometry`:**

-   Geometría optimizada para grandes cantidades de vértices
-   Usa arrays tipados (`Float32Array`) para máximo rendimiento

**`Points`:**

-   Tipo especial de mesh que renderiza **puntos/partículas**
-   Cada vértice de la geometría = 1 partícula visible

```
BufferGeometry (datos)
        +
PointsMaterial (apariencia)
        =
Points (objeto renderizable)
```

---

### 4. Generación de Posiciones con Randomness

```javascript
const positions = new Float32Array(parameters.count * 3);
```

**¿Por qué `Float32Array`?**

-   Array optimizado para números decimales de 32 bits
-   Mucho más eficiente que arrays normales de JavaScript
-   WebGL trabaja directamente con este tipo de datos

```javascript
// Array normal (lento)
const positions = []; // ❌

// Float32Array (rápido)
const positions = new Float32Array(parameters.count * 3); // ✅
```

#### Cálculo de Posición Base

```javascript
const radius = Math.random() * parameters.radius;
const spinAngle = radius * parameters.spin;
const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
```

**Igual que antes:**

-   `radius`: distancia aleatoria del centro
-   `spinAngle`: rotación espiral
-   `branchAngle`: asignación a un brazo

#### Sistema de Randomness Avanzado ⭐

```javascript
const randomX =
    Math.pow(Math.random(), parameters.randomnessPower) *
    (Math.random() < 0.5 ? 1 : -1) *
    parameters.randomness *
    radius;
```

**Desglosando cada componente:**

##### 1. `Math.pow(Math.random(), parameters.randomnessPower)`

**Propósito:** Controlar la **distribución** de la dispersión.

```javascript
// randomnessPower = 1 (distribución uniforme)
Math.random() = 0.5  →  Math.pow(0.5, 1) = 0.5

// randomnessPower = 3 (más concentrado cerca de 0)
Math.random() = 0.5  →  Math.pow(0.5, 3) = 0.125
Math.random() = 0.8  →  Math.pow(0.8, 3) = 0.512
```

**Efecto visual:**

```
randomnessPower = 1          randomnessPower = 3
(distribución uniforme)      (concentrado al centro)

•  •   •  •                  •••  •
 • • •  •                     •••
• •  •  •                    •••
 •  • •                       •
```

**Mayor `randomnessPower` = partículas más cerca de los brazos espirales**

##### 2. `(Math.random() < 0.5 ? 1 : -1)`

**Propósito:** Generar valores **positivos Y negativos** aleatoriamente.

```javascript
Math.random() < 0.5  →  1   (50% probabilidad)
Math.random() >= 0.5 →  -1  (50% probabilidad)
```

**Sin esto:** Todas las partículas se dispersarían en la misma dirección.

##### 3. `* parameters.randomness`

**Propósito:** Controlar la **intensidad** de la dispersión.

```javascript
randomness = 0.0  →  Sin dispersión (brazos perfectos)
randomness = 0.5  →  Dispersión moderada
randomness = 1.0  →  Máxima dispersión
```

##### 4. `* radius`

**Propósito:** La dispersión aumenta con la distancia.

```javascript
radius = 1  →  randomX pequeño (centro más compacto)
radius = 5  →  randomX grande (bordes más dispersos)
```

**Efecto visual:**

```
Centro: ••• (compacto)
         •••

Borde:  •  •   • (disperso)
       •    •
          •
```

#### Aplicación de Posiciones

```javascript
positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
positions[i3 + 1] = randomY;
positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
```

**Fórmula completa:**

```
Posición Final = Posición Base (espiral) + Desplazamiento Aleatorio

X = cos(ángulo) × radio + randomX
Y = 0 + randomY  (galaxia con grosor)
Z = sin(ángulo) × radio + randomZ
```

---

### 5. Sistema de Colores con Gradiente

```javascript
const colors = new Float32Array(parameters.count * 3);

const colorInside = new THREE.Color(parameters.insideColor);
const colorOutside = new THREE.Color(parameters.outsideColor);
```

**`THREE.Color`:**

-   Objeto de Three.js para manipular colores
-   Acepta formatos: hexadecimal (`'#ff6030'`), CSS (`'red'`), RGB (`0xff6030`)

#### Interpolación de Colores (Lerp)

```javascript
const mixedColor = colorInside.clone();
mixedColor.lerp(colorOutside, radius / parameters.radius);
```

**`clone()`:**

-   Crea una **copia** del color interior
-   Sin esto: modificaríamos el color original

**`lerp(targetColor, alpha)`:**

-   **L**inear Int**erp**olation (interpolación lineal)
-   Mezcla dos colores según un factor `alpha` (0 a 1)

```javascript
alpha = 0.0  →  100% colorInside (centro)
alpha = 0.5  →  50% de cada color (mitad)
alpha = 1.0  →  100% colorOutside (borde)
```

**Ejemplo práctico:**

```javascript
colorInside = #ff6030  (naranja)
colorOutside = #1b3984 (azul)

radius = 0    →  alpha = 0/5 = 0.0  →  #ff6030 (naranja)
radius = 2.5  →  alpha = 2.5/5 = 0.5  →  #8d4d5a (mezcla)
radius = 5    →  alpha = 5/5 = 1.0  →  #1b3984 (azul)
```

**Visualización:**

```
     Centro               Mitad                Borde
    (naranja)          (morado/rosa)           (azul)
       🟠                  🟣                   🔵
   radius=0            radius=2.5           radius=5
```

#### Asignación de Colores RGB

```javascript
colors[i3] = mixedColor.r; // Componente rojo (0-1)
colors[i3 + 1] = mixedColor.g; // Componente verde (0-1)
colors[i3 + 2] = mixedColor.b; // Componente azul (0-1)
```

**THREE.Color** almacena colores en formato RGB con valores entre 0 y 1:

```javascript
mixedColor.r; // 0.0 = sin rojo, 1.0 = rojo máximo
mixedColor.g; // 0.0 = sin verde, 1.0 = verde máximo
mixedColor.b; // 0.0 = sin azul, 1.0 = azul máximo
```

---

### 6. Configuración de Geometría

```javascript
geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
geometry.computeVertexNormals();
```

#### `setAttribute(name, attribute)`

**Propósito:** Enviar datos de vértices a la GPU.

**`position` attribute:**

```javascript
geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
//                     ↑                                            ↑         ↑
//                  Nombre del                                   Array    Valores
//                  attribute                                   de datos  por vértice
```

-   `positions`: Array con coordenadas XYZ
-   `3`: Cada vértice tiene 3 valores (X, Y, Z)

**`color` attribute:**

```javascript
geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
```

-   `colors`: Array con componentes RGB
-   `3`: Cada vértice tiene 3 valores (R, G, B)

#### `Float32BufferAttribute(array, itemSize)`

Convierte el `Float32Array` en un formato que Three.js entiende:

```javascript
// Sin BufferAttribute (no funciona)
geometry.positions = positions; // ❌

// Con BufferAttribute (correcto)
geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3)); // ✅
```

**`itemSize`:**

-   Cuántos valores forman un "item" completo
-   `3` para XYZ o RGB
-   `2` para UV (coordenadas de textura)
-   `4` para RGBA (color con transparencia)

#### `computeVertexNormals()`

```javascript
geometry.computeVertexNormals();
```

**Propósito:** Calcular normales para iluminación.

**Para partículas (Points):** Esta línea **no tiene efecto** ya que los puntos no usan iluminación. Puedes eliminarla:

```javascript
// No necesario para Points
// geometry.computeVertexNormals();  // ❌ Puedes quitarlo
```

#### Añadir a la Escena

```javascript
scene.add(galaxy);
```

Finalmente, añade el sistema de partículas a la escena para que se renderice.

---

## 🧮 Matemáticas y Algoritmos

### Fórmula Completa de Posición

```
X = cos(branchAngle + spinAngle) × radius + randomX
Y = randomY
Z = sin(branchAngle + spinAngle) × radius + randomZ

Donde:
• branchAngle = ((i % branches) / branches) × 2π
• spinAngle = radius × spin
• randomX/Y/Z = pow(random(), power) × sign × randomness × radius
```

### Distribución de Randomness Power

**Comparación de diferentes valores:**

| Power | Distribución       | Uso                            |
| ----- | ------------------ | ------------------------------ |
| 1     | Uniforme           | Galaxias muy dispersas         |
| 2     | Moderada           | Brazos visibles con dispersión |
| 3     | ⭐ **Óptima**      | Brazos definidos, realista     |
| 5     | Alta concentración | Brazos muy marcados            |
| 10    | Casi perfecto      | Brazos sin dispersión          |

**Gráficas:**

```
Power = 1 (uniforme)
|     •  •  •
|    •  •  •
|   •  •  •
|  •  •  •
| •  •  •
└─────────────

Power = 3 (concentrado)
|••••
|•••
|••
|•
|
└─────────────
```

### Color Lerp Matemático

```javascript
mixedColor = colorInside + (colorOutside - colorInside) × alpha

// Componente por componente:
R = rInside + (rOutside - rInside) × alpha
G = gInside + (gOutside - gInside) × alpha
B = bInside + (bOutside - bInside) × alpha
```

---

## 🎨 Propiedades del Material

### Tabla Comparativa de Blending Modes

| Modo                    | Fórmula           | Efecto            | Uso                        |
| ----------------------- | ----------------- | ----------------- | -------------------------- |
| **NormalBlending**      | `dst = src`       | Opaco (reemplaza) | Objetos sólidos            |
| **AdditiveBlending** ⭐ | `dst = src + dst` | Suma (brilla)     | Partículas, luces, fuego   |
| **SubtractiveBlending** | `dst = dst - src` | Resta (oscurece)  | Sombras, efectos negativos |
| **MultiplyBlending**    | `dst = src × dst` | Multiplica        | Sombras suaves             |

### ¿Por qué Additive Blending para Galaxias?

```
Galaxia real:
• Millones de estrellas superpuestas
• Más estrellas = más luz
• Centros brillantes, bordes tenues

Additive Blending simula esto:
1 partícula = poca luz
10 partículas superpuestas = mucha luz ✨
100 partículas = centro brillante 💫
```

**Ejemplo visual:**

```
Sin Additive:          Con Additive:
  • •                    ✨✨
  • •                    ✨✨
(opaco, no suma)       (suma, brilla más)
```

---

## 💻 Código Completo Comentado

```javascript
/**
 * Genera una galaxia espiral procedural con partículas
 * Incluye: limpieza de recursos, randomness, colores gradientes
 */
const generateGalaxy = () => {
    // ═══════════════════════════════════════════════════════════
    // 1. LIMPIEZA DE RECURSOS PREVIOS
    // ═══════════════════════════════════════════════════════════
    if (!!galaxy) {
        // Liberar memoria de geometría (GPU)
        geometry?.dispose();

        // Liberar memoria de material (GPU)
        material?.dispose();

        // Remover de la escena (deja de renderizarse)
        scene.remove(galaxy);
    }

    // ═══════════════════════════════════════════════════════════
    // 2. CREAR GEOMETRÍA Y MATERIAL
    // ═══════════════════════════════════════════════════════════

    // Geometría vacía (la llenaremos con vértices)
    geometry = new THREE.BufferGeometry();

    // Material para partículas
    material = new THREE.PointsMaterial({
        size: parameters.size, // Tamaño de cada punto
        sizeAttenuation: true, // Perspectiva (más lejos = más pequeño)
        depthWrite: false, // No bloquear partículas detrás
        blending: THREE.AdditiveBlending, // Suma colores (efecto brillo)
        vertexColors: true, // Color individual por partícula
    });

    // Sistema de partículas (combina geometría + material)
    galaxy = new THREE.Points(geometry, material);

    // ═══════════════════════════════════════════════════════════
    // 3. PREPARAR ARRAYS DE DATOS
    // ═══════════════════════════════════════════════════════════

    // Array de posiciones (X, Y, Z por cada partícula)
    const positions = new Float32Array(parameters.count * 3);

    // Array de colores (R, G, B por cada partícula)
    const colors = new Float32Array(parameters.count * 3);

    // Colores para el gradiente
    const colorInside = new THREE.Color(parameters.insideColor); // Centro
    const colorOutside = new THREE.Color(parameters.outsideColor); // Borde

    // ═══════════════════════════════════════════════════════════
    // 4. GENERAR CADA PARTÍCULA
    // ═══════════════════════════════════════════════════════════
    for (let i = 0; i < parameters.count; i++) {
        // ─────────────────────────────────────────────────────────
        // A) CALCULAR POSICIÓN
        // ─────────────────────────────────────────────────────────

        // Índice base en los arrays (cada partícula usa 3 posiciones)
        const i3 = i * 3;

        // Distancia aleatoria desde el centro (0 a radius)
        const radius = Math.random() * parameters.radius;

        // Ángulo de rotación espiral (más lejos = más rotación)
        const spinAngle = radius * parameters.spin;

        // Ángulo del brazo (distribuye partículas en N brazos)
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        // ─────────────────────────────────────────────────────────
        // B) CALCULAR RANDOMNESS (DISPERSIÓN)
        // ─────────────────────────────────────────────────────────

        // Randomness en X
        const randomX =
            Math.pow(Math.random(), parameters.randomnessPower) * // Distribución
            (Math.random() < 0.5 ? 1 : -1) * // ± aleatoriamente
            parameters.randomness * // Intensidad
            radius; // Escala con distancia

        // Randomness en Y (grosor de la galaxia)
        const randomY =
            Math.pow(Math.random(), parameters.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            parameters.randomness *
            radius;

        // Randomness en Z
        const randomZ =
            Math.pow(Math.random(), parameters.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            parameters.randomness *
            radius;

        // ─────────────────────────────────────────────────────────
        // C) ASIGNAR POSICIONES (coordenadas cartesianas)
        // ─────────────────────────────────────────────────────────

        // X = componente horizontal del círculo + dispersión
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;

        // Y = grosor de la galaxia (dispersión vertical)
        positions[i3 + 1] = randomY;

        // Z = componente de profundidad del círculo + dispersión
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // ─────────────────────────────────────────────────────────
        // D) CALCULAR COLOR (gradiente del centro al borde)
        // ─────────────────────────────────────────────────────────

        // Clonar color interior (evita modificar el original)
        const mixedColor = colorInside.clone();

        // Interpolar entre colorInside y colorOutside
        // Factor: 0 (centro) → 1 (borde)
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        // Asignar componentes RGB al array
        colors[i3] = mixedColor.r; // Rojo (0-1)
        colors[i3 + 1] = mixedColor.g; // Verde (0-1)
        colors[i3 + 2] = mixedColor.b; // Azul (0-1)
    }

    // ═══════════════════════════════════════════════════════════
    // 5. CONFIGURAR GEOMETRÍA
    // ═══════════════════════════════════════════════════════════

    // Enviar posiciones a la GPU
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    // Enviar colores a la GPU
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    // Calcular normales (no necesario para Points, puedes omitirlo)
    geometry.computeVertexNormals();

    // ═══════════════════════════════════════════════════════════
    // 6. AÑADIR A LA ESCENA
    // ═══════════════════════════════════════════════════════════
    scene.add(galaxy);
};
```

---

## ⚡ Optimización y Performance

### Memory Management

**Problema:** Sin `dispose()`, las galaxias antiguas siguen en memoria GPU.

```javascript
// ❌ MAL: Memory leak
function regenerateGalaxy() {
    galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);
    // La galaxia anterior sigue en memoria
}

// ✅ BIEN: Limpia recursos
function regenerateGalaxy() {
    if (galaxy) {
        geometry?.dispose(); // Libera memoria
        material?.dispose();
        scene.remove(galaxy);
    }
    galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);
}
```

### Recomendaciones de Performance

| Partículas       | FPS Esperado | Nivel                         |
| ---------------- | ------------ | ----------------------------- |
| < 10,000         | 60 FPS       | ✅ Óptimo                     |
| 10,000 - 50,000  | 60 FPS       | ✅ Bueno                      |
| 50,000 - 100,000 | 40-60 FPS    | ⚠️ Aceptable                  |
| > 100,000        | < 40 FPS     | ❌ Puede ser lento en móviles |

**Optimizaciones:**

```javascript
// 1. Desactivar sombras (Points no las usan)
renderer.shadowMap.enabled = false;

// 2. Reducir precisión de pixel ratio
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 3. Usar size más pequeño
parameters.size = 0.005; // Menos overdraw

// 4. Frustum culling (automático en Three.js)
// Solo renderiza partículas visibles
```

---

## 🎨 Personalización

### Ejemplos de Configuraciones

#### Galaxia Compacta y Brillante

```javascript
const parameters = {
    count: 50000,
    size: 0.02, // Partículas más grandes
    radius: 3, // Galaxia más pequeña
    branches: 4,
    spin: 2, // Mucha rotación
    randomness: 0.1, // Poca dispersión
    randomnessPower: 5, // Muy concentrado
    insideColor: "#ffaa00", // Amarillo centro
    outsideColor: "#ff0040", // Rojo bordes
};
```

#### Galaxia Etérea y Dispersa

```javascript
const parameters = {
    count: 100000,
    size: 0.005, // Partículas pequeñas
    radius: 8, // Galaxia grande
    branches: 5,
    spin: 0.5, // Poca rotación
    randomness: 0.8, // Mucha dispersión
    randomnessPower: 2, // Distribución uniforme
    insideColor: "#9d00ff", // Morado centro
    outsideColor: "#00d9ff", // Cyan bordes
};
```

#### Galaxia Realista (Vía Láctea)

```javascript
const parameters = {
    count: 80000,
    size: 0.01,
    radius: 5,
    branches: 4,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3, // ⭐ Valor óptimo
    insideColor: "#ff6030", // Naranja centro
    outsideColor: "#1b3984", // Azul bordes
};
```

---

## 📚 Recursos Adicionales

-   [Three.js Points Documentation](https://threejs.org/docs/#api/en/objects/Points)
-   [Three.js PointsMaterial](https://threejs.org/docs/#api/en/materials/PointsMaterial)
-   [BufferGeometry Guide](https://threejs.org/docs/#api/en/core/BufferGeometry)
-   [Three.js Journey - Bruno Simon](https://threejs-journey.com/)
-   [WebGL Fundamentals](https://webglfundamentals.org/)

---

## 🎯 Resumen

### Flujo Completo

```
1. Limpiar recursos previos (dispose)
    ↓
2. Crear geometría + material vacíos
    ↓
3. Preparar arrays (positions, colors)
    ↓
4. Para cada partícula:
    • Calcular posición base (brazo + espiral)
    • Agregar randomness (dispersión)
    • Calcular color (gradiente)
    ↓
5. Configurar attributes (position, color)
    ↓
6. Añadir a la escena
```

### Conceptos Clave

✅ **BufferGeometry** + **Float32Array** = Máximo rendimiento  
✅ **Additive Blending** = Efecto de luz brillante  
✅ **depthWrite: false** = Partículas no se bloquean  
✅ **vertexColors: true** = Color único por partícula  
✅ **dispose()** = Evita memory leaks  
✅ **randomnessPower** = Controla distribución de dispersión  
✅ **lerp()** = Gradiente suave de colores

---

## 📄 Licencia

Este código es parte del curso **Three.js Journey** de Bruno Simon.

---
