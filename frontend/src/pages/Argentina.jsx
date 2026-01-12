import Destinos from "./Destinos.jsx";

export default function Argentina() {
  return (
    <Destinos
      lockedPais="Argentina"
      heroOverrides={{
        kicker: (
          <>
            Argentina <span className="topotours-word">Topotours</span>
          </>
        ),
        title: "Descubri Argentina",
        subtitle:
          "Circuitos, escapadas y experiencias nacionales para cada estilo de viaje."
      }}
    />
  );
}
