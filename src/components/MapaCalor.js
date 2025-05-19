// src/components/MapaCalorReal.js - ADAPTADO PARA GÜEMES, CÓRDOBA
import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const MapaCalorReal = ({ votantes, tipoMapa = "afines" }) => {
    const mapContainerRef = useRef(null);
    const leafletMapRef = useRef(null);
    const heatLayerRef = useRef(null);

    // ¡COORDENADAS ACTUALIZADAS PARA GÜEMES, CÓRDOBA!
    const coordenadasGuemes = [-31.4232, -64.1912]; // Centro de Güemes, Córdoba

    useEffect(() => {
        // Función para limpiar capa de calor
        const limpiarCapaCalor = () => {
            if (heatLayerRef.current && leafletMapRef.current) {
                leafletMapRef.current.removeLayer(heatLayerRef.current);
                heatLayerRef.current = null;
            }
        };

        // Configuración INTENSIFICADA para cada tipo de mapa
        const config = {
            afines: {
                filtro: v => v.afin,
                titulo: 'Mapa de Calor: Votantes Afines',
                gradiente: { 0.3: 'blue', 0.5: 'lime', 0.7: 'yellow', 0.9: 'red' },
                radio: 35,
                blur: 20,
                maxZoom: 18,
                intensidad: 1.0 // ¡INTENSIDAD MUY ALTA PARA MEJOR VISIBILIDAD!
            },
            todos: {
                filtro: v => true,
                titulo: 'Mapa de Calor: Todos los Votantes',
                gradiente: { 0.3: 'green', 0.5: 'lime', 0.7: 'yellow', 0.9: 'red' },
                radio: 35,
                blur: 20,
                maxZoom: 18,
                intensidad: 1.0
            },
            participacion: {
                filtro: v => v.votado,
                titulo: 'Mapa de Calor: Participación Electoral',
                gradiente: { 0.3: 'blue', 0.5: 'cyan', 0.7: 'yellow', 0.9: 'red' },
                radio: 35,
                blur: 20,
                maxZoom: 18,
                intensidad: 1.0
            },
            transporte: {
                filtro: v => v.necesitaTransporte && !v.votado,
                titulo: 'Mapa de Calor: Necesidades de Transporte',
                gradiente: { 0.3: 'purple', 0.5: 'blue', 0.7: 'yellow', 0.9: 'red' },
                radio: 35,
                blur: 20,
                maxZoom: 18,
                intensidad: 1.0
            }
        }[tipoMapa] || {
            filtro: v => true,
            titulo: 'Mapa de Calor: Todos los Votantes',
            gradiente: { 0.3: 'blue', 0.5: 'lime', 0.7: 'yellow', 0.9: 'red' },
            radio: 35,
            blur: 20,
            maxZoom: 18,
            intensidad: 4.0
        };

        // Inicializar o recuperar el mapa
        if (!leafletMapRef.current) {
            leafletMapRef.current = L.map(mapContainerRef.current).setView(coordenadasGuemes, 15); // Zoom 15 para ver mejor el barrio

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(leafletMapRef.current);
        } else {
            limpiarCapaCalor();
        }

        // Función para obtener coordenadas dentro de Güemes con variación
        const getCoordenadas = (subzona = '') => {
            // División de Güemes en subzonas (simuladas)
            const coordenadasPorZona = {
                "Güemes Norte": [-31.4190, -64.1912],
                "Güemes Sur": [-31.4270, -64.1912],
                "Güemes Centro": [-31.4232, -64.1912],
                "Güemes Este": [-31.4232, -64.1870],
                "Güemes Oeste": [-31.4232, -64.1950]
            };

            // Determinar coordenadas base según la subzona
            let baseCoords;
            if (subzona && coordenadasPorZona[subzona]) {
                baseCoords = coordenadasPorZona[subzona];
            } else {
                // Si no hay subzona específica, usar alguna aleatoria dentro de Güemes
                const zonasGuemes = Object.keys(coordenadasPorZona);
                const zonaAleatoria = zonasGuemes[Math.floor(Math.random() * zonasGuemes.length)];
                baseCoords = coordenadasPorZona[zonaAleatoria];
            }

            return baseCoords;
        };

        // Añadir hotspots predefinidos para asegurar áreas de alta intensidad
        const añadirHotspots = (puntos) => {
            // Hotspots para Güemes, Córdoba
            const hotspots = [
                // Principal hotspot en el centro de Güemes
                { coords: [-31.4232, -64.1912], intensidad: 12, puntos: 20 },

                // Hotspots secundarios en zonas específicas
                { coords: [-31.4190, -64.1912], intensidad: 10, puntos: 15 }, // Norte
                { coords: [-31.4270, -64.1912], intensidad: 10, puntos: 15 }, // Sur
                { coords: [-31.4232, -64.1870], intensidad: 8, puntos: 12 },  // Este
                { coords: [-31.4232, -64.1950], intensidad: 8, puntos: 12 },  // Oeste

                // Puntos adicionales en áreas estratégicas
                { coords: [-31.4210, -64.1880], intensidad: 9, puntos: 10 },
                { coords: [-31.4250, -64.1940], intensidad: 9, puntos: 10 }
            ];

            hotspots.forEach(spot => {
                // Punto central con intensidad máxima
                puntos.push([...spot.coords, spot.intensidad]);

                // Puntos alrededor para crear un área de calor
                for (let i = 0; i < spot.puntos; i++) {
                    const radio = 0.002 + (Math.random() * 0.005); // Radio más pequeño para concentrar en Güemes
                    const angulo = Math.random() * Math.PI * 2;
                    puntos.push([
                        spot.coords[0] + (Math.cos(angulo) * radio),
                        spot.coords[1] + (Math.sin(angulo) * radio),
                        spot.intensidad * (0.7 + Math.random() * 0.3) // Intensidad alta
                    ]);
                }
            });

            return puntos;
        };

        // Filtrar votantes según el tipo seleccionado
        const votantesFiltrados = votantes.filter(config.filtro);

        // Generar puntos para cada votante, con INTENSIDAD AUMENTADA
        const puntos = [];

        votantesFiltrados.forEach(votante => {
            // Obtener coordenadas base en Güemes
            const baseCoords = getCoordenadas(votante.zona);

            // Añadir punto principal con alta intensidad
            puntos.push([
                baseCoords[0],
                baseCoords[1],
                config.intensidad * 1.5 // Punto central con intensidad máxima
            ]);

            // Añadir puntos adicionales alrededor para crear más densidad
            for (let i = 0; i < 12; i++) { // Más puntos para mayor densidad
                puntos.push([
                    baseCoords[0] + (Math.random() - 0.5) * 0.005, // Variación menor para concentrarse en Güemes
                    baseCoords[1] + (Math.random() - 0.5) * 0.005,
                    config.intensidad * (0.7 + Math.random() * 0.3) // Intensidad alta para mejor visualización
                ]);
            }
        });

        // Añadir hotspots predefinidos para garantizar visualización intensa
        const puntosConHotspots = añadirHotspots(puntos);

        // Crear capa de mapa de calor real INTENSIFICADA
        if (puntosConHotspots.length > 0) {
            heatLayerRef.current = L.heatLayer(puntosConHotspots, {
                radius: config.radio,
                blur: config.blur,
                maxZoom: config.maxZoom,
                gradient: config.gradiente,
                minOpacity: 0.5 // Mayor opacidad mínima para mejor visualización
            }).addTo(leafletMapRef.current);
        }

        // Añadir marcador para sede central en Güemes
        const sedeIcon = L.divIcon({
            html: `<div style="background-color: blue; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white;"></div>`,
            className: 'sede-central-icon',
            iconSize: [20, 20]
        });

        const sedeMarker = L.marker(coordenadasGuemes, { icon: sedeIcon })
            .bindPopup('<strong>Sede Electoral Güemes</strong><br>Centro de operaciones')
            .addTo(leafletMapRef.current);

        // Delimitar el barrio Güemes
        const poligonoGuemes = L.polygon([
            [-31.4190, -64.1950], // NO
            [-31.4190, -64.1870], // NE
            [-31.4270, -64.1870], // SE
            [-31.4270, -64.1950]  // SO
        ], {
            color: 'rgba(0, 0, 255, 0.5)',
            weight: 2,
            fillColor: 'rgba(0, 0, 255, 0.05)',
            fillOpacity: 0.1
        }).addTo(leafletMapRef.current)
            .bindPopup('Barrio Güemes');

        // Limpiar al desmontar
        return () => {
            if (leafletMapRef.current && tipoMapa === 'todos') {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
                heatLayerRef.current = null;
            } else {
                limpiarCapaCalor();
            }
        };
    }, [votantes, tipoMapa]); // Solo estas dos dependencias

    // Actualizar el título según el tipo de mapa seleccionado
    const titulos = {
        afines: 'Mapa de Calor: Votantes Afines en Güemes',
        todos: 'Mapa de Calor: Todos los Votantes en Güemes',
        participacion: 'Mapa de Calor: Participación Electoral en Güemes',
        transporte: 'Mapa de Calor: Necesidades de Transporte en Güemes'
    };

    return (
        <div className="w-full">
            <h3 className="text-lg font-bold mb-3">
                {titulos[tipoMapa] || 'Mapa de Calor Electoral - Barrio Güemes, Córdoba'}
            </h3>
            <div
                ref={mapContainerRef}
                className="h-96 rounded-lg overflow-hidden border border-gray-200"
                style={{ width: '100%', height: '400px' }}
            ></div>
            <div className="mt-2 text-sm text-gray-600">
                Mostrando concentración de {votantes.filter(
                    tipoMapa === 'afines' ? v => v.afin :
                        tipoMapa === 'participacion' ? v => v.votado :
                            tipoMapa === 'transporte' ? v => v.necesitaTransporte && !v.votado :
                                () => true
                ).length} votantes en Barrio Güemes
            </div>

            {/* Leyenda del mapa de calor mejorada y más prominente */}
            <div className="mt-3">
                <div className="w-full h-6 bg-gradient-to-r from-blue-600 via-lime-500 via-yellow-500 to-red-600 rounded-md"></div>
                <div className="flex justify-between w-full px-2 text-sm font-medium mt-1">
                    <span className="text-blue-700">Baja</span>
                    <span className="text-green-600">Media-Baja</span>
                    <span className="text-yellow-600">Media-Alta</span>
                    <span className="text-red-700">Alta</span>
                </div>
            </div>
        </div>
    );
};

export default MapaCalorReal;