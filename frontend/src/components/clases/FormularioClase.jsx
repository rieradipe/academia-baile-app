import React, { useEffect, useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <h2>{initialData ? "Editar clase" : "Nueva clase"}</h2>

      <input
        name="nombre"
        value={clase.nombre}
        onChange={handleChange}
        placeholder="Nombre"
      />

      <input
        name="descripcion"
        value={clase.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
      />

      <input
        name="precio"
        value={clase.precio}
        onChange={handleChange}
        placeholder="Precio"
      />

      <input
        name="cupo"
        value={clase.cupo}
        onChange={handleChange}
        placeholder="Cupo"
      />

      <input
        name="dias"
        value={clase.dias}
        onChange={handleChange}
        placeholder="Días"
      />

      <input
        type="time"
        name="hora_inicio"
        value={clase.hora_inicio}
        onChange={handleChange}
      />

      <input
        type="time"
        name="hora_fin"
        value={clase.hora_fin}
        onChange={handleChange}
      />

      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
};

export default FormularioClase;
