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
    <div className={styles.masterDetail}>
      <aside className={styles.listPanel}>
        <div className={styles.toolbar}>
          <input
            className={styles.searchInput}
            placeholder="Buscar clase..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <button
            type="button"
            className={styles.primaryButton}
            onClick={onNueva}
          >
            + Nueva clase
          </button>
        </div>

        <div className={styles.listBody}>
          {filtradas.length === 0 ? (
            <p className={styles.emptyText}>No hay clases disponibles.</p>
          ) : (
            filtradas.map((clase) => {
              const activa = detalle?.id === clase.id;

              return (
                <article
                  key={clase.id}
                  className={`${styles.listRow} ${
                    activa ? styles.listRowActive : ""
                  }`}
                >
                  <button
                    type="button"
                    className={styles.rowButton}
                    onClick={() => onSelect?.(clase)}
                  >
                    <span className={styles.listName}>{clase.nombre}</span>
                    <span className={styles.listSub}>
                      {clase.descripcion || "Sin descripción"}
                    </span>
                  </button>

                  <div className={styles.rowActions}>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => onEditar?.(clase)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className={styles.dangerButton}
                      onClick={() => onDelete?.(clase.id)}
                    >
                      Desactivar
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </aside>

      <section className={styles.detailPanel}>
        {detalle ? (
          <article className={styles.card}>
            <h2 className={styles.title}>{detalle.nombre}</h2>

            <div className={styles.meta}>
              <p>
                <strong>Descripción:</strong>{" "}
                {detalle.descripcion || "Sin descripción"}
              </p>
              <p>
                <strong>Días:</strong> {detalle.dias || "Sin días"}
              </p>
              <p>
                <strong>Horario:</strong> {detalle.hora_inicio || "--:--"} -{" "}
                {detalle.hora_fin || "--:--"}
              </p>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => onEditar?.(detalle)}
              >
                Editar clase
              </button>

              <button
                type="button"
                className={styles.dangerButton}
                onClick={() => onDelete?.(detalle.id)}
              >
                Desactivar
              </button>
            </div>
          </article>
        ) : (
          <div className={styles.emptyDetail}>
            <p>Selecciona una clase para ver el detalle.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ListaClases;
