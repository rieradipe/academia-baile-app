import React, { useState } from "react";
import Formulario from "./components/formulario/Formulario.jsx";
import ListaAlumnas from "./components/listaAlumnas/ListaAlumnas.jsx";

export default function App() {
  const [alumnaEdit, setAlumnaEdit] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <div style={{ padding: "20px" }}>
      <Formulario
        initialData={alumnaEdit}
        onSubmit={() => {
          setAlumnaEdit(null);
          setReloadKey((k) => k + 1);
        }}
      />

      <ListaAlumnas
        onEdit={(alumna) => setAlumnaEdit(alumna)}
        reloadKey={reloadKey}
      />
    </div>
  );
}
