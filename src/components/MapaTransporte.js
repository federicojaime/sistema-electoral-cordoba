// src/components/MapaTransporte.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrige el problema de los iconos en Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapaTransporte = ({ votantes, transportes, asignaciones }) => {
    // Centro del mapa en Buenos Aires
    const posicionInicial = [-34.6037, -58.3816];
    const [rutas, setRutas] = useState([]);

    useEffect(() => {
        // Simular rutas basadas en las asignaciones de transporte
        const rutasCalculadas = [];

        asignaciones.forEach(asignacion => {
            const votante = votantes.find(v => v.id === asignacion.votanteId);
            const transporte = transportes.find(t => t.id === asignacion.transporteId);

            if (votante && transporte) {
                // Simulamos puntos en la ruta (en una implementación real, usarías un servicio de rutas)
                // Generamos puntos aleatorios alrededor del centro para simular rutas
                const puntosRuta = generarRutaSimulada(posicionInicial, 5);

                rutasCalculadas.push({
                    id: `${asignacion.votanteId}-${asignacion.transporteId}`,
                    puntos: puntosRuta,
                    color: asignacion.estado === 'completado' ? '#4CAF50' :
                        asignacion.estado === 'en_ruta' ? '#2196F3' : '#FFC107',
                    votante: votante,
                    transporte: transporte
                });
            }
        });

        setRutas(rutasCalculadas);
    }, [asignaciones, votantes, transportes]);

    // Función para generar una ruta simulada con puntos aleatorios
    const generarRutaSimulada = (centro, numPuntos) => {
        const puntos = [];
        puntos.push(centro); // Punto inicial

        for (let i = 0; i < numPuntos; i++) {
            const deltaLat = (Math.random() - 0.5) * 0.05;
            const deltaLng = (Math.random() - 0.5) * 0.05;
            puntos.push([centro[0] + deltaLat, centro[1] + deltaLng]);
        }

        return puntos;
    };

    return (
        <MapContainer center={posicionInicial} zoom={12} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Marcadores para votantes que necesitan transporte */}
            {votantes
                .filter(v => v.necesitaTransporte && !v.votado)
                .map(votante => (
                    <Marker
                        key={votante.id}
                        position={[
                            posicionInicial[0] + (Math.random() - 0.5) * 0.04,
                            posicionInicial[1] + (Math.random() - 0.5) * 0.04
                        ]}
                    >
                        <Popup>
                            <div>
                                <h3 className="font-bold">{votante.nombre}</h3>
                                <p>Dirección: {votante.direccion}</p>
                                <p>Barrio: {votante.barrio}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

            {/* Marcadores para vehículos */}
            {transportes.map(transporte => (
                <Marker
                    key={transporte.id}
                    position={[
                        posicionInicial[0] + (Math.random() - 0.5) * 0.03,
                        posicionInicial[1] + (Math.random() - 0.5) * 0.03
                    ]}
                >
                    <Popup>
                        <div>
                            <h3 className="font-bold">{transporte.tipo}</h3>
                            <p>Chofer: {transporte.chofer}</p>
                            <p>Zona: {transporte.zona}</p>
                            <p>Capacidad: {transporte.capacidad} personas</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Líneas para las rutas */}
            {rutas.map(ruta => (
                <Polyline
                    key={ruta.id}
                    positions={ruta.puntos}
                    color={ruta.color}
                    weight={4}
                    opacity={0.7}
                >
                    <Popup>
                        <div>
                            <h3 className="font-bold">Ruta: {ruta.transporte.chofer}</h3>
                            <p>Votante: {ruta.votante.nombre}</p>
                            <p>Vehículo: {ruta.transporte.tipo}</p>
                        </div>
                    </Popup>
                </Polyline>
            ))}
        </MapContainer>
    );
};

export default MapaTransporte;