// src/components/MapaEstaticoElectoral.js
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Componente totalmente controlado por useEffect sin estados internos
const MapaEstaticoElectoral = ({ votantes, tipoMapa = 'afines', titulo = 'Mapa Electoral' }) => {
    const mapaRef = useRef(null);
    const mapaInstance = useRef(null);
    const marcadoresRef = useRef([]);

    useEffect(() => {
        // Configuración según tipo
        const configuraciones = {
            afines: {
                filtro: v => v.afin,
                color: '#FF5252',
                titulo: 'Votantes Afines',
                radio: 8
            },
            todos: {
                filtro: v => true,
                color: '#4CAF50',
                titulo: 'Todos los Votantes',
                radio: 6
            },
            participacion: {
                filtro: v => v.votado,
                color: '#2196F3',
                titulo: 'Participación Electoral',
                radio: 7
            },
            transporte: {
                filtro: v => v.necesitaTransporte && !v.votado,
                color: '#9C27B0',
                titulo: 'Necesitan Transporte',
                radio: 8
            }
        };

        const config = configuraciones[tipoMapa] || configuraciones.todos;

        // Inicializar el mapa
        if (!mapaInstance.current) {
            mapaInstance.current = L.map(mapaRef.current).setView([-34.6037, -58.3816], 12);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(mapaInstance.current);
        } else {
            // Limpiar marcadores anteriores
            marcadoresRef.current.forEach(marcador => {
                mapaInstance.current.removeLayer(marcador);
            });
            marcadoresRef.current = [];
        }

        // Funciones auxiliares
        const obtenerCoordenadas = (barrio) => {
            const base = [-34.6037, -58.3816]; // Buenos Aires

            // Simulación de coordenadas por barrio
            const coordenadasPorBarrio = {
                "Centro": [-34.603, -58.381],
                "Palermo": [-34.588, -58.412],
                "Villa Crespo": [-34.598, -58.438],
                "Belgrano": [-34.563, -58.461],
                "Recoleta": [-34.587, -58.393],
                "Caballito": [-34.619, -58.443],
                "Flores": [-34.632, -58.463],
                "San Telmo": [-34.623, -58.371]
            };

            return coordenadasPorBarrio[barrio] || base;
        };

        const agregarVariacion = (coord) => {
            return [
                coord[0] + (Math.random() - 0.5) * 0.02,
                coord[1] + (Math.random() - 0.5) * 0.02
            ];
        };

        // Filtrar votantes según el tipo seleccionado
        const votantesFiltrados = votantes.filter(config.filtro);

        // Crear marcadores
        votantesFiltrados.forEach(votante => {
            const coordBase = obtenerCoordenadas(votante.barrio);
            const coordFinal = agregarVariacion(coordBase);

            // Crear el marcador circular
            const marcador = L.circleMarker(coordFinal, {
                radius: config.radio,
                fillColor: config.color,
                color: config.color,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            }).addTo(mapaInstance.current);

            // Agregar popup
            marcador.bindPopup(`
        <b>${votante.nombre}</b><br>
        DNI: ${votante.dni}<br>
        Mesa: ${votante.mesa}<br>
        ${votante.afin ? '✅ Afín' : '❌ No afín'}<br>
        ${votante.votado ? '✓ Ya votó' : '✗ Pendiente'}<br>
        ${votante.necesitaTransporte ? '🚗 Necesita transporte' : '🚶‍♂️ No necesita transporte'}
      `);

            // Guardar referencia para limpieza
            marcadoresRef.current.push(marcador);
        });

        // Agregar marcador principal para la sede
        const sedeMarcador = L.marker([-34.6037, -58.3816])
            .addTo(mapaInstance.current)
            .bindPopup('<b>Sede Central Electoral</b><br>Centro de operaciones');

        marcadoresRef.current.push(sedeMarcador);

        // Limpiar al desmontar
        return () => {
            if (tipoMapa === 'todos') {
                mapaInstance.current.remove();
                mapaInstance.current = null;
                marcadoresRef.current = [];
            }
        };
    }, [votantes, tipoMapa]); // Dependencias mínimas y estables

    return (
        <div className="w-full">
            <h3 className="text-lg font-bold mb-3">{titulo}</h3>
            <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                <div ref={mapaRef} style={{ height: '100%', width: '100%' }}></div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
                Mostrando {votantes.filter(
                    tipoMapa === 'afines' ? v => v.afin :
                        tipoMapa === 'participacion' ? v => v.votado :
                            tipoMapa === 'transporte' ? v => v.necesitaTransporte && !v.votado :
                                () => true
                ).length} votantes
            </div>
        </div>
    );
};

// Panel para este mapa estático
const PanelMapaEstatico = ({ votantes }) => {
    const [tipoMapa, setTipoMapa] = React.useState('afines');

    return (
        <div className="bg-white rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Análisis Geográfico Electoral</h2>

            <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setTipoMapa('afines')}
                        className={`px-4 py-2 rounded text-sm ${tipoMapa === 'afines' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        Votantes Afines
                    </button>
                    <button
                        onClick={() => setTipoMapa('todos')}
                        className={`px-4 py-2 rounded text-sm ${tipoMapa === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        Todos los Votantes
                    </button>
                    <button
                        onClick={() => setTipoMapa('participacion')}
                        className={`px-4 py-2 rounded text-sm ${tipoMapa === 'participacion' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        Participación
                    </button>
                    <button
                        onClick={() => setTipoMapa('transporte')}
                        className={`px-4 py-2 rounded text-sm ${tipoMapa === 'transporte' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        Necesitan Transporte
                    </button>
                </div>
            </div>

            <MapaEstaticoElectoral
                votantes={votantes}
                tipoMapa={tipoMapa}
                key={tipoMapa} // Forzar recreación al cambiar tipo
            />

            {/* Análisis según el tipo */}
            <div className="mt-4">
                <h3 className="font-medium mb-2">Análisis del mapa</h3>
                {tipoMapa === 'afines' && (
                    <p className="text-sm text-gray-600">
                        El mapa muestra las zonas con mayor concentración de votantes afines a nuestra lista.
                    </p>
                )}
                {/* Otros tipos... similar al componente original */}
            </div>
        </div>
    );
};

export default PanelMapaEstatico;