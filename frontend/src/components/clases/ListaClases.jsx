import React, { useMemo, useState } from "react";
import styles from "./ListaClases.module.css";
const ListaClases = ({
  clases = [],
  claseSeleccionada = null,
  onSelect,
  onNueva,
  onEditar,
  onDelete,
}) => {
  const [busqueda, setBusqueda] = useState("");

  const filtradas = useMemo(() => {
    return clases.filter((c) =>
      `${c.nombre || ""} ${c.descripcion || ""}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [clases, busqueda]);

  const detalle = claseSeleccionada || filtradas[0] || null;

  return (
    <div>
      <div>
        <input
          placeholder="Buscar clase..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="button" onClick={onNueva}>
          + Nueva clase
        </button>
      </div>

      {filtradas.length === 0 ? (
        <p>No hay clases disponibles.</p>
      ) : (
        <>
          {filtradas.map((clase) => (
            <div key={clase.id}>
              <button type="button" onClick={() => onSelect?.(clase)}>
                <h3>{clase.nombre}</h3>
                <p>{clase.descripcion || "Sin descripción"}</p>
              </button>

              <button type="button" onClick={() => onEditar?.(clase)}>
                Editar
              </button>
              <button type="button" onClick={() => onDelete?.(clase.id)}>
                Desactivar
              </button>
            </div>
          ))}

          {detalle && (
            <div>
              <h2>Detalle</h2>
              <p>{detalle.nombre}</p>
              <p>{detalle.descripcion || "Sin descripción"}</p>
              <p>{detalle.dias || "Sin días"}</p>
              <p>
                {detalle.hora_inicio || "--:--"} - {detalle.hora_fin || "--:--"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListaClases;
