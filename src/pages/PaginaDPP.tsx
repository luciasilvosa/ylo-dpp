import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { lotes, visualLotes, type DPP } from "../data/lotes";
import Header from "../components/Header";
import Footer from "../components/Footer";

function PaginaDPP() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const index = Number(tokenId);
  const lote = lotes[index];
  const visual = visualLotes[index];

  if (!lote || !visual) {
    return (
      <div className="min-h-screen bg-ylo-bg flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="text-center">
            <p className="text-2xl font-semibold text-ylo-ink">
              Pasaporte no encontrado
            </p>
            <p className="mt-3 text-ylo-ink-soft">
              El identificador solicitado no corresponde a ningún DPP publicado.
            </p>
            <Link
              to="/catalogo"
              className="inline-block mt-8 bg-ylo-ink text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-ylo-ink-soft transition-colors"
            >
              Volver al catálogo
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const otrosLotes = lotes
    .map((l, i) => ({ ...l, idx: i }))
    .filter((l) => l.modelId === lote.modelId && l.idx !== index);

  const todasHuellasModelo = lotes
    .filter((l) => l.modelId === lote.modelId)
    .map((l) => l.carbonFootprint.value);
  const huellaMin = Math.min(...todasHuellasModelo);
  const huellaMax = Math.max(...todasHuellasModelo);
  const esElMasLimpio =
    todasHuellasModelo.length > 1 && lote.carbonFootprint.value === huellaMin;
  const esElMasContaminante =
    todasHuellasModelo.length > 1 && lote.carbonFootprint.value === huellaMax;
const tieneHistoria = !!lote.lifecycleEvents && lote.lifecycleEvents.length > 0;

  return (
    <div className="min-h-screen bg-ylo-bg flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero lote={lote} visual={visual} index={index} />
        <NavAnclas tieneHistoria={tieneHistoria} />

        <SeccionMateriales lote={lote} />
        <SeccionRecorrido lote={lote} />
        <SeccionHuella
          lote={lote}
          esElMasLimpio={esElMasLimpio}
          esElMasContaminante={esElMasContaminante}
          huellaMin={huellaMin}
          huellaMax={huellaMax}
        />
        <SeccionCuidado lote={lote} />
        {tieneHistoria && <SeccionHistoria lote={lote} />}

        {otrosLotes.length > 0 && (
          <OtrasTiradas lote={lote} otrosLotes={otrosLotes} />
        )}

        <CTAAuditor index={index} />
      </main>

      <Footer />
    </div>
  );
}

function Hero({
  lote,
  visual,
  index,
}: {
  lote: DPP;
  visual: typeof visualLotes[0];
  index: number;
}) {
  const imagenes = [
    visual.imagenes.front,
    visual.imagenes.back,
    visual.imagenes.hanger,
  ];
  const [activa, setActiva] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-8 pb-16">
      <div className="mb-6">
        <Link
          to="/catalogo"
          className="text-sm text-ylo-ink-soft hover:text-ylo-ink transition-colors"
        >
          ← Volver al catálogo
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-ylo-surface">
            <img
              src={imagenes[activa]}
              alt={`${lote.productName} ${visual.colorName}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ylo-surface/95 backdrop-blur-sm border border-ylo-border">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: visual.color }}
              ></span>
              <p className="text-xs font-medium text-ylo-ink">
                {visual.colorName}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {imagenes.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiva(i)}
                className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 transition-colors ${
                  activa === i
                    ? "border-ylo-ink"
                    : "border-ylo-border hover:border-ylo-ink-soft"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-3">
            {lote.category}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tightest text-ylo-ink leading-[1.05]">
            {lote.productName}
          </h1>
          <p className="mt-2 text-lg text-ylo-ink-soft">{visual.colorName}</p>

          <p className="mt-6 text-base text-ylo-ink-soft leading-relaxed">
            Pasaporte Digital de Producto del lote producido en{" "}
            <span className="text-ylo-ink font-medium">
              {lote.production.facility.city},{" "}
              {lote.production.facility.country}
            </span>{" "}
            el {formatearFechaLarga(lote.production.productionDate)}.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <DatoClave etiqueta="Lote" valor={lote.batchId} mono />
            <DatoClave
              etiqueta="Fábrica"
              valor={lote.production.facility.name}
            />
            <DatoClave
              etiqueta="Volumen"
              valor={`${lote.production.volume} ud.`}
            />
            <DatoClave
              etiqueta="Huella"
              valor={`${lote.carbonFootprint.value} kgCO₂e`}
            />
          </div>

          <div className="mt-8 p-5 bg-ylo-surface border border-ylo-border rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-ylo-pool flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-ylo-ink">
                  Verificado en blockchain
                </p>
                <p className="text-xs text-ylo-ink-soft">
                  Polygon · Soulbound Token v{lote.version}
                </p>
              </div>
            </div>
            <Link
              to={`/audit/${index}`}
              className="text-sm font-medium text-ylo-pool-dark hover:text-ylo-ink transition-colors inline-flex items-center gap-1"
            >
              Ver verificación técnica
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DatoClave({
  etiqueta,
  valor,
  mono = false,
}: {
  etiqueta: string;
  valor: string;
  mono?: boolean;
}) {
  return (
    <div className="border-t border-ylo-border pt-3">
      <p className="text-[10px] uppercase tracking-widest text-ylo-ink-soft mb-1">
        {etiqueta}
      </p>
      <p
        className={`text-sm text-ylo-ink ${
          mono ? "font-mono text-[11px] break-all" : "font-medium"
        }`}
      >
        {valor}
      </p>
    </div>
  );
}

function NavAnclas({ tieneHistoria }: { tieneHistoria: boolean }) {
  const items = [
    { id: "materiales", label: "Materiales" },
    { id: "recorrido", label: "Recorrido" },
    { id: "huella", label: "Huella" },
    { id: "cuidados", label: "Cuidados" },
    ...(tieneHistoria ? [{ id: "historia", label: "Historia" }] : []),
  ];

  return (
    <div className="sticky top-[72px] z-[5] bg-ylo-bg/90 backdrop-blur-md border-y border-ylo-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <nav className="flex gap-1 overflow-x-auto">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm text-ylo-ink-soft hover:text-ylo-ink transition-colors py-4 px-4 whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

function SeccionMateriales({ lote }: { lote: DPP }) {
  return (
    <SeccionWrap id="materiales" titulo="De qué está hecha">
      <p className="text-lg text-ylo-ink-soft leading-relaxed max-w-2xl mb-12">
        Cada material elegido tiene un porqué. Composición exacta y origen de
        cada fibra.
      </p>
      <div className="space-y-6 max-w-3xl">
        {lote.materials.map((m) => (
          <div key={m.fiber}>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-lg font-medium text-ylo-ink">{m.fiber}</p>
              <p className="text-2xl font-bold text-ylo-ink tabular-nums">
                {m.percentage}%
              </p>
            </div>
            <div className="h-1.5 bg-ylo-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-ylo-pool-dark rounded-full"
                style={{ width: `${m.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-ylo-ink-soft mt-2">
              Origen: {m.origin}
            </p>
          </div>
        ))}
      </div>
    </SeccionWrap>
  );
}

