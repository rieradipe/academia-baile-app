import React, { useEffect, useState } from "react";
import ListaClases from "./ListaClases.jsx";
import styles from "./ListaClases.module.css";
import FormularioClase from "./FormularioClase.jsx";

const API = "http://localhost:3000";

const ClasesPage = () => {
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [modoForm, setModoForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const cargarClases = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/clases`);
      const data = await res.json();

      const clasesArray = Array.isArray(data) ? data : [];
      setClases(clasesArray);

      setClaseSeleccionada((prev) => {
        if (!clasesArray.length) return null;
        if (!prev) return clasesArray[0];

        const actualizada = clasesArray.find((c) => c.id === prev.id);
        return actualizada || clasesArray[0];
      });
    } catch (error) {
      console.error("Error cargando clases:", error);
      setClases([]);
      setClaseSeleccionada(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClases();
  }, []);

  if (loading) return <p>Cargando clases...</p>;

  return (
    <div>
      {!modoForm ? (
        <ListaClases
          clases={clases}
          claseSeleccionada={claseSeleccionada}
          onSelect={setClaseSeleccionada}
          onNueva={() => {
            setClaseSeleccionada(null);
            setModoForm(true);
          }}
          onEditar={(clase) => {
            setClaseSeleccionada(clase);
            setModoForm(true);
          }}
          onDelete={async (id) => {
            try {
              await fetch(`${API}/api/clases/${id}`, {
                method: "DELETE",
              });
              await cargarClases();
            } catch (error) {
              console.error("Error desactivando clase:", error);
            }
          }}
        />
      ) : (
        <FormularioClase
          initialData={claseSeleccionada}
          onSubmit={() => {
            setModoForm(false);
            setClaseSeleccionada(null);
            cargarClases();
          }}
          onCancel={() => setModoForm(false)}
        />
      )}
    </div>
  );
};

export default ClasesPage;
