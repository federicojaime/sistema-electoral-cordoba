// src/components/SistemaElectoral.js

import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Cell
} from 'recharts';
import { MapPin, Users, Truck, CheckSquare, BarChart2, MessageCircle } from 'lucide-react';
import MapaTransporte from './MapaTransporte';
import GraficoResultadosMesa from './GraficoResultadosMesa';
import MapaCalor from './MapaCalor';
import PanelMapaCalor from './PanelMapaCalor';
// Importamos estilos de componentes (simulado de shadcn/ui)
const Alert = ({ children, title, variant = "default" }) => (
    <div className={`p-4 mb-4 rounded-md ${variant === "destructive" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>
        {title && <h3 className="font-medium mb-1">{title}</h3>}
        <div>{children}</div>
    </div>
);

const Button = ({ children, onClick, variant = "default", className = "", disabled = false }) => {
    const baseStyle = "px-4 py-2 rounded-md font-medium text-sm transition-colors";
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        >
            {children}
        </button>
    );
};

const Card = ({ children, title, className = "" }) => (
    <div className={`p-6 rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
        {title && <h3 className="font-medium text-lg mb-3">{title}</h3>}
        {children}
    </div>
);

const Input = ({ label, value, onChange, type = "text", placeholder = "" }) => (
    <div className="mb-4">
        {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
);

const Select = ({ label, value, onChange, options }) => (
    <div className="mb-4">
        {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
        <select
            value={value}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

const Badge = ({ children, variant = "default" }) => {
    const variants = {
        default: "bg-blue-100 text-blue-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        danger: "bg-red-100 text-red-800",
        info: "bg-purple-100 text-purple-800",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    );
};

// Datos de ejemplo
const padronElectoral = [
  { id: 1, dni: "12345678", nombre: "Ana García", mesa: "101", afin: true, necesitaTransporte: true, direccion: "Belgrano 637", barrio: "Güemes", telefono: "3515667788", votado: false },
  { id: 2, dni: "23456789", nombre: "Carlos López", mesa: "101", afin: true, necesitaTransporte: false, direccion: "Av. Marcelo T. de Alvear 456", barrio: "Güemes", telefono: "3515998877", votado: false },
  { id: 3, dni: "34567890", nombre: "María Rodríguez", mesa: "102", afin: false, necesitaTransporte: false, direccion: "Achával Rodríguez 150", barrio: "Güemes", telefono: "3516789012", votado: false },
  { id: 4, dni: "45678901", nombre: "Pablo Martínez", mesa: "102", afin: true, necesitaTransporte: true, direccion: "Fructuoso Rivera 270", barrio: "Güemes", telefono: "3517890123", votado: false },
  { id: 5, dni: "56789012", nombre: "Laura Fernández", mesa: "103", afin: true, necesitaTransporte: true, direccion: "Laprida, 123", barrio: "Güemes", telefono: "3518901234", votado: false },
  { id: 6, dni: "67890123", nombre: "Diego González", mesa: "103", afin: false, necesitaTransporte: false, direccion: "Montevideo 382", barrio: "Güemes", telefono: "3519012345", votado: false },
  { id: 7, dni: "78901234", nombre: "Sofía Pérez", mesa: "104", afin: true, necesitaTransporte: true, direccion: "Luis de Tejeda 4249", barrio: "Güemes", telefono: "3510123456", votado: false },
  { id: 8, dni: "89012345", nombre: "Javier Sánchez", mesa: "104", afin: true, necesitaTransporte: false, direccion: "Paso de los Andes 238", barrio: "Güemes", telefono: "3511234567", votado: false },
  { id: 9, dni: "90123456", nombre: "Valentina López", mesa: "105", afin: false, necesitaTransporte: false, direccion: "Rondeau 181", barrio: "Güemes", telefono: "3512345678", votado: false },
  { id: 10, dni: "01234567", nombre: "Matías Gómez", mesa: "105", afin: true, necesitaTransporte: true, direccion: "José A. Cabrera 4440", barrio: "Güemes", telefono: "3513456789", votado: false },
];

const punteros = [
  { id: 1, nombre: "Fernando Gutiérrez", zona: "Güemes Norte", telefono: "3514567890" },
  { id: 2, nombre: "Elena Torres", zona: "Güemes Sur", telefono: "3515678901" },
  { id: 3, nombre: "Martín Acosta", zona: "Güemes Centro", telefono: "3516789012" },
  { id: 4, nombre: "Luciana Benítez", zona: "Güemes Este", telefono: "3517890123" },
  { id: 5, nombre: "Roberto Castro", zona: "Güemes Oeste", telefono: "3518901234" },
];

const transportes = [
  { id: 1, tipo: "Auto", chofer: "Ricardo Díaz", telefono: "3519012345", capacidad: 4, zona: "Güemes Norte" },
  { id: 2, tipo: "Combi", chofer: "Susana Peralta", telefono: "3510123456", capacidad: 12, zona: "Güemes Sur" },
  { id: 3, tipo: "Auto", chofer: "Eduardo Ramírez", telefono: "3511234567", capacidad: 4, zona: "Güemes Centro" },
  { id: 4, tipo: "Combi", chofer: "Patricia Ortega", telefono: "3512345678", capacidad: 12, zona: "Güemes Este" },
  { id: 5, tipo: "Auto", chofer: "Jorge Romero", telefono: "3513456789", capacidad: 4, zona: "Güemes Oeste" },
];

// Definición del Componente Principal
const SistemaElectoral = () => {
    const [activeTab, setActiveTab] = useState("registro");
    const [votantes, setVotantes] = useState(padronElectoral);
    const [selectedVotante, setSelectedVotante] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");
    const [alert, setAlert] = useState({ show: false, message: "", title: "", variant: "default" });

    // Estado para datos de transporte
    const [asignacionesTransporte, setAsignacionesTransporte] = useState([]);

    const mostrarAlerta = (message, title = "", variant = "default") => {
        setAlert({ show: true, message, title, variant });
        setTimeout(() => setAlert({ show: false, message: "", title: "", variant: "default" }), 5000);
    };

    const registrarVoto = (dni) => {
        setVotantes(votantes.map(v => {
            if (v.dni === dni) {
                mostrarAlerta(`Voto registrado para ${v.nombre}`, "Votante Registrado", "default");
                return { ...v, votado: true };
            }
            return v;
        }));
    };

    const asignarTransporte = (votanteId, transporteId) => {
        const nuevaAsignacion = { votanteId, transporteId, estado: "pendiente", horaRecogida: "09:00" };
        setAsignacionesTransporte([...asignacionesTransporte, nuevaAsignacion]);
        mostrarAlerta("Transporte asignado correctamente", "Transporte Asignado", "default");
    };

    const enviarMensaje = (tipo, destinatario) => {
        setConfirmMessage(`Mensaje enviado a ${destinatario}`);
        mostrarAlerta(`Mensaje enviado a ${destinatario}`, "Mensaje Enviado", "default");
        setTimeout(() => setConfirmMessage(""), 3000);
    };

    // Estadísticas para el dashboard
    const totalVotantes = votantes.length;
    const votantesAfines = votantes.filter(v => v.afin).length;
    const votantesRegistrados = votantes.filter(v => v.votado).length;
    const votantesConTransporte = votantes.filter(v => v.necesitaTransporte).length;

    // Gráficos para el dashboard
    const datosAfines = [
        { name: 'Afines', value: votantesAfines },
        { name: 'No Afines', value: totalVotantes - votantesAfines },
    ];

    const datosVotacion = [
        { name: 'Votaron', value: votantesRegistrados },
        { name: 'Pendientes', value: totalVotantes - votantesRegistrados },
    ];

    const datosPorMesa = {};
    votantes.forEach(votante => {
        if (!datosPorMesa[votante.mesa]) {
            datosPorMesa[votante.mesa] = { total: 0, votaron: 0 };
        }
        datosPorMesa[votante.mesa].total += 1;
        if (votante.votado) {
            datosPorMesa[votante.mesa].votaron += 1;
        }
    });

    const datosMesasGrafico = Object.keys(datosPorMesa).map(mesa => ({
        mesa,
        total: datosPorMesa[mesa].total,
        votaron: datosPorMesa[mesa].votaron,
        porcentaje: Math.round((datosPorMesa[mesa].votaron / datosPorMesa[mesa].total) * 100)
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    // Renderizado condicional según la pestaña activa
    const renderTab = () => {
        switch (activeTab) {
            case "registro":
                return (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold mb-4">Padrón Electoral</h2>
                            <div className="flex space-x-4 mb-4">
                                <Input
                                    placeholder="Buscar por DNI o nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="outline" onClick={() => setSearchTerm("")}>Limpiar</Button>
                            </div>

                            <div className="bg-white shadow overflow-x-auto rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Afín</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transporte</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {votantes
                                            .filter(v =>
                                                v.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                v.dni.includes(searchTerm)
                                            )
                                            .map((votante) => (
                                                <tr key={votante.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{votante.dni}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{votante.nombre}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{votante.mesa}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {votante.afin ?
                                                            <Badge variant="success">Afín</Badge> :
                                                            <Badge variant="default">No Afín</Badge>}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {votante.necesitaTransporte ?
                                                            <Badge variant="info">Requiere</Badge> :
                                                            <Badge variant="default">No requiere</Badge>}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {votante.votado ?
                                                            <Badge variant="success">Votó</Badge> :
                                                            <Badge variant="warning">Pendiente</Badge>}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="default"
                                                                onClick={() => registrarVoto(votante.dni)}
                                                                disabled={votante.votado}
                                                            >
                                                                Registrar Voto
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => setSelectedVotante(votante)}
                                                            >
                                                                Ver Detalles
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {selectedVotante && (
                            <Card title={`Detalles de ${selectedVotante.nombre}`} className="mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p><strong>DNI:</strong> {selectedVotante.dni}</p>
                                        <p><strong>Mesa:</strong> {selectedVotante.mesa}</p>
                                        <p><strong>Afín:</strong> {selectedVotante.afin ? 'Sí' : 'No'}</p>
                                        <p><strong>Necesita Transporte:</strong> {selectedVotante.necesitaTransporte ? 'Sí' : 'No'}</p>
                                    </div>
                                    <div>
                                        <p><strong>Dirección:</strong> {selectedVotante.direccion}</p>
                                        <p><strong>Barrio:</strong> {selectedVotante.barrio}</p>
                                        <p><strong>Teléfono:</strong> {selectedVotante.telefono}</p>
                                        <p><strong>Estado:</strong> {selectedVotante.votado ? 'Votó' : 'Pendiente'}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex space-x-2">
                                    <Button
                                        onClick={() => enviarMensaje('recordatorio', selectedVotante.nombre)}
                                    >
                                        Enviar Recordatorio
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedVotante(null)}
                                    >
                                        Cerrar
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {confirmMessage && (
                            <Alert title="Notificación enviada" className="mt-4">
                                {confirmMessage}
                            </Alert>
                        )}
                    </div>
                );

            case "apoyos":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Gestión de Punteros y Apoyos</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {punteros.map(puntero => (
                                <Card key={puntero.id} title={puntero.nombre} className="h-full">
                                    <p><strong>Zona:</strong> {puntero.zona}</p>
                                    <p><strong>Teléfono:</strong> {puntero.telefono}</p>
                                    <p className="mt-2"><strong>Votantes asignados:</strong> {
                                        votantes.filter(v => v.barrio === puntero.zona).length
                                    }</p>
                                    <div className="mt-4">
                                        <Button onClick={() => enviarMensaje('instrucciones', puntero.nombre)}>
                                            Enviar Instrucciones
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <h3 className="text-lg font-bold mb-4">Asignación de Votantes a Punteros</h3>
                        <div className="bg-white shadow overflow-x-auto rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntero</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votantes Asignados</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votantes Confirmados</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {punteros.map((puntero) => {
                                        const votantesZona = votantes.filter(v => v.barrio === puntero.zona);
                                        const votantesConfirmados = votantesZona.filter(v => v.votado);

                                        return (
                                            <tr key={puntero.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{puntero.nombre}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{puntero.zona}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{votantesZona.length}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {votantesConfirmados.length} ({Math.round((votantesConfirmados.length / votantesZona.length) * 100 || 0)}%)
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Button variant="outline" onClick={() => window.alert(`Lista de votantes para ${puntero.nombre}`)}>
                                                        Ver Lista
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case "transporte":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Gestión de Transporte</h2>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Card title="Vehículos Disponibles" className="h-full">
                                <div className="bg-white overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chofer</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {transportes.map((transporte) => (
                                                <tr key={transporte.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transporte.tipo}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transporte.chofer}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transporte.zona}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transporte.capacidad}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>

                            <Card title="Votantes que Necesitan Transporte" className="h-full">
                                <div className="bg-white overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barrio</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {votantes
                                                .filter(v => v.necesitaTransporte && !v.votado)
                                                .map((votante) => (
                                                    <tr key={votante.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{votante.nombre}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{votante.barrio}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <Select
                                                                value=""
                                                                onChange={(e) => asignarTransporte(votante.id, parseInt(e.target.value))}
                                                                options={[
                                                                    { value: "", label: "Asignar transporte..." },
                                                                    ...transportes
                                                                        .filter(t => t.zona === votante.barrio)
                                                                        .map(t => ({
                                                                            value: t.id,
                                                                            label: `${t.tipo} - ${t.chofer}`
                                                                        }))
                                                                ]}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>

                        <Card title="Rutas de Transporte Optimizadas" className="mb-6">
                            {/* Reemplaza el div con el mensaje por tu componente de mapa */}
                            <MapaTransporte
                                votantes={votantes}
                                transportes={transportes}
                                asignaciones={asignacionesTransporte}
                            />

                            <h3 className="text-lg font-bold mt-6 mb-4">Asignaciones de Transporte</h3>
                            {asignacionesTransporte.length > 0 ? (
                                <div className="bg-white overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votante</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transporte</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora de Recogida</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {asignacionesTransporte.map((asignacion, index) => {
                                                const votante = votantes.find(v => v.id === asignacion.votanteId);
                                                const transporte = transportes.find(t => t.id === asignacion.transporteId);

                                                return (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {votante ? votante.nombre : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {transporte ? `${transporte.tipo} - ${transporte.chofer}` : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {asignacion.horaRecogida}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <Badge
                                                                variant={asignacion.estado === 'completado' ? 'success' :
                                                                    asignacion.estado === 'en_ruta' ? 'info' : 'warning'}
                                                            >
                                                                {asignacion.estado === 'pendiente' ? 'Pendiente' :
                                                                    asignacion.estado === 'en_ruta' ? 'En ruta' : 'Completado'}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        // Actualizar estado de asignación
                                                                        const updatedAsignaciones = [...asignacionesTransporte];
                                                                        updatedAsignaciones[index].estado = 'en_ruta';
                                                                        setAsignacionesTransporte(updatedAsignaciones);

                                                                        // Enviar notificación
                                                                        enviarMensaje('ruta', votante ? votante.nombre : '');
                                                                    }}
                                                                    disabled={asignacion.estado !== 'pendiente'}
                                                                >
                                                                    Iniciar Ruta
                                                                </Button>
                                                                <Button
                                                                    variant="default"
                                                                    onClick={() => {
                                                                        // Actualizar estado de asignación
                                                                        const updatedAsignaciones = [...asignacionesTransporte];
                                                                        updatedAsignaciones[index].estado = 'completado';
                                                                        setAsignacionesTransporte(updatedAsignaciones);

                                                                        // Registrar voto automáticamente
                                                                        if (votante) {
                                                                            registrarVoto(votante.dni);
                                                                        }
                                                                    }}
                                                                    disabled={asignacion.estado !== 'en_ruta'}
                                                                >
                                                                    Completar
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <Alert title="Sin asignaciones">
                                    No hay asignaciones de transporte registradas. Asigne transportes a los votantes que lo necesiten.
                                </Alert>
                            )}
                        </Card>
                    </div>
                );

            case "registro-votantes":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Registro de Votantes en Tiempo Real</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card title="Escanear DNI" className="h-full">
                                <div className="mb-4">
                                    <Input
                                        label="DNI del votante"
                                        placeholder="Ingrese el DNI..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="mt-4 flex space-x-2">
                                        <Button
                                            onClick={() => {
                                                const votante = votantes.find(v => v.dni === searchTerm);
                                                if (votante) {
                                                    setSelectedVotante(votante);
                                                } else {
                                                    mostrarAlerta("Votante no encontrado en el padrón", "Error", "destructive");
                                                }
                                            }}
                                        >
                                            Buscar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSearchTerm("");
                                                setSelectedVotante(null);
                                            }}
                                        >
                                            Limpiar
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-100 rounded-md text-center">
                                    <p className="text-gray-600">En una implementación completa, aquí se podría integrar una funcionalidad de escaneo de DNI usando la cámara del dispositivo</p>
                                </div>
                            </Card>

                            <Card title="Información del Votante" className="h-full">
                                {selectedVotante ? (
                                    <div>
                                        <div className="mb-4 p-4 bg-gray-50 rounded-md">
                                            <h3 className="font-bold text-lg mb-2">{selectedVotante.nombre}</h3>
                                            <p><strong>DNI:</strong> {selectedVotante.dni}</p>
                                            <p><strong>Mesa:</strong> {selectedVotante.mesa}</p>
                                            <p><strong>Estado:</strong> {
                                                selectedVotante.votado ?
                                                    <Badge variant="success">Ya votó</Badge> :
                                                    <Badge variant="warning">Pendiente</Badge>
                                            }</p>
                                        </div>

                                        <div className="mt-4">
                                            <Button
                                                onClick={() => registrarVoto(selectedVotante.dni)}
                                                disabled={selectedVotante.votado}
                                                className="w-full"
                                            >
                                                {selectedVotante.votado ? 'Voto ya registrado' : 'Registrar Voto'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-4">
                                        <p className="text-gray-500">Busque un votante para ver su información</p>
                                    </div>
                                )}
                            </Card>
                        </div>

                        <Card title="Últimos Votantes Registrados" className="mt-6">
                            <div className="bg-white overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {votantes
                                            .filter(v => v.votado)
                                            .slice(0, 5)
                                            .map((votante) => (
                                                <tr key={votante.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date().toLocaleTimeString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{votante.dni}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{votante.nombre}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{votante.mesa}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <Badge variant="success">Registrado</Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                );

            case "dashboard":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Dashboard Electoral</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <Card className="bg-blue-50 border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-700 font-medium">Total Votantes</p>
                                        <p className="text-2xl font-bold text-blue-900">{totalVotantes}</p>
                                    </div>
                                    <Users size={36} className="text-blue-500" />
                                </div>
                            </Card>


                            <Card className="bg-green-50 border-green-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-700 font-medium">Votantes Registrados</p>
                                        <p className="text-2xl font-bold text-green-900">{votantesRegistrados} ({Math.round((votantesRegistrados / totalVotantes) * 100)}%)</p>
                                    </div>
                                    <CheckSquare size={36} className="text-green-500" />
                                </div>
                            </Card>

                            <Card className="bg-purple-50 border-purple-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-purple-700 font-medium">Votantes Afines</p>
                                        <p className="text-2xl font-bold text-purple-900">{votantesAfines} ({Math.round((votantesAfines / totalVotantes) * 100)}%)</p>
                                    </div>
                                    <BarChart2 size={36} className="text-purple-500" />
                                </div>
                            </Card>

                            <Card className="bg-amber-50 border-amber-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-amber-700 font-medium">Con Transporte</p>
                                        <p className="text-2xl font-bold text-amber-900">{votantesConTransporte} ({Math.round((votantesConTransporte / totalVotantes) * 100)}%)</p>
                                    </div>
                                    <Truck size={36} className="text-amber-500" />
                                </div>
                            </Card>
                        </div>
                        {/* Añadir el nuevo gráfico de resultados por mesa */}
                        <Card title="Güemes Avanza - Resultados por Mesa" className="mb-6">
                            <GraficoResultadosMesa
                                titulo="253%"
                                datos={[
                                    {
                                        numero: 1,
                                        total: 1000,
                                        votaron: 600,
                                        nuestra: 360,
                                        resto: 240
                                    },
                                    {
                                        numero: 2,
                                        total: 1000,
                                        votaron: 600,
                                        nuestra: 300,
                                        resto: 300
                                    },
                                    {
                                        numero: 3,
                                        total: 1000,
                                        votaron: 600,
                                        nuestra: 360,
                                        resto: 240
                                    }
                                ]}
                            />
                        </Card>

                        <Card title="" className="mb-6">
                            <PanelMapaCalor votantes={votantes} />
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Card title="Porcentaje de Votantes Afines" className="h-full">
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={datosAfines}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {datosAfines.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card title="Estado de Votación" className="h-full">
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={datosVotacion}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {datosVotacion.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4CAF50' : '#FFA726'} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>

                        <Card title="Votación por Mesa" className="mb-6">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={datosMesasGrafico}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="mesa" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar name="Total Votantes" dataKey="total" fill="#8884d8" />
                                        <Bar name="Votaron" dataKey="votaron" fill="#4CAF50" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card title="Votantes Afines Pendientes" className="h-full">
                                <div className="bg-white overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barrio</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {votantes
                                                .filter(v => v.afin && !v.votado)
                                                .slice(0, 5)
                                                .map((votante) => (
                                                    <tr key={votante.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{votante.nombre}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{votante.mesa}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{votante.barrio}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>

                            <Card title="Mesas con Mayor Participación" className="h-full">
                                <div className="bg-white overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votaron</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porcentaje</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {datosMesasGrafico
                                                .sort((a, b) => b.porcentaje - a.porcentaje)
                                                .map((mesa) => (
                                                    <tr key={mesa.mesa}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mesa.mesa}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mesa.votaron}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mesa.total}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mesa.porcentaje}%</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    </div>
                );

            case "mensajeria":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Módulo de Mensajería Automática</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Card title="Plantillas de Mensajes" className="h-full">
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-md">
                                        <h3 className="font-medium mb-2">Recordatorio de Votación</h3>
                                        <p className="text-sm text-gray-700">
                                            Hola [NOMBRE], te recordamos que hoy son las elecciones. Tu mesa de votación es la [MESA]. ¡Contamos con tu voto!
                                        </p>
                                        <div className="mt-2">
                                            <Button variant="outline" onClick={() => enviarMensaje('recordatorio_masivo', 'todos los votantes')}>
                                                Enviar a Todos
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-md">
                                        <h3 className="font-medium mb-2">Notificación de Transporte</h3>
                                        <p className="text-sm text-gray-700">
                                            Hola [NOMBRE], te informamos que pasaremos a buscarte hoy a las [HORA] en [VEHÍCULO]. El conductor es [CONDUCTOR].
                                        </p>
                                        <div className="mt-2">
                                            <Button variant="outline" onClick={() => enviarMensaje('transporte_masivo', 'votantes con transporte')}>
                                                Enviar a Todos
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-md">
                                        <h3 className="font-medium mb-2">Instrucciones para Fiscales</h3>
                                        <p className="text-sm text-gray-700">
                                            Hola [NOMBRE], te recordamos tus tareas para hoy: 1) Llegar a la mesa [MESA] a las 7:30 AM, 2) Registrar votos, 3) Reportar resultados.
                                        </p>
                                        <div className="mt-2">
                                            <Button variant="outline" onClick={() => enviarMensaje('instrucciones_masivo', 'todos los fiscales')}>
                                                Enviar a Todos
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card title="Programar Mensajes" className="h-full">
                                <div className="space-y-4">
                                    <div>
                                        <Select
                                            label="Tipo de Mensaje"
                                            value=""
                                            onChange={() => { }}
                                            options={[
                                                { value: "", label: "Seleccione tipo de mensaje..." },
                                                { value: "recordatorio", label: "Recordatorio de Votación" },
                                                { value: "transporte", label: "Notificación de Transporte" },
                                                { value: "instrucciones", label: "Instrucciones para Fiscales" },
                                                { value: "agradecimiento", label: "Agradecimiento por Votar" },
                                            ]}
                                        />
                                    </div>

                                    <div>
                                        <Select
                                            label="Destinatarios"
                                            value=""
                                            onChange={() => { }}
                                            options={[
                                                { value: "", label: "Seleccione destinatarios..." },
                                                { value: "todos", label: "Todos los Votantes" },
                                                { value: "afines", label: "Solo Votantes Afines" },
                                                { value: "transporte", label: "Votantes con Transporte" },
                                                { value: "fiscales", label: "Fiscales y Punteros" },
                                                { value: "choferes", label: "Choferes de Transporte" },
                                            ]}
                                        />
                                    </div>

                                    <div>
                                        <Input
                                            label="Hora de Envío"
                                            type="time"
                                            value="08:00"
                                            onChange={() => { }}
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <Button onClick={() => mostrarAlerta("Mensajes programados correctamente", "Programación Exitosa")}>
                                            Programar Envío
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <Card title="Historial de Mensajes Enviados" className="mb-6">
                            <div className="bg-white overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinatario</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {[
                                            { hora: "08:00", tipo: "Recordatorio", destinatario: "Todos los Votantes", estado: "Enviado" },
                                            { hora: "08:30", tipo: "Transporte", destinatario: "Ana García", estado: "Enviado" },
                                            { hora: "08:45", tipo: "Transporte", destinatario: "Pablo Martínez", estado: "Enviado" },
                                            { hora: "09:00", tipo: "Instrucciones", destinatario: "Todos los Fiscales", estado: "Enviado" },
                                            { hora: "09:15", tipo: "Confirmación", destinatario: "Ana García", estado: "Enviado" },
                                        ].map((mensaje, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mensaje.hora}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mensaje.tipo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mensaje.destinatario}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <Badge variant="success">{mensaje.estado}</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        <Card title="Enviar Mensaje Personalizado">
                            <Input
                                label="Destinatario"
                                placeholder="Nombre o número de teléfono..."
                                value=""
                                onChange={() => { }}
                            />

                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Mensaje</label>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    rows={4}
                                    placeholder="Escriba su mensaje..."
                                ></textarea>
                            </div>

                            <div className="flex space-x-2">
                                <Button onClick={() => mostrarAlerta("Mensaje enviado correctamente", "Mensaje Enviado")}>
                                    Enviar Mensaje
                                </Button>
                                <Button variant="outline">
                                    Guardar como Plantilla
                                </Button>
                            </div>
                        </Card>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <header className="bg-white shadow-sm rounded-lg p-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Sistema Electoral</h1>
                <p className="text-gray-500">Gestión integral del proceso electoral</p>
            </header>

            {alert.show && (
                <Alert title={alert.title} variant={alert.variant} className="mb-6">
                    {alert.message}
                </Alert>
            )}

            <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
                <div className="flex flex-wrap border-b">
                    <button
                        className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === "registro" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("registro")}
                    >
                        <MapPin className="inline-block mr-1" size={16} /> Registro Electoral
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === "apoyos" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("apoyos")}
                    >
                        <Users className="inline-block mr-1" size={16} /> Gestión de Apoyos
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === "transporte" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("transporte")}
                    >
                        <Truck className="inline-block mr-1" size={16} /> Transporte
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === "registro-votantes" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("registro-votantes")}
                    >
                        <CheckSquare className="inline-block mr-1" size={16} /> Registro de Votantes
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === "dashboard" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("dashboard")}
                    >
                        <BarChart2 className="inline-block mr-1" size={16} /> Dashboard
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === "mensajeria" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("mensajeria")}
                    >
                        <MessageCircle className="inline-block mr-1" size={16} /> Mensajería
                    </button>
                </div>

                <div className="p-6">
                    {renderTab()}
                </div>
            </div>

            <footer className="text-center text-gray-500 text-sm mt-8">
                Sistema Electoral - Desarrollado para la Gestión Integral del Proceso Electoral
            </footer>
        </div>
    );
};

export default SistemaElectoral;