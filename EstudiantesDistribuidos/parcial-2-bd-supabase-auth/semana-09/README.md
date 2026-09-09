# Semana 9 (19-23 oct) — Distribuidos

**Tipo:** Integradora

**Tema oficial:** U3·AE1 Sockets, datagramas UDP, streams TCP — incorporación de HILOS (concurrencia: un hilo por conexión).

**Objetivo:** construir un servidor concurrente con sockets (multi-cliente) como prototipo del futuro canal en tiempo real del dashboard.

**Prerrequisitos:** semanas 6-8; nociones de Node.js (o el lenguaje que se use para sockets).

**Actividad:** implementar un servidor de sockets TCP que maneje varios clientes simultáneamente (un hilo/proceso ligero por conexión), simulando una notificación a varios "usuarios conectados" del sistema CECyT9 (ej. aviso de cupo lleno en un taller).

**Entregable:** servidor de sockets concurrente funcionando + script cliente de prueba (mínimo 2 clientes simultáneos).

**Archivos base:** `base/servidor-sockets.js`, `base/cliente-prueba.js` (andamiaje, complétalos tú). Ejecuta el servidor y luego 2+ instancias del cliente en terminales separadas.

---
La rúbrica de esta práctica la tiene tu docente por separado.
