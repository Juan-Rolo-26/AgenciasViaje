import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Asistencia from "./pages/Asistencia.jsx";
import Calendario from "./pages/Calendario.jsx";
import Destinos from "./pages/Destinos.jsx";
import Excursiones from "./pages/Excursiones.jsx";
import Home from "./pages/Home.jsx";
import Ofertas from "./pages/Ofertas.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="destinos" element={<Destinos />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="excursiones" element={<Excursiones />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="asistencia" element={<Asistencia />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
