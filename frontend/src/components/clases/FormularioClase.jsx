import React, { useEffect, useState } from "react";
import styles from "./ListaClases.module.css";

import { API } from "../../config/api";

const horarioVacio = {
  dia: "",
  hora_inicio: "",
  hora_fin: "",
  descripcion: "",
};

const FormularioClase = ({ initialData, onSubmit, onCancel }) => {
  const [clase, setClase] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    cupo: "",
  });

  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    if (initialData) {
      setClase({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        precio: initialData.precio || "",
        cupo: initialData.cupo || "",
      });
    } else {
      setClase({
        nombre: "",
        descripcion: "",
        precio: "",
        cupo: "",
      });
      setHorarios([]);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClase((prev) => ({ ...prev, [name]: value }));
  };

  const agregarHorario = () => {
    setHorarios((prev) => [...prev, horarioVacio]);
  };

  const cambiarHorario = (index, campo, valor) => {
    setHorarios((prev) =>
      prev.map((horario, i) =>
        i === index ? { ...horario, [campo]: valor } : horario
      )
    );
  };

  const eliminarHorario = (index) => {
    setHorarios((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const isEdit = Boolean(initialData?.id);

      const url = isEdit
        ? `${API}/api/clases/${initialData.id}`
        : `${API}/api/clases`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clase),
      });
      if (!res.ok) throw new Error("Error guardando clase");

      const saved = await res.json();
      const claseId = saved.id || saved.lastID || initialData?.id;

      for (const horario of horarios) {
        if (!horario.dia || !horario.hora_inicio || !horario.hora_fin) continue;

        const resHorario = await fetch(`${API}/api/horarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clase_id: claseId,
            dia: horario.dia,
            hora_inicio: horario.hora_inicio,
            hora_fin: horario.hora_fin,
            descripcion: horario.descripcion || "Horario disponible",
            activa: 1,
          }),
        });

        if (!resHorario.ok) {
          throw new Error("Error guardando horarios");
        }
      }

      onSubmit?.();
    } catch (error) {
      console.error("Error guardando clase:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formCard}>
      <h2 className={styles.formTitle}>
        {initialData ? "Editar clase" : "Nueva clase"}
      </h2>

      <div className={styles.formGrid}>
        <label className={styles.formField}>
          <span>Nombre</span>
          <input
            name="nombre"
            value={clase.nombre}
            onChange={handleChange}
            placeholder="Ej. Flamenco"
          />
        </label>

        <label className={styles.formField}>
          <span>Descripción</span>
          <input
            name="descripcion"
            value={clase.descripcion}
            onChange={handleChange}
            placeholder="Ej. Clase de flamenco"
          />
        </label>

        <label className={styles.formField}>
          <span>Precio</span>
          <input
            name="precio"
            value={clase.precio}
            onChange={handleChange}
            placeholder="Ej. 30"
          />
        </label>

        <label className={styles.formField}>
          <span>Cupo</span>
          <input
            name="cupo"
            value={clase.cupo}
            onChange={handleChange}
            placeholder="Ej. 15"
          />
        </label>
      </div>

      <section className={styles.horariosSection}>
        <div className={styles.horariosHeader}>
          <h3>Horarios</h3>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={agregarHorario}
          >
            + Añadir horario
          </button>
        </div>

        {horarios.length === 0 && (
          <p className={styles.emptyText}>Todavía no has añadido horarios.</p>
        )}

        {horarios.map((horario, index) => (
          <div key={index} className={styles.horarioRow}>
            <select
              value={horario.dia}
              onChange={(e) => cambiarHorario(index, "dia", e.target.value)}
            >
              <option value="">Día</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </select>

            <input
              type="time"
              value={horario.hora_inicio}
              onChange={(e) =>
                cambiarHorario(index, "hora_inicio", e.target.value)
              }
            />

            <input
              type="time"
              value={horario.hora_fin}
              onChange={(e) =>
                cambiarHorario(index, "hora_fin", e.target.value)
              }
            />

            <input
              value={horario.descripcion}
              onChange={(e) =>
                cambiarHorario(index, "descripcion", e.target.value)
              }
              placeholder="Descripción opcional"
            />

            <button
              type="button"
              className={styles.dangerButton}
              onClick={() => eliminarHorario(index)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </section>

      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryButton}>
          Guardar
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormularioClase;
