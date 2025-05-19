// src/components/PanelMapaCalor.js - VERSIÓN ACTUALIZADA
import React, { useState } from 'react';
import MapaCalorReal from './MapaCalor';

const PanelMapaCalor = ({ votantes }) => {
  const [tipoMapa, setTipoMapa] = useState('afines');
  
  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Análisis Geográfico Electoral</h2>
      
      <div className="mb-4">
        <button
          onClick={() => setTipoMapa('afines')}
          className={`px-4 py-2 rounded mr-2 ${tipoMapa === 'afines' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Votantes Afines
        </button>
        
        <button
          onClick={() => setTipoMapa('todos')}
          className={`px-4 py-2 rounded mr-2 ${tipoMapa === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Todos los Votantes
        </button>
        
        <button
          onClick={() => setTipoMapa('participacion')}
          className={`px-4 py-2 rounded mr-2 ${tipoMapa === 'participacion' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Participación
        </button>
        
        <button
          onClick={() => setTipoMapa('transporte')}
          className={`px-4 py-2 rounded mr-2 ${tipoMapa === 'transporte' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Necesitan Transporte
        </button>
      </div>
      
      {/* El key fuerza la recreación del componente */}
      <MapaCalorReal 
        votantes={votantes} 
        tipoMapa={tipoMapa} 
        key={tipoMapa}
      />
      
      <div className="mt-4">
        <h3 className="font-medium mb-2">Análisis del mapa</h3>
        {tipoMapa === 'afines' && (
          <p className="text-sm text-gray-600">
            Este mapa de calor muestra las áreas con mayor concentración de votantes afines a nuestra lista.
            Las zonas rojas indican alta densidad, mientras que las azules muestran menor concentración.
            Use esta información para enfocar recursos donde hay mayor apoyo potencial.
          </p>
        )}
        {tipoMapa === 'todos' && (
          <p className="text-sm text-gray-600">
            Este mapa de calor muestra la distribución general de todos los votantes registrados en el padrón.
            Observe las áreas de mayor concentración poblacional para identificar zonas de alta importancia electoral.
          </p>
        )}
        {tipoMapa === 'participacion' && (
          <p className="text-sm text-gray-600">
            Este mapa de calor visualiza la participación electoral en tiempo real.
            Las áreas rojas muestran zonas donde ya ha votado un gran número de electores, mientras que
            las zonas azules indican menor participación hasta el momento.
          </p>
        )}
        {tipoMapa === 'transporte' && (
          <p className="text-sm text-gray-600">
            Este mapa de calor revela las zonas con mayor necesidad de transporte para votantes.
            Las áreas rojas requieren mayor atención logística y recursos de transporte para
            garantizar que los votantes puedan ejercer su derecho al voto.
          </p>
        )}
      </div>
    </div>
  );
};

export default PanelMapaCalor;