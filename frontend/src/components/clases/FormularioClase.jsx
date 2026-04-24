import React, { useEffect, useState } from "react";
import styles from "./ListaClases.module.css";

const API = "http://localhost:3000";

const FormularioClase = ({ initialData, onSubmit, onCancel }) => {
  const [clase, setClase] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    cupo: "",
    dias: "",
    hora_inicio: "",
    hora_fin: "",
  });

  useEffect(() => {
    if (initialData) {
      setClase({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        precio: initialData.precio || "",
        cupo: initialData.cupo || "",
        dias: initialData.dias || "",
        hora_inicio: initialData.hora_inicio || "",
        hora_fin: initialData.hora_fin || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClase((prev) => ({ ...prev, [name]: value }));
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

        <label className={styles.formField}>
          <span>Días</span>
          <input
            name="dias"
            value={clase.dias}
            onChange={handleChange}
            placeholder="Ej. Lunes y miércoles"
          />
        </label>

        <label className={styles.formField}>
          <span>Hora inicio</span>
          <input
            type="time"
            name="hora_inicio"
            value={clase.hora_inicio}
            onChange={handleChange}
          />
        </label>

        <label className={styles.formField}>
          <span>Hora fin</span>
          <input
            type="time"
            name="hora_fin"
            value={clase.hora_fin}
            onChange={handleChange}
          />
        </label>
      </div>

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
