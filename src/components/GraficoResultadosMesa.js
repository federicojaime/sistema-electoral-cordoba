// src/components/GraficoResultadosMesa.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const GraficoResultadosMesa = ({ datos, titulo }) => {
    // Colores para las diferentes listas
    const COLORS = {
        nuestra: '#FF5252', // Rojo para "Nuestra"
        votaron: '#90CAF9', // Azul claro para "Votaron"
        resto: '#263238'    // Azul oscuro para "Resto"
    };

    // Formato de datos para el gráfico
    const datosFormateados = datos.map(mesa => ({
        nombre: `Mesa ${mesa.numero}`,
        votaron: mesa.votaron,
        nuestra: mesa.nuestra,
        resto: mesa.resto,
        porcentajeNuestra: ((mesa.nuestra / mesa.votaron) * 100).toFixed(0) + '%',
        porcentajeVotaron: ((mesa.votaron / mesa.total) * 100).toFixed(0) + '%',
        porcentajeResto: ((mesa.resto / mesa.votaron) * 100).toFixed(0) + '%',
    }));

    // Encontrar el valor máximo para escalar el gráfico
    const maxValue = Math.max(...datos.map(mesa => Math.max(mesa.votaron, mesa.total)));
    const yAxisTicks = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].filter(tick => tick <= maxValue + 100);

    return (
        <div className="w-full">
            <div className="bg-orange-100 p-4 border-2 border-purple-500 rounded">
                <div className="mb-2 text-center font-bold text-lg">{titulo}</div>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={datosFormateados}
                            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                            barGap={0}
                            barCategoryGap="20%"
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis dataKey="nombre" axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 'dataMax + 100']} ticks={yAxisTicks} axisLine={false} tickLine={false} />
                            <Tooltip
                                formatter={(value, name) => {
                                    if (name === 'nuestra') return [`${value} (${datosFormateados.find(d => d.nuestra === value)?.porcentajeNuestra})`, 'Nuestra'];
                                    if (name === 'resto') return [`${value} (${datosFormateados.find(d => d.resto === value)?.porcentajeResto})`, 'Resto'];
                                    return [`${value} (${datosFormateados.find(d => d.votaron === value)?.porcentajeVotaron})`, 'Votaron'];
                                }}
                                labelFormatter={(label) => `${label}`}
                            />

                            {/* Barras para votantes totales (celeste) */}
                            <Bar dataKey="votaron" fill={COLORS.votaron} radius={[4, 4, 0, 0]}>
                                {datosFormateados.map((entry, index) => (
                                    <Cell key={`cell-votaron-${index}`} fill={COLORS.votaron} />
                                ))}
                            </Bar>

                            {/* Barras para nuestra lista (rojo) */}
                            <Bar dataKey="nuestra" fill={COLORS.nuestra} radius={[4, 4, 0, 0]}>
                                {datosFormateados.map((entry, index) => (
                                    <Cell key={`cell-nuestra-${index}`} fill={COLORS.nuestra} />
                                ))}
                            </Bar>

                            {/* Barras para el resto (azul oscuro) */}
                            <Bar dataKey="resto" fill={COLORS.resto} radius={[4, 4, 0, 0]}>
                                {datosFormateados.map((entry, index) => (
                                    <Cell key={`cell-resto-${index}`} fill={COLORS.resto} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    {datosFormateados.map((mesa, index) => (
                        <div key={index} className="text-center">
                            <div className="font-semibold">{mesa.nombre}</div>
                            <div>Votaron: {mesa.porcentajeVotaron}</div>
                            <div>Nuestra: {mesa.porcentajeNuestra}</div>
                            <div>Resto: {mesa.porcentajeResto}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GraficoResultadosMesa;