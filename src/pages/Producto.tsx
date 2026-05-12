import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { lotes, visualLotes, precios } from "../data/lotes";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Producto() {
  const { tokenId } = useParams();
  const index = Number(tokenId);
  const lote = lotes[index];
  const visual = visualLotes[index];
  const [activa, setActiva] = useState(0);

  if (!lote || !visual) {
    return (
      <div className="min-h-screen bg-ylo-bg flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Link to="/catalogo" className="text-ylo-ink underline">
            Volver al catalogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const precio = precios[lote.modelId];
  const imagenes = [
    visual.imagenes.front,
    visual.imagenes.back,
    visual.imagenes.hanger,
  ];

  // Descripción comercial corta, sin meterse en trazabilidad
  const descripcionPorModelo: Record<string, string> = {
    "YLO-TOP-001":
      "Top técnico de corte ajustado y tirantes anchos. Tejido elástico y transpirable, pensado para entrenamientos intensos y uso diario. Logo YLÖ frontal",
    "YLO-SHO-001":
      "Short ligero con cinturilla elástica y diseño aerodinámico. Tejido técnico de secado rápido, ideal para running y entrenamientos de alta intensidad",
  };

  const descripcion = descripcionPorModelo[lote.modelId] ?? "";

  return (
    <div className="min-h-screen bg-ylo-bg flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 py-12 w-full">
        <Link
          to="/catalogo"
          className="text-sm text-ylo-ink-soft hover:text-ylo-ink mb-8 inline-block"
        >
          Volver al catalogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">

          {/* Galería de fotos */}
          <div>
            <img
              src={imagenes[activa]}
              alt={lote.productName}
              className="w-full h-auto rounded-2xl"
            />

            <div className="mt-4 grid grid-cols-3 gap-3">
              {imagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiva(i)}
                  className={`rounded-xl overflow-hidden border-2 ${
                    activa === i ? "border-ylo-ink" : "border-ylo-border"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* Info comercial — SIN trazabilidad */}
          <div className="lg:sticky lg:top-32 self-start">
            <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-3">
              {visual.colorName}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tightest text-ylo-ink leading-[1.05]">
              {lote.productName}
            </h1>

            <p className="mt-6 text-3xl font-semibold text-ylo-ink">
              {precio.toFixed(2).replace(".", ",")} €
            </p>
            <p className="mt-1 text-xs text-ylo-ink-soft">IVA incluido</p>

            <div className="mt-8 pb-8 border-b border-ylo-border">
              <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-2">
                Talla
              </p>
              <div className="inline-block px-5 py-2 rounded-full border-2 border-ylo-ink text-sm font-medium">
                Talla única
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-2">
                Descripción
              </p>
              <p className="text-sm text-ylo-ink-soft leading-relaxed">
                {descripcion}
              </p>
            </div>

            <div className="mt-10 space-y-3">
              <button className="w-full bg-ylo-ink text-white py-4 rounded-full text-sm font-medium hover:bg-ylo-ink-soft">
                Añadir al carrito
              </button>

              <Link
                to={`/dpp/${index}`}
                className="block w-full text-center border-2 border-ylo-ink py-4 rounded-full text-sm font-medium hover:bg-ylo-ink hover:text-white"
              >
                Ver Pasaporte Digital
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Producto;