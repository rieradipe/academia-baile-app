import React, { useEffect, useMemo, useState } from "react";
import "../../styles/global.css";
import styles from "./ListaAlumnas.module.css";

const API = "http://localhost:3000";

// Devuelve YYYY-MM del mes actual
const mesActual = () => {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
};

// Parseo robusto (evita que reviente si el backend devuelve texto/HTML/error)
const safeJson = async (res, label) => {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text };
  }
  if (!res.ok) {
    console.error(`❌ ${label} -> ${res.status}`, data);
    throw new Error(data?.error || "Error de servidor");
  }
  return data;
};

const ListaAlumnas = ({ onEdit, reloadKey = 0 }) => {
  const [alumnas, setAlumnas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroActiva, setFiltroActiva] = useState("1");
  const [mensaje, setMensaje] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [alumnasData, pagosData] = await Promise.all([
        fetch(`${API}/api/alumnas?activa=${filtroActiva}`).then((res) =>
          safeJson(res, "GET /api/alumnas")
        ),
        fetch(`${API}/api/pagos?mes=${mesActual()}`).then((res) =>
          safeJson(res, `GET /api/pagos?mes=${mesActual()}`)
        ),
      ]);

      setAlumnas(Array.isArray(alumnasData) ? alumnasData : []);
      setPagos(Array.isArray(pagosData) ? pagosData : []);
    } catch (e) {
      console.error("Error cargando datos:", e.message);
      setAlumnas([]);
      setPagos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [reloadKey, filtroActiva]); // ✅ se recarga cuando el formulario guarda

  const cumpleanios = useMemo(() => {
    const mes = new Date().getMonth();
    return alumnas.filter((a) => {
      if (!a?.fecha_nacimiento) return false;
      const f = new Date(a.fecha_nacimiento);
      return !Number.isNaN(f.getTime()) && f.getMonth() === mes;
    });
  }, [alumnas]);

  const pagosPorAlumna = useMemo(() => {
    const map = new Map();
    for (const p of pagos) {
      const arr = map.get(p.alumna_id) || [];
      arr.push(p);
      map.set(p.alumna_id, arr);
    }
    return map;
  }, [pagos]);

  const getEstadoPago = (alumnaId) => {
    const arr = pagosPorAlumna.get(alumnaId) || [];
    return arr.some((p) => p.estado === "pagado") ? "pagado" : "pendiente";
  };

  const getPagoIdParaToggle = (alumnaId) => {
    const arr = pagosPorAlumna.get(alumnaId) || [];
    return arr.length ? arr[0].id : null;
  };

  const togglePagoGeneral = async (alumnaId) => {
    try {
      const estado = getEstadoPago(alumnaId);
      const pagoId = getPagoIdParaToggle(alumnaId);

      if (pagoId) {
        const res = await fetch(`${API}/api/pagos/${pagoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estado: estado === "pagado" ? "pendiente" : "pagado",
          }),
        });
        await safeJson(res, `PUT /api/pagos/${pagoId}`);
      } else {
        const res = await fetch(`${API}/api/pagos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            alumna_id: alumnaId,
            fecha: new Date().toISOString().slice(0, 10),
            importe: 40,
            concepto: "Mensualidad general",
            estado: "pagado",
          }),
        });
        await safeJson(res, "POST /api/pagos");
      }

      const pagosData = await fetch(`${API}/api/pagos?mes=${mesActual()}`).then(
        (res) => safeJson(res, `GET /api/pagos?mes=${mesActual()}`)
      );
      setPagos(Array.isArray(pagosData) ? pagosData : []);
    } catch (e) {
      console.error(e);
      alert(`No se pudo actualizar el pago: ${e.message}`);
    }
  };
  const toggleActiva = async (id, activa) => {
    try {
      const res = await fetch(`${API}/api/alumnas/${id}/activa`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activa }),
      });

      await safeJson(res, `PATCH /api/alumnas/${id}/activa`);

      setMensaje(activa === 0 ? "Alumna desactivada" : "Alumna reactivada");

      load();

      setTimeout(() => setMensaje(""), 2500);
    } catch (e) {
      console.error(e);
      setMensaje("Error al cambiar estado");
      setTimeout(() => setMensaje(""), 2500);
    }
  };

  if (loading) return <p>Cargando…</p>;

  return (
    <div className={styles.listaContainer}>
      {cumpleanios.length > 0 && (
        <div className={styles.cumpleContainer}>
          <h2>🎂 Cumpleañeras del mes</h2>
          <ul>
            {cumpleanios.map((a) => (
              <li key={a.id}>
                {a.nombre} {a.apellidos}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.toolbar}>
        <select
          value={filtroActiva}
          onChange={(e) => setFiltroActiva(e.target.value)}
          className={styles.select}
        >
          <option value="1">Activas</option>
          <option value="0">Inactivas</option>
          <option value="all">Todas</option>
        </select>
      </div>

      <div className={styles.cardsGrid}>
        {alumnas.map((a) => {
          const estado = getEstadoPago(a.id);

          return (
            <div
              key={a.id}
              className={`${styles.card} ${!a.activa ? styles.inactiva : ""}`}
            >
              <div className={styles.cardTop}>
                <div>
                  <h3 className={styles.name}>
                    {a.nombre} {a.apellidos}
                  </h3>
                  {!a.activa && (
                    <span className={styles.desactivada}>
                      Alumna desactivada
                    </span>
                  )}
                  <div className={styles.meta}>
                    <div>DNI: {a.dni || "—"}</div>
                    <div>Teléfono: {a.telefono || "—"}</div>
                    <div>Nº SS: {a.numero_ss || "—"}</div>
                    <div className={styles.small}>Mes: {mesActual()}</div>
                  </div>
                </div>

                <span
                  className={`${styles.badge} ${
                    estado === "pagado" ? styles.pagado : styles.pendiente
                  }`}
                >
                  {estado === "pagado" ? "Pagado" : "Pendiente"}
                </span>
              </div>

              <div className={styles.actionsRow}>
                <button
                  className={styles.btn}
                  disabled={!a.activa}
                  onClick={() => togglePagoGeneral(a.id)}
                >
                  {estado === "pagado" ? "Marcar pendiente" : "Marcar pagado"}
                </button>

                <button className={styles.btn} onClick={() => onEdit?.(a)}>
                  Editar
                </button>
                <button
                  className={styles.btn}
                  onClick={() => toggleActiva(a.id, a.activa ? 0 : 1)}
                >
                  {a.activa ? "Desactivar" : "Reactivar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListaAlumnas;
