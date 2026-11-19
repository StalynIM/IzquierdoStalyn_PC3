import { useState } from 'react';
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import ReactHook from 'alova/react';
import { useRequest } from 'alova/client';

const alovaInstance = createAlova({
  baseURL: '/api-universidades', 
  statesHook: ReactHook,        
  requestAdapter: adapterFetch(),
  cacheFor: null,    
  responded: (respuesta) => respuesta.json(), 
});

const pedirUniversidades = () =>
  alovaInstance.Get('/search', { params: { country: 'Peru' } });

export default function App() {
  const { loading, data, error, send } = useRequest(pedirUniversidades, {
    initialData: [],
  });
  const [busqueda, setBusqueda] = useState('');
  const universidadesFiltradas = data.filter((u) =>
    u.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="contenedor">
      <h1> Universidades del Perú</h1>

      <div className="barra">
        <input
          type="search"
          placeholder="Buscar universidad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {}
        <button type="button" onClick={() => send()} disabled={loading}>
          {loading ? 'Cargando...' : '↻ Refrescar'}
        </button>
      </div>

      <p>{universidadesFiltradas.length} de {data.length} resultados</p>

      {}
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">No se pudo consultar la API: {error.message}</p>
      ) : universidadesFiltradas.length === 0 ? (
        <p>No hay universidades que coincidan.</p>
      ) : (
        universidadesFiltradas.map((u, indice) => (
          <div className="tarjeta" key={indice + u.name}>
            <h3>{u.name}</h3>
            <p>{u.domains[0]}</p>
            <a href={u.web_pages[0]} target="_blank" rel="noreferrer">
              Visitar sitio web
            </a>
          </div>
        ))
      )}
    </div>
  );
}