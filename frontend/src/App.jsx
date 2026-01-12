import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Asistencia from "./pages/Asistencia.jsx";
import Argentina from "./pages/Argentina.jsx";
import Calendario from "./pages/Calendario.jsx";
import Destinos from "./pages/Destinos.jsx";
import DestinoDetail from "./pages/DestinoDetail.jsx";
import Cordoba from "./pages/Cordoba.jsx";
import Excursiones from "./pages/Excursiones.jsx";
import ExcursionDetail from "./pages/ExcursionDetail.jsx";
import Home from "./pages/Home.jsx";
import Ofertas from "./pages/Ofertas.jsx";
import OfertaDetail from "./pages/OfertaDetail.jsx";
import Politicas from "./pages/Politicas.jsx";
import Documentacion from "./pages/Documentacion.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="argentina" element={<Argentina />} />
        <Route path="cordoba" element={<Cordoba />} />
        <Route path="destinos" element={<Destinos />} />
        <Route path="destinos/:slug" element={<DestinoDetail />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="ofertas/:slug" element={<OfertaDetail />} />
        <Route path="excursiones" element={<Excursiones />} />
        <Route path="excursiones/:slug" element={<ExcursionDetail />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="asistencia" element={<Asistencia />} />
        <Route path="politicas" element={<Politicas />} />
        <Route path="documentacion" element={<Documentacion />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
