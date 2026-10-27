(function (global) {
    'use strict';

    function octetoABinario(octeto) {
        return octeto.toString(2).padStart(8, '0');
    }

    function pasosDecimalABinario(octeto) {
        const pesos = [128, 64, 32, 16, 8, 4, 2, 1];
        let resto = octeto;
        return pesos.map((peso) => {
            const bit = resto >= peso ? 1 : 0;
            if (bit) resto -= peso;
            return { peso, bit, resto };
        });
    }

    function ipAEntero(ip) {
        const partes = String(ip).trim().split('.');
        if (partes.length !== 4) throw new Error(`"${ip}" no es una IP válida`);
        return partes.reduce((acc, parte) => {
            if (!/^\d{1,3}$/.test(parte)) throw new Error(`"${parte}" no es un octeto válido`);
            const n = Number(parte);
            if (n < 0 || n > 255) throw new Error(`"${n}" está fuera del rango 0 a 255`);
            return acc * 256 + n;
        }, 0);
    }

    function enteroAIp(n) {
        return [24, 16, 8, 0].map((d) => Math.floor(n / 2 ** d) % 256).join('.');
    }

    function ipABinario(ip) {
        return enteroAIp(ipAEntero(ip)).split('.').map(Number).map(octetoABinario).join('.');
    }

    function prefijoAMascara(prefijo) {
        if (!Number.isInteger(prefijo) || prefijo < 0 || prefijo > 32) {
            throw new Error('El prefijo debe estar entre 0 y 32');
        }
        const n = prefijo === 0 ? 0 : (2 ** 32 - 2 ** (32 - prefijo));
        return enteroAIp(n);
    }

    function mascaraAPrefijo(mascara) {
        const bin = ipABinario(mascara).replace(/\./g, '');
        if (!/^1*0*$/.test(bin)) throw new Error(`"${mascara}" no es una máscara válida`);
        return bin.indexOf('0') === -1 ? 32 : bin.indexOf('0');
    }

    function leerPrefijo(texto) {
        const t = String(texto).trim().replace(/^\//, '');
        if (t.includes('.')) return mascaraAPrefijo(t);
        const p = Number(t);
        if (!Number.isInteger(p) || p < 0 || p > 32) {
            throw new Error(`"${texto}" no es un prefijo válido (0 a 32)`);
        }
        return p;
    }

    function claseDeRed(ip) {
        const primer = Math.floor(ipAEntero(ip) / 2 ** 24);
        if (primer === 127) return { clase: 'Local', prefijo: 8 };
        if (primer >= 1 && primer <= 126) return { clase: 'A', prefijo: 8 };
        if (primer >= 128 && primer <= 191) return { clase: 'B', prefijo: 16 };
        if (primer >= 192 && primer <= 223) return { clase: 'C', prefijo: 24 };
        if (primer >= 224 && primer <= 239) return { clase: 'D', prefijo: null };
        return { clase: 'E', prefijo: null };
    }

    function esPrivada(ip) {
        const n = ipAEntero(ip);
        const en = (red, pref) =>
            Math.floor(n / 2 ** (32 - pref)) ===
            Math.floor(ipAEntero(red) / 2 ** (32 - pref));
        return en('10.0.0.0', 8) ||
            en('172.16.0.0', 12) ||
            en('192.168.0.0', 16);
    }

    function hostsUtilizable(prefijo) {
        if (prefijo === 32) return 1;
        if (prefijo === 31) return 2;
        return 2 ** (32 - prefijo) - 2;
    }

    function describirSubred(redEntero, prefijo, nombre) {
        const tamano = 2 ** (32 - prefijo);
        const broadcast = redEntero + tamano - 1;
        const conHosts = prefijo < 31;
        return {
            nombre: nombre || '',
            red: enteroAIp(redEntero),
            prefijo,
            mascara: prefijoAMascara(prefijo),
            primerHost: enteroAIp(conHosts ? redEntero + 1 : redEntero),
            ultimoHost: enteroAIp(conHosts ? broadcast - 1 : broadcast),
            broadcast: enteroAIp(broadcast),
            hosts: hostsUtilizable(prefijo),
            tamanoBloque: tamano
        };
    }

    function analizarIp(ip, prefijo) {
        const n = ipAEntero(ip);
        const tamano = 2 ** (32 - prefijo);
        const red = Math.floor(n / tamano) * tamano;
        return describirSubred(red, prefijo);
    }

    function validarRedBase(ip, prefijo) {
        const n = ipAEntero(ip);
        const tamano = 2 ** (32 - prefijo);
        if (n % tamano !== 0) {
            const correcta = enteroAIp(Math.floor(n / tamano) * tamano);
            throw new Error(`${ip}/${prefijo} no es una dirección de red válida. La red correspondiente es ${correcta}/${prefijo}.`);
        }
        return n;
    }

    function bitsParaHosts(hosts) {
        if (!Number.isInteger(hosts) || hosts < 1) {
            throw new Error(`${hosts} no es una cantidad válida de hosts`);
        }
        let n = 2;
        while (2 ** n - 2 < hosts) n++;
        return n;
    }

    function subnetearFLSM(ip, prefijo, opciones) {
        const base = validarRedBase(ip, prefijo);
        let bitsPrestados;

        if (opciones.subredes !== undefined) {
            if (!Number.isInteger(opciones.subredes) || opciones.subredes < 1) {
                throw new Error('El número de subredes debe ser un entero positivo');
            }
            bitsPrestados = Math.ceil(Math.log2(opciones.subredes));
        } else if (opciones.hostsPorSubred !== undefined) {
            const bitsHost = bitsParaHosts(opciones.hostsPorSubred);
            bitsPrestados = 32 - prefijo - bitsHost;
        } else {
            throw new Error('Indica el número de subredes o de hosts por subred');
        }

        const nuevoPrefijo = prefijo + bitsPrestados;
        if (bitsPrestados < 0 || nuevoPrefijo > 30) {
            throw new Error(`No caben los requerimientos: el nuevo prefijo sería /${nuevoPrefijo}.`);
        }

        const total = 2 ** bitsPrestados;
        const tamano = 2 ** (32 - nuevoPrefijo);
        const subredes = [];
        for (let i = 0; i < total; i++) {
            subredes.push(describirSubred(base + i * tamano, nuevoPrefijo, `Subred ${i + 1}`));
        }
        return {
            bitsPrestados,
            nuevoPrefijo,
            totalSubredes: total,
            hostsPorSubred: hostsUtilizable(nuevoPrefijo),
            subredes
        };
    }

    function subnetearVLSM(ip, prefijo, requerimientos) {
        const base = validarRedBase(ip, prefijo);
        const fin = base + 2 ** (32 - prefijo);
        const ordenados = requerimientos
            .map((r, i) => ({ ...r, i }))
            .sort((a, b) => b.hosts - a.hosts || a.i - b.i);

        let siguiente = base;
        const subredes = ordenados.map((r) => {
            const bitsHosts = bitsParaHosts(r.hosts);
            const nuevoPrefijo = 32 - bitsHosts;
            const tamano = 2 ** bitsHosts;

            if (nuevoPrefijo < prefijo) {
                throw new Error(`${r.nombre} (${r.hosts} hosts) necesita un bloque mayor que la red base`);
            }

            const inicio = Math.ceil(siguiente / tamano) * tamano;
            if (inicio + tamano > fin) {
                throw new Error('No hay espacio suficiente en la red base para todas las subredes');
            }

            siguiente = inicio + tamano;
            return {
                ...describirSubred(inicio, nuevoPrefijo, r.nombre),
                hostsSolicitados: r.hosts,
                bitsHosts
            };
        });

        return {
            subredes,
            direccionesTotales: 2 ** (32 - prefijo),
            direccionesUsadas: subredes.reduce((suma, r) => suma + r.tamanoBloque, 0),
            primerLibre: siguiente < fin ? enteroAIp(siguiente) : null
        };
    }

    const api = {
        octetoABinario, pasosDecimalABinario, ipABinario, ipAEntero, enteroAIp,
        prefijoAMascara, mascaraAPrefijo, leerPrefijo, claseDeRed, esPrivada,
        hostsUtilizable, bitsParaHosts, analizarIp, subnetearFLSM, subnetearVLSM
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else global.Subneteo = api;
})(typeof window !== 'undefined' ? window : globalThis);