function SeccionRecorrido({ lote }: { lote: DPP }) {
  return (
    <SeccionWrap id="recorrido" titulo="El recorrido de esta prenda" surface>
      <p className="text-lg text-ylo-ink-soft leading-relaxed max-w-2xl mb-12">
        Desde la fibra hasta tu armario, esta prenda ha pasado por{" "}
        <span className="text-ylo-ink font-medium">
          {lote.suppliers.length} eslabones documentados
        </span>
        .
      </p>

      <div className="relative max-w-3xl">
        {lote.suppliers.map((s, i) => (
          <div key={i} className="flex gap-6 pb-10 last:pb-0 relative">
            {i < lote.suppliers.length - 1 && (
              <div className="absolute left-[19px] top-12 w-px bg-ylo-border h-[calc(100%-32px)]"></div>
            )}

            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ylo-pool flex items-center justify-center text-white text-sm font-mono z-10">
              {String(i + 1).padStart(2, "0")}
            </div>

            <div className="flex-1 pt-1">
              <p className="text-xs uppercase tracking-widest text-ylo-ink-soft">
                {s.role}
              </p>
              <p className="text-lg font-semibold text-ylo-ink mt-1">
                {s.name}
              </p>
              <p className="text-sm text-ylo-ink-soft mt-1">
                {s.city}, {s.country}
              </p>
              {s.certifications.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.certifications.map((c) => (
                    <span
                      key={c}
                      className="text-xs px-3 py-1 rounded-full bg-ylo-bg border border-ylo-border text-ylo-ink"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {lote.certifications.length > 0 && (
        <div className="mt-16 pt-12 border-t border-ylo-border">
          <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-6">
            Certificaciones del lote
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {lote.certifications.map((c) => (
              <div
                key={c.name}
                className="flex items-start gap-4 p-5 bg-ylo-bg rounded-2xl border border-ylo-border"
              >
                <div className="w-10 h-10 rounded-full bg-ylo-pool flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-ylo-ink">
                    {c.name}
                  </p>
                  <p className="text-xs text-ylo-ink-soft mt-1">{c.issuer}</p>
                  <p className="text-xs text-ylo-ink-soft mt-2">
                    Válida hasta {c.validUntil}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SeccionWrap>
  );
}

function SeccionHuella({
  lote,
  esElMasLimpio,
  esElMasContaminante,
  huellaMin,
  huellaMax,
}: {
  lote: DPP;
  esElMasLimpio: boolean;
  esElMasContaminante: boolean;
  huellaMin: number;
  huellaMax: number;
}) {
  const kmCoche = Math.round(lote.carbonFootprint.value * 5);

  return (
    <SeccionWrap id="huella" titulo="Su huella en el planeta">
      <p className="text-lg text-ylo-ink-soft leading-relaxed max-w-2xl mb-12">
        Emisiones de CO₂ asociadas a la fabricación de esta prenda, desde la
        materia prima hasta la salida de fábrica.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start max-w-5xl">
        <div>
          <p className="text-7xl sm:text-8xl font-bold text-ylo-ink tabular-nums leading-none tracking-tightest">
            {lote.carbonFootprint.value}
          </p>
          <p className="text-base text-ylo-ink-soft mt-3">
            kgCO₂e por unidad
          </p>

          {(esElMasLimpio || esElMasContaminante) && (
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ylo-surface border border-ylo-border">
              <span
                className={`w-2 h-2 rounded-full ${
                  esElMasLimpio ? "bg-ylo-pool" : "bg-ylo-poppy"
                }`}
              ></span>
              <p className="text-xs text-ylo-ink">
                {esElMasLimpio
                  ? "Tirada con menor huella del modelo"
                  : "Tirada con mayor huella del modelo"}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="pb-5 border-b border-ylo-border">
            <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-2">
              Para hacerte una idea
            </p>
            <p className="text-base text-ylo-ink leading-relaxed">
              Equivale a recorrer{" "}
              <span className="font-semibold">{kmCoche} km</span> en un coche
              de combustión media.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-2">
              Metodología
            </p>
            <p className="text-sm text-ylo-ink-soft leading-relaxed">
              {lote.carbonFootprint.methodology} · alcance{" "}
              {lote.carbonFootprint.scope}.{" "}
              {lote.carbonFootprint.certified
                ? "Verificada por tercero independiente."
                : "Autodeclaración del operador económico."}
            </p>
          </div>

          {(esElMasLimpio || esElMasContaminante) && (
            <div>
              <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-2">
                Rango del modelo
              </p>
              <p className="text-sm text-ylo-ink-soft leading-relaxed">
                Las distintas tiradas oscilan entre {huellaMin} y {huellaMax}{" "}
                kgCO₂e según fábrica y mix energético local.
              </p>
            </div>
          )}
        </div>
      </div>
    </SeccionWrap>
  );
}

function SeccionCuidado({ lote }: { lote: DPP }) {
  const consejos = [
    { titulo: "Lavado", texto: lote.careInstructions.washing },
    { titulo: "Secado", texto: lote.careInstructions.drying },
    { titulo: "Planchado", texto: lote.careInstructions.ironing },
    { titulo: "Reparación", texto: lote.careInstructions.repairTips },
  ];

  return (
    <SeccionWrap id="cuidados" titulo="Cuidarla para que dure" surface>
      <p className="text-lg text-ylo-ink-soft leading-relaxed max-w-2xl mb-12">
        Una prenda dura más cuando se cuida bien. Y cuando ya no la quieras,
        puede empezar de nuevo.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-4xl">
        {consejos.map((c, i) => (
          <div
            key={i}
            className="bg-ylo-bg rounded-2xl p-5 border border-ylo-border"
          >
            <p className="text-xs uppercase tracking-widest text-ylo-pool-dark mb-2">
              {c.titulo}
            </p>
            <p className="text-sm text-ylo-ink leading-relaxed">{c.texto}</p>
          </div>
        ))}
      </div>

      <div className="bg-ylo-ink rounded-3xl p-8 sm:p-10 text-white max-w-4xl">
        <p className="text-xs uppercase tracking-widest text-white/60 mb-3">
          Cuando termine su vida útil
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
          {lote.endOfLife.recyclable
            ? "Esta prenda es reciclable"
            : "Esta prenda no es reciclable"}
        </h3>
        <p className="text-base text-white/80 leading-relaxed mb-4">
          {lote.endOfLife.recyclingInstructions}
        </p>
        <p className="text-sm text-white/60 leading-relaxed">
          {lote.endOfLife.disassembly}
        </p>
      </div>
    </SeccionWrap>
  );
}

function OtrasTiradas({
  lote,
  otrosLotes,
}: {
  lote: DPP;
  otrosLotes: (DPP & { idx: number })[];
}) {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
      <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-3">
        Otras tiradas
      </p>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tightest text-ylo-ink mb-3">
        El modelo {lote.modelId} en otros lotes
      </h2>
      <p className="text-base text-ylo-ink-soft leading-relaxed max-w-2xl mb-10">
        El mismo modelo se produce en distintas fábricas a lo largo del año.
        Cada tirada tiene su propio pasaporte.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
        {otrosLotes.map((l) => {
          const v = visualLotes[l.idx];
          return (
            <Link
              key={l.batchId}
              to={`/dpp/${l.idx}`}
              className="group flex items-stretch bg-ylo-surface rounded-2xl border border-ylo-border hover:border-ylo-ink transition-colors overflow-hidden"
            >
              <div className="w-28 flex-shrink-0 relative overflow-hidden">
                <img
                  src={v?.imagenes.front}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-5">
                <p className="font-mono text-[11px] text-ylo-ink-soft truncate">
                  {l.batchId}
                </p>
                <p className="text-sm font-medium text-ylo-ink mt-2">
                  {l.production.facility.city},{" "}
                  {l.production.facility.country}
                </p>
                <p className="text-xs text-ylo-ink-soft mt-1">
                  Huella · {l.carbonFootprint.value} kgCO₂e
                </p>
                <p className="text-xs font-medium text-ylo-ink mt-3 group-hover:underline underline-offset-4">
                  Ver pasaporte →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function CTAAuditor({ index }: { index: number }) {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-24">
      <div className="bg-ylo-surface border border-ylo-border rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-ylo-ink flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-1">
              Para auditores
            </p>
            <p className="text-base font-semibold text-ylo-ink">
              Verificar la integridad de este pasaporte
            </p>
            <p className="text-sm text-ylo-ink-soft mt-1">
              Acceso al hash on-chain, CID de IPFS y enlace a Polygonscan.
            </p>
          </div>
        </div>
        <Link
          to={`/audit/${index}`}
          className="bg-ylo-ink text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-ylo-ink-soft transition-colors whitespace-nowrap"
        >
          Verificación técnica
        </Link>
      </div>
    </section>
  );
}
function SeccionHistoria({ lote }: { lote: DPP }) {
  const eventos = lote.lifecycleEvents || [];

  return (
    <SeccionWrap id="historia" titulo="Historia de esta prenda">
      <p className="text-lg text-ylo-ink-soft leading-relaxed max-w-2xl mb-12">
        Eventos posteriores a la fabricación registrados sobre este lote a lo
        largo del ciclo de vida.
      </p>

      <div className="relative max-w-3xl">
        {eventos.map((ev, i) => (
          <div key={i} className="flex gap-6 pb-10 last:pb-0 relative">
            {i < eventos.length - 1 && (
              <div className="absolute left-[19px] top-12 w-px bg-ylo-border h-[calc(100%-32px)]"></div>
            )}

            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ylo-pool flex items-center justify-center text-white text-sm font-mono z-10">
              {String(i + 1).padStart(2, "0")}
            </div>

            <div className="flex-1 pt-1">
              <p className="text-xs uppercase tracking-widest text-ylo-ink-soft">
                {ev.eventType === "repair" ? "Reparación" : ev.eventType}
              </p>
              <p className="text-lg font-semibold text-ylo-ink mt-1">
                {ev.location}
              </p>
              <p className="text-sm text-ylo-ink-soft mt-1">
                {formatearFechaLarga(ev.date)}
              </p>
              <p className="text-sm text-ylo-ink mt-3 leading-relaxed">
                {ev.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SeccionWrap>
  );
}
function SeccionWrap({
  id,
  titulo,
  surface = false,
  children,
}: {
  id: string;
  titulo: string;
  surface?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={surface ? "bg-ylo-surface" : "bg-ylo-bg"}
      style={{ scrollMarginTop: "140px" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tightest text-ylo-ink mb-8">
          {titulo}
        </h2>
        {children}
      </div>
    </section>
  );
}

function formatearFechaLarga(fechaISO: string): string {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const [year, month, day] = fechaISO.split("-");
  return `${Number(day)} de ${meses[Number(month) - 1]} de ${year}`;
}

export default PaginaDPP;
