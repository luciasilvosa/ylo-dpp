import { Link } from "react-router-dom";
import { lotes, visualLotes, type DPP } from "../data/lotes";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface ModeloAgrupado {
  modelId: string;
  productName: string;
  category: string;
  materials: DPP["materials"];
  lotes: { lote: DPP; index: number }[];
}

function agruparPorModelo(): ModeloAgrupado[] {
  const mapa = new Map<string, ModeloAgrupado>();
  lotes.forEach((lote, index) => {
    if (!mapa.has(lote.modelId)) {
      mapa.set(lote.modelId, {
        modelId: lote.modelId,
        productName: lote.productName,
        category: lote.category,
        materials: lote.materials,
        lotes: [],
      });
    }
    mapa.get(lote.modelId)!.lotes.push({ lote, index });
  });
  return Array.from(mapa.values());
}

function Catalogo() {
  const modelos = agruparPorModelo();

  return (
    <div className="min-h-screen bg-ylo-bg flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ylo-surface border border-ylo-border mb-8">
            <span className="w-2 h-2 rounded-full bg-ylo-pool"></span>
            <p className="text-xs uppercase tracking-widest text-ylo-ink">
              Colección 2025
            </p>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tightest text-ylo-ink leading-[0.95] max-w-3xl">
            Cada prenda con su{" "}
            <span className="italic font-light text-ylo-pool-dark">
              historia trazable.
            </span>
          </h1>
          <p className="mt-8 text-lg text-ylo-ink-soft max-w-xl leading-relaxed">
            Selecciona un modelo para verlo en detalle y acceder a su pasaporte
            digital.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-24">
          <div className="space-y-24">
            {modelos.map((modelo) => (
              <BloqueModelo key={modelo.modelId} modelo={modelo} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function BloqueModelo({ modelo }: { modelo: ModeloAgrupado }) {
  return (
    <article>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 items-end pb-8 border-b border-ylo-border">
        <div className="lg:col-span-2">
          <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-3">
            {modelo.category}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tightest text-ylo-ink leading-tight">
            {modelo.productName}
          </h2>
        </div>

        <div className="lg:text-right">
          <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-3">
            Composición
          </p>
          <div className="space-y-1">
            {modelo.materials.map((m) => (
              <p key={m.fiber} className="text-sm text-ylo-ink">
                {m.percentage}% {m.fiber}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modelo.lotes.map(({ lote, index }) => (
          <TarjetaLote key={lote.batchId} lote={lote} index={index} />
        ))}
      </div>
    </article>
  );
}

function TarjetaLote({ lote, index }: { lote: DPP; index: number }) {
  const visual = visualLotes[index];

  return (
    <Link
      to={`/producto/${index}`}
      className="group block bg-ylo-surface rounded-2xl overflow-hidden border border-ylo-border hover:border-ylo-ink transition-all duration-300"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-ylo-bg">
        <img
          src={visual?.imagenes.front}
          alt={`${lote.productName} ${visual?.colorName}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        <img
          src={visual?.imagenes.back}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ylo-surface/95 backdrop-blur-sm border border-ylo-border">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: visual?.color }}
          ></span>
          <p className="text-xs font-medium text-ylo-ink">
            {visual?.colorName}
          </p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-2">
          {lote.productName}
        </p>
        <h3 className="text-lg font-semibold text-ylo-ink mb-4">
          {visual?.colorName}
        </h3>

        <div className="flex items-center justify-between pt-4 border-t border-ylo-border">
          <span className="text-sm font-medium text-ylo-ink">
            Ver producto
          </span>
          <span className="text-ylo-ink transition-transform group-hover:translate-x-1">
            {"\u2192"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default Catalogo;