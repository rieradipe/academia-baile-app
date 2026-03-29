import React, { useState } from "react";
import Formulario from "./components/formulario/Formulario.jsx";
import ListaAlumnas from "./components/listaAlumnas/ListaAlumnas.jsx";

export default function App() {
  const [vista, setVista] = useState("home");
  const [alumnaEdit, setAlumnaEdit] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const volverAlInicio = () => {
    setVista("home");
    setAlumnaEdit(null);
  };

  const handleNuevaAlumna = () => {
    setAlumnaEdit(null);
    setVista("crear");
  };

  const handleGestionar = () => {
    setVista("gestionar");
  };

  const handleEditar = (alumna) => {
    setAlumnaEdit(alumna);
    setVista("crear");
  };

  return (
    <div className="page">
      {vista === "home" && (
        <section className="home">
          <h1 className="pageTitle">GA by RieraDiPe</h1>
          <p className="pageSubtitle">
            Gestión de academias fácil y profesional
          </p>

          <div className="actionsRow">
            <button className="btnPrimary" onClick={handleNuevaAlumna}>
              Nueva alumna
            </button>
            <button className="btnSecondary " onClick={handleGestionar}>
              Gestionar alumnas
            </button>
          </div>
        </section>
      )}

      {vista === "crear" && (
        <section className="contentWrap">
          <button
            className="btnSecondary"
            onClick={volverAlInicio}
            style={{ marginBottom: "16px" }}
          >
            Volver
          </button>

          <Formulario
            initialData={alumnaEdit}
            onSubmit={() => {
              setAlumnaEdit(null);
              setReloadKey((k) => k + 1);
              setVista("gestionar");
            }}
          />
        </section>
      )}

      {vista === "gestionar" && (
        <section className="contentWrap">
          <div className="topBar">
            <h2 className="sectionTitle">Gestión de alumnas</h2>
            <button className="btnSecondary" onClick={volverAlInicio}>
              Volver al inicio
            </button>
          </div>

          <ListaAlumnas onEdit={handleEditar} reloadKey={reloadKey} />
        </section>
      )}
    </div>
  );
}
