import { Link } from "react-router-dom";
import { lotes } from "../data/lotes";

function Catalogo() {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">YLÖ</h1>
          <p className="text-sm text-stone-500 mt-1">Moda Activa Sostenible</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-stone-900">Catálogo</h2>
          <p className="text-stone-600 mt-2">
            Cada prenda dispone de un Pasaporte Digital de Producto verificable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lotes.map((lote, index) => (
            <Link
              key={lote.batchId}
              to={`/dpp/${index}`}
              className="bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-stone-100 flex items-center justify-center">
                <span className="text-stone-300 text-sm">Imagen del producto</span>
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-stone-500 mb-1">
                  {lote.category}
                </p>
                <h3 className="text-lg font-semibold text-stone-900">
                  {lote.productName}
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  Lote {lote.batchId.split("-").slice(-3).join(" · ")}
                </p>
                <p className="text-xs text-stone-500 mt-3">
                  Hecho en {lote.production.facility.country}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs text-stone-500">
            YLÖ · Moda Activa Sostenible S.L. · Trabajo Fin de Grado UIE 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Catalogo;