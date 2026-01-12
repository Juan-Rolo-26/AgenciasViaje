import Excursiones from "./Excursiones.jsx";

export default function Cordoba() {
  return (
    <Excursiones
      forcedSection="cordoba"
      heroOverrides={{
        kicker: (
          <>
            Cordoba <span className="topotours-word">Topotours</span>
          </>
        ),
        title: "Escapadas en Cordoba",
        subtitle:
          "Excursiones y experiencias para vivir las sierras y la ciudad."
      }}
    />
  );
}
