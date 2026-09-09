# Semana 13 (16-20 nov) (*) — Distribuidos

**Tipo:** Integradora · Práctica oficial 5

**Tema oficial:** evolución hacia API REST y servicio WebSocket (aplicado al proyecto) — Práctica 5 "Invocación de objetos y servicios distribuidos" (extendida).

**Objetivo:** implementar el canal WebSocket real para el dashboard del sistema CECyT9 (notificaciones en tiempo real: nuevo usuario registrado, cupo lleno, nueva bitácora).

**Prerrequisitos:** semanas 11-12; servidor concurrente del Parcial 2.

**Actividad:** agregar un servidor WebSocket (librería `ws` o Socket.IO) al backend real, emitiendo eventos cuando ocurre una acción relevante (registro de usuario, inscripción a curso); conectar el frontend para escuchar esos eventos y actualizar la vista en vivo.

**Entregable:** WebSocket funcionando de punta a punta (backend emite, frontend recibe y actualiza UI) + reporte de Práctica 5.

**Archivos base:** `base/backend-websocket/websocket.server.js` (andamiaje), `base/frontend-websocket/pages/notificaciones.js` (componente vacío), `base/reporte-practica5.md` (plantilla). Integrar **después** del JWT de Web (misma semana, mismo backend).

---
La rúbrica de esta práctica la tiene tu docente por separado.
