import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Asistencia from "./pages/Asistencia.jsx";
import Argentina from "./pages/Argentina.jsx";
import Calendario from "./pages/Calendario.jsx";
import Destinos from "./pages/Destinos.jsx";
import DestinoDetail from "./pages/DestinoDetail.jsx";
import Cordoba from "./pages/Cordoba.jsx";
import Cruceros from "./pages/Cruceros.jsx";
import CruceroDetail from "./pages/CruceroDetail.jsx";
import Excursiones from "./pages/Excursiones.jsx";
import ExcursionDetail from "./pages/ExcursionDetail.jsx";
import Home from "./pages/Home.jsx";
import Ofertas from "./pages/Ofertas.jsx";
import OfertaDetail from "./pages/OfertaDetail.jsx";
import Politicas from "./pages/Politicas.jsx";
import Documentacion from "./pages/Documentacion.jsx";
import ModoFanatico from "./pages/ModoFanatico.jsx";
import ModoFanaticoDetail from "./pages/ModoFanaticoDetail.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import WebEnDesarrollo from "./pages/WebEnDesarrollo.jsx";
import "./assets/premium-cards.css";

const MAINTENANCE_MODE = false;

export default function App() {
  if (MAINTENANCE_MODE) {
    return <WebEnDesarrollo />;
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<><ScrollToTop /><Home /></>} />
        <Route path="argentina" element={<><ScrollToTop /><Argentina /></>} />
        <Route path="cordoba" element={<><ScrollToTop /><Cordoba /></>} />
        <Route path="destinos" element={<><ScrollToTop /><Destinos /></>} />
        <Route path="destinos/:slug" element={<><ScrollToTop /><DestinoDetail /></>} />
        <Route path="ofertas" element={<><ScrollToTop /><Ofertas /></>} />
        <Route path="ofertas/:slug" element={<><ScrollToTop /><OfertaDetail /></>} />
        <Route path="cruceros" element={<><ScrollToTop /><Cruceros /></>} />
        <Route path="cruceros/:slug" element={<><ScrollToTop /><CruceroDetail /></>} />
        <Route path="excursiones" element={<><ScrollToTop /><Excursiones /></>} />
        <Route path="excursiones/:slug" element={<><ScrollToTop /><ExcursionDetail /></>} />
        <Route path="modo-fanatico" element={<><ScrollToTop /><ModoFanatico /></>} />
        <Route path="modo-fanatico/:slug" element={<><ScrollToTop /><ModoFanaticoDetail /></>} />
        <Route path="calendario" element={<><ScrollToTop /><Calendario /></>} />
        <Route path="asistencia" element={<><ScrollToTop /><Asistencia /></>} />
        <Route path="politicas" element={<><ScrollToTop /><Politicas /></>} />
        <Route path="documentacion" element={<><ScrollToTop /><Documentacion /></>} />
        <Route path="busqueda" element={<><ScrollToTop /><SearchResults /></>} />
        <Route path="*" element={<><ScrollToTop /><Home /></>} />
      </Route>
    </Routes>
  );
}
