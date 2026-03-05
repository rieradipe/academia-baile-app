import React, { useEffect, useMemo, useState } from "react";
import "../../styles/global.css";
import styles from "./Formulario.module.css";

const API = "http://localhost:3000";

const Formulario = ({ initialData = null, onSubmit }) => {
  const [alumna, setAlumna] = useState({
    id: null,
    nombre: "",
    apellidos: "",
    dni: "",
    numero_ss: "",
    telefono: "",
    email: "",
    fecha_nacimiento: "",
    observaciones: "",
  });

  const [horarios, setHorarios] = useState([]);
  const [horariosSeleccionados, setHorariosSeleccionados] = useState([]);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  // Cargar horarios
  useEffect(() => {
    fetch(`${API}/api/horarios`)
      .then((res) => res.json())
      .then((data) => setHorarios(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error cargando horarios:", err));
  }, []);

  const resetForm = () => {
    setAlumna({
      id: null,
      nombre: "",
      apellidos: "",
      dni: "",
      numero_ss: "",
      telefono: "",
      email: "",
      fecha_nacimiento: "",
      observaciones: "",
    });
    setHorariosSeleccionados([]);
  };

  // Rellenar si editas
  useEffect(() => {
    if (initialData) {
      setAlumna({
        id: initialData.id ?? null,
        nombre: initialData.nombre ?? "",
        apellidos: initialData.apellidos ?? "",
        dni: initialData.dni ?? "",
        numero_ss: initialData.numero_ss ?? "",
        telefono: initialData.telefono ?? "",
        email: initialData.email ?? "",
        fecha_nacimiento: initialData.fecha_nacimiento ?? "",
        observaciones: initialData.observaciones ?? "",
      });

      setHorariosSeleccionados(
        Array.isArray(initialData.horarios)
          ? initialData.horarios.map((h) => Number(h.horario_id ?? h.id))
          : []
      );
    } else {
      resetForm();
    }

    setErrores({});
    setMensaje("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Agrupar horarios por clase + ordenar para que salga bonito
  const horariosPorClase = useMemo(() => {
    const map = new Map();

    for (const h of horarios) {
      const key = h.clase_nombre || "Sin clase";
      const arr = map.get(key) || [];
      arr.push(h);
      map.set(key, arr);
    }

    for (const [k, arr] of map.entries()) {
      arr.sort(
        (a, b) =>
          (a.dia || "").localeCompare(b.dia || "") ||
          (a.hora_inicio || "").localeCompare(b.hora_inicio || "")
      );
      map.set(k, arr);
    }

    return Array.from(map.entries());
  }, [horarios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumna((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
    setMensaje("");
  };

  const toggleHorario = (horarioId) => {
    const id = Number(horarioId);
    setHorariosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const validar = () => {
    const e = {};
    if (!alumna.nombre.trim()) e.nombre = "Requerido";
    if (!alumna.apellidos.trim()) e.apellidos = "Requerido";
    if (!alumna.dni.trim()) e.dni = "Requerido";
    if (!alumna.telefono.trim()) e.telefono = "Requerido";
    if (!alumna.numero_ss.trim()) e.numero_ss = "Requerido";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const v = validar();
    if (Object.keys(v).length) {
      setErrores(v);
      return;
    }

    try {
      const isEdit = Boolean(alumna.id);
      const url = isEdit
        ? `${API}/api/alumnas/${alumna.id}`
        : `${API}/api/alumnas`;
      const method = isEdit ? "PUT" : "POST";

      // 1) Guardar alumna
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumna),
      });

      if (!res.ok) throw new Error("Error guardando la alumna");
      const saved = await res.json();
      const alumnaId = saved.id || alumna.id;

      // 2) Reemplazar inscripciones
      const res2 = await fetch(`${API}/api/inscripciones/replace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alumna_id: alumnaId,
          horario_ids: horariosSeleccionados,
        }),
      });
      if (!res2.ok) throw new Error("Error guardando inscripciones");

      setMensaje(`✅ Alumna ${isEdit ? "modificada" : "creada"} correctamente`);
      resetForm();
      onSubmit?.(saved);

      setTimeout(() => setMensaje(""), 2500);
    } catch (err) {
      console.error(err);
      setMensaje(`❌ ${err.message || "Error al guardar"}`);
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>
        {alumna.id ? "Editar alumna" : "Alta de alumna"}
      </h2>

      {/* GRID inputs */}
      <div className={styles.grid}>
        <Input
          label="Nombre*"
          name="nombre"
          value={alumna.nombre}
          onChange={handleChange}
          error={errores.nombre}
        />
        <Input
          label="Apellidos*"
          name="apellidos"
          value={alumna.apellidos}
          onChange={handleChange}
          error={errores.apellidos}
        />
        <Input
          label="DNI*"
          name="dni"
          value={alumna.dni}
          onChange={handleChange}
          error={errores.dni}
        />
        <Input
          label="Teléfono*"
          name="telefono"
          value={alumna.telefono}
          onChange={handleChange}
          error={errores.telefono}
        />
        <Input
          label="Nº Seguridad Social*"
          name="numero_ss"
          value={alumna.numero_ss}
          onChange={handleChange}
          error={errores.numero_ss}
        />
        <Input
          label="Email"
          name="email"
          value={alumna.email}
          onChange={handleChange}
        />
        <Input
          type="date"
          label="Fecha nacimiento"
          name="fecha_nacimiento"
          value={alumna.fecha_nacimiento || ""}
          onChange={handleChange}
        />

        {/* ✅ Observaciones dentro del grid y ancho completo */}
        <div className={styles.fieldWide}>
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={alumna.observaciones}
            onChange={handleChange}
            rows={3}
            placeholder="Notas: nivel previo, incidencias, pendiente de matrícula, etc."
          />
        </div>
      </div>

      {/* Horarios */}
      <div className={styles.section}>
        <h3>Inscripción en clases</h3>

        <p className={styles.hint}>Selecciona uno o varios horarios.</p>

        {horariosPorClase.length === 0 ? (
          <p className={styles.muted}>No hay horarios creados todavía.</p>
        ) : (
          <div className={styles.horariosGroup}>
            {horariosPorClase.map(([claseNombre, items]) => (
              <div key={claseNombre} className={styles.horarioBlock}>
                {/* ✅ aquí está el “no apelotonado” */}
                <h4 className={styles.horarioTitle}>
                  {claseNombre} ({items.length} horarios)
                </h4>
                <div className={styles.horarioList}>
                  {items.map((h) => {
                    const hid = Number(h.id);
                    const desc = h.descripcion ? ` (${h.descripcion})` : "";
                    const label = `${h.dia} · ${h.hora_inicio}-${h.hora_fin}${desc}`;

                    return (
                      <label key={hid} className={styles.horarioRow}>
                        <input
                          type="checkbox"
                          checked={horariosSeleccionados.includes(hid)}
                          onChange={() => toggleHorario(hid)}
                        />
                        <span className={styles.horarioLabel}>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.btnPrimary}>
          {alumna.id ? "Guardar cambios" : "Crear alumna"}
        </button>

        {mensaje && <div className={styles.toast}>{mensaje}</div>}
      </div>
    </form>
  );
};

const Input = ({ label, error, ...props }) => (
  <div className={styles.field}>
    <label>{label}</label>
    <input {...props} />
    {error && <span className={styles.error}>{error}</span>}
  </div>
);

export default Formulario;
