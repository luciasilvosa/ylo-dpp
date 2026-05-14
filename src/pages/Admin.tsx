import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { lotes, visualLotes } from "../data/lotes";
import { calcularHashSHA256, canonicalizarJSON } from "../lib/dpp";
import { subirJSONaPinata } from "../lib/pinata";
import { IPFS_GATEWAY } from "../lib/config";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LS_PREFIX = "ylo:cid:";

const NUEVO_LOTE_VACIO = {
  modelId: "", batchId: "", productName: "", category: "",
  productionDate: "", volume: "", productionMethod: "",
  facilityId: "", facilityName: "", facilityCity: "", facilityCountry: "",
  carbonValue: "", carbonUnit: "kg CO2e", carbonMethodology: "", carbonScope: "",
  washing: "", drying: "", ironing: "", repairTips: "",
  recyclable: "true", recyclingInstructions: "", disassembly: "",
  schema: "ylo-dpp/v1", version: "1", language: "ES",
};

function Admin() {
  const [seleccionado, setSeleccionado] = useState(0);
  const [hash, setHash] = useState<string | null>(null);
  const [cid, setCid] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonAbierto, setJsonAbierto] = useState(false);
  const [nuevoLoteAbierto, setNuevoLoteAbierto] = useState(false);
  const [nuevoLote, setNuevoLote] = useState(NUEVO_LOTE_VACIO);

  const lote = lotes[seleccionado];
  const visual = visualLotes[seleccionado];

  useEffect(() => {
    if (!lote) return;
    let cancelado = false;
    setError(null);
    setHash(null);
    calcularHashSHA256(lote).then((h) => {
      if (cancelado) return;
      setHash(h);
      setCid(localStorage.getItem(LS_PREFIX + lote.batchId));
    });
    return () => { cancelado = true; };
  }, [seleccionado, lote]);

  async function handlePublicar() {
    setSubiendo(true);
    setError(null);
    try {
      const r = await subirJSONaPinata(lote, lote.batchId);
      localStorage.setItem(LS_PREFIX + lote.batchId, r.cid);
      setCid(r.cid);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ha ocurrido un error al publicar");
    } finally {
      setSubiendo(false);
    }
  }

  function actualizarNuevoLote(campo: string, valor: string) {
    setNuevoLote({ ...nuevoLote, [campo]: valor });
  }

  function cancelarNuevoLote() {
    setNuevoLote(NUEVO_LOTE_VACIO);
    setNuevoLoteAbierto(false);
  }

  const jsonCanonical = canonicalizarJSON(lote);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const urlConsumidor = `${baseUrl}/dpp/${seleccionado}`;
  const urlVerificacion = `https://amoy.polygonscan.com/token/0xa1b2c3d4e5f6789012345678901234567890abcd?a=${seleccionado}`;

  return (
    <div className="min-h-screen bg-ylo-bg flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 py-12 w-full">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-ylo-ink">Panel del operador</h1>
          <p className="mt-4 text-base text-ylo-ink-soft max-w-2xl leading-relaxed">Gestiona los pasaportes digitales de tus productos. Visualiza los datos de cada lote, publica el pasaporte cuando esté listo y descarga los códigos QR para etiquetar la prenda.</p>
        </div>

        <div className="mb-10 bg-ylo-surface border border-ylo-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-ylo-ink text-white flex items-center justify-center text-sm font-semibold">Y</div>
            <div>
              <p className="text-sm font-semibold text-ylo-ink">YLÖ Moda Activa Sostenible S.L.</p>
              <p className="text-xs text-ylo-ink-soft">Sesión iniciada como operador</p>
            </div>
          </div>
          <span className="inline-flex w-fit text-[10px] uppercase tracking-widest text-ylo-pool-dark border border-ylo-pool px-3 py-1 rounded-full">Activa</span>
        </div>

        <div className="flex items-baseline justify-between mb-4">
          <p className="text-xs uppercase tracking-widest text-ylo-ink-soft">Mis lotes</p>
          <p className="text-xs text-ylo-ink-soft">{lotes.length} lotes en el catálogo</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {lotes.map((l, i) => {
            const v = visualLotes[i];
            const esSeleccionado = i === seleccionado && !nuevoLoteAbierto;
            const cidGuardado = typeof window !== "undefined" ? localStorage.getItem(LS_PREFIX + l.batchId) : null;
            return (
              <button key={l.batchId} onClick={() => { setSeleccionado(i); setNuevoLoteAbierto(false); }} className={`text-left bg-ylo-surface border-2 rounded-2xl p-5 transition-colors ${esSeleccionado ? "border-ylo-ink" : "border-ylo-border hover:border-ylo-ink-soft"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.color }} />
                  <p className="text-[10px] uppercase tracking-widest text-ylo-ink-soft">{v.colorName}</p>
                </div>
                <p className="text-sm font-semibold text-ylo-ink">{l.productName}</p>
                <p className="font-mono text-[11px] text-ylo-ink-soft mt-2 break-all">{l.batchId}</p>
                <p className="mt-3 text-xs">{cidGuardado ? <span className="text-ylo-pool-dark">Pasaporte publicado</span> : <span className="text-ylo-ink-soft">Sin publicar</span>}</p>
              </button>
            );
          })}
          <button type="button" onClick={() => setNuevoLoteAbierto(true)} className={`text-left bg-ylo-bg border-2 border-dashed rounded-2xl p-5 flex flex-col cursor-pointer transition-colors ${nuevoLoteAbierto ? "border-ylo-ink" : "border-ylo-border hover:border-ylo-ink-soft"}`}>
            <p className="text-2xl font-light text-ylo-ink-soft mb-2">+</p>
            <p className="text-sm font-semibold text-ylo-ink">Añadir nuevo lote</p>
            <p className="text-xs text-ylo-ink-soft mt-2 leading-relaxed flex-1">Da de alta un lote y rellena los datos que compondrán su pasaporte digital.</p>
          </button>
        </div>

        {nuevoLoteAbierto && (
          <section className="bg-ylo-surface border border-ylo-border rounded-3xl p-8 mb-8">
            <div className="flex items-start justify-between mb-2 gap-4">
              <h2 className="text-2xl font-bold text-ylo-ink">Nuevo lote</h2>
              <button onClick={cancelarNuevoLote} className="text-sm font-medium text-ylo-ink-soft hover:text-ylo-ink whitespace-nowrap">Cerrar</button>
            </div>
            <p className="text-sm text-ylo-ink-soft mt-3 mb-10 max-w-3xl leading-relaxed">Rellena los datos del lote. Esta información compondrá el pasaporte digital del producto y será lo que vea el consumidor al escanear el código QR.</p>

            <div className="space-y-8">
              <Bloque titulo="1. Identificación del producto">
                <InputCampo etiqueta="Identificador del modelo" valor={nuevoLote.modelId} onChange={(v) => actualizarNuevoLote("modelId", v)} placeholder="YLO-TOP-001" />
                <InputCampo etiqueta="Identificador del lote" valor={nuevoLote.batchId} onChange={(v) => actualizarNuevoLote("batchId", v)} placeholder="YLO-TOP-001-L-2025-XX-YY" />
                <InputCampo etiqueta="Nombre del producto" valor={nuevoLote.productName} onChange={(v) => actualizarNuevoLote("productName", v)} placeholder="Top Aurora" />
                <InputCampo etiqueta="Categoría" valor={nuevoLote.category} onChange={(v) => actualizarNuevoLote("category", v)} placeholder="Camiseta técnica" />
              </Bloque>
              <Bloque titulo="2. Composición material">
                <div className="col-span-full bg-ylo-bg border border-dashed border-ylo-border rounded-lg p-4 text-xs text-ylo-ink-soft leading-relaxed">Las fibras se añaden una a una indicando tipo, origen y porcentaje. La suma debe ser 100.</div>
              </Bloque>
              <Bloque titulo="3. Producción">
                <InputCampo etiqueta="Fecha de producción" valor={nuevoLote.productionDate} onChange={(v) => actualizarNuevoLote("productionDate", v)} placeholder="2025-09" />
                <InputCampo etiqueta="Volumen (unidades)" valor={nuevoLote.volume} onChange={(v) => actualizarNuevoLote("volume", v)} placeholder="800" />
                <InputCampo etiqueta="Método de producción" valor={nuevoLote.productionMethod} onChange={(v) => actualizarNuevoLote("productionMethod", v)} placeholder="Confección estándar" />
                <InputCampo etiqueta="Centro · ID" valor={nuevoLote.facilityId} onChange={(v) => actualizarNuevoLote("facilityId", v)} placeholder="FAC-MA-01" />
                <InputCampo etiqueta="Centro · Nombre" valor={nuevoLote.facilityName} onChange={(v) => actualizarNuevoLote("facilityName", v)} placeholder="Atlas Confección" />
                <InputCampo etiqueta="Centro · Ciudad" valor={nuevoLote.facilityCity} onChange={(v) => actualizarNuevoLote("facilityCity", v)} placeholder="Tánger" />
                <InputCampo etiqueta="Centro · País" valor={nuevoLote.facilityCountry} onChange={(v) => actualizarNuevoLote("facilityCountry", v)} placeholder="MA" />
              </Bloque>
              <Bloque titulo="4. Cadena de proveedores">
                <div className="col-span-full bg-ylo-bg border border-dashed border-ylo-border rounded-lg p-4 text-xs text-ylo-ink-soft leading-relaxed">Cada eslabón se añade indicando rol (hilatura, tejeduría, tintorería, confección), nombre, ciudad, país y certificaciones aplicables.</div>
              </Bloque>
              <Bloque titulo="5. Huella de carbono">
                <InputCampo etiqueta="Valor" valor={nuevoLote.carbonValue} onChange={(v) => actualizarNuevoLote("carbonValue", v)} placeholder="6.8" />
                <InputCampo etiqueta="Unidad" valor={nuevoLote.carbonUnit} onChange={(v) => actualizarNuevoLote("carbonUnit", v)} />
                <InputCampo etiqueta="Metodología" valor={nuevoLote.carbonMethodology} onChange={(v) => actualizarNuevoLote("carbonMethodology", v)} placeholder="PEF v3.1" />
                <InputCampo etiqueta="Alcance" valor={nuevoLote.carbonScope} onChange={(v) => actualizarNuevoLote("carbonScope", v)} placeholder="cradle-to-gate" />
              </Bloque>
              <Bloque titulo="6. Certificaciones del lote">
                <div className="col-span-full bg-ylo-bg border border-dashed border-ylo-border rounded-lg p-4 text-xs text-ylo-ink-soft leading-relaxed">Cada certificación se añade indicando nombre, emisor, fecha de validez y estado.</div>
              </Bloque>
              <Bloque titulo="7. Instrucciones de cuidado">
                <InputCampo etiqueta="Lavado" valor={nuevoLote.washing} onChange={(v) => actualizarNuevoLote("washing", v)} ancho placeholder="Lavar a 30°C" />
                <InputCampo etiqueta="Secado" valor={nuevoLote.drying} onChange={(v) => actualizarNuevoLote("drying", v)} ancho placeholder="Secar al aire" />
                <InputCampo etiqueta="Planchado" valor={nuevoLote.ironing} onChange={(v) => actualizarNuevoLote("ironing", v)} ancho placeholder="No planchar" />
                <InputCampo etiqueta="Consejos de reparación" valor={nuevoLote.repairTips} onChange={(v) => actualizarNuevoLote("repairTips", v)} ancho placeholder="Reparación en taller local recomendada" />
              </Bloque>
              <Bloque titulo="8. Fin de vida">
                <InputCampo etiqueta="¿Reciclable?" valor={nuevoLote.recyclable} onChange={(v) => actualizarNuevoLote("recyclable", v)} placeholder="true / false" />
                <InputCampo etiqueta="Instrucciones de reciclaje" valor={nuevoLote.recyclingInstructions} onChange={(v) => actualizarNuevoLote("recyclingInstructions", v)} ancho placeholder="Depositar en contenedor textil" />
                <InputCampo etiqueta="Desmontaje" valor={nuevoLote.disassembly} onChange={(v) => actualizarNuevoLote("disassembly", v)} ancho placeholder="Costuras simples, desmontaje manual" />
              </Bloque>
              <Bloque titulo="9. Metadatos">
                <InputCampo etiqueta="Esquema" valor={nuevoLote.schema} onChange={(v) => actualizarNuevoLote("schema", v)} mono ancho />
                <InputCampo etiqueta="Versión" valor={nuevoLote.version} onChange={(v) => actualizarNuevoLote("version", v)} mono />
                <InputCampo etiqueta="Idioma" valor={nuevoLote.language} onChange={(v) => actualizarNuevoLote("language", v)} mono />
              </Bloque>
            </div>

            <div className="mt-10 pt-6 border-t border-ylo-border flex flex-wrap items-center justify-end gap-3">
              <button onClick={cancelarNuevoLote} className="text-sm font-medium text-ylo-ink-soft hover:text-ylo-ink">Cancelar</button>
              <button disabled className="bg-ylo-ink text-white px-6 py-3 rounded-full text-sm font-medium opacity-40 cursor-not-allowed">Guardar lote</button>
            </div>
          </section>
        )}

        {!nuevoLoteAbierto && (
          <section className="bg-ylo-surface border border-ylo-border rounded-3xl p-8 mb-8">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs uppercase tracking-widest text-ylo-ink-soft">Lote seleccionado</p>
              <span className="inline-block w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: visual.color }} />
            </div>
            <h2 className="text-2xl font-bold text-ylo-ink">{lote.productName} · {visual.colorName}</h2>
            <p className="text-sm text-ylo-ink-soft mt-3 mb-10 max-w-3xl leading-relaxed">Información que compone el pasaporte digital del lote. Estos son los datos que verá el consumidor al escanear el código QR.</p>
            <div className="space-y-8">
              <Bloque titulo="1. Identificación del producto">
                <Campo etiqueta="Identificador del modelo" valor={lote.modelId} mono />
                <Campo etiqueta="Identificador del lote" valor={lote.batchId} mono />
                <Campo etiqueta="Nombre del producto" valor={lote.productName} />
                <Campo etiqueta="Categoría" valor={lote.category} />
              </Bloque>
              <Bloque titulo="2. Composición material">
                <div className="col-span-full space-y-2">
                  {lote.materials.map((m, i) => (
                    <div key={i} className="flex items-center justify-between bg-ylo-bg border border-ylo-border rounded-lg px-4 py-2.5 text-sm">
                      <span className="text-ylo-ink font-medium">{m.fiber}</span>
                      <div className="flex items-center gap-4 text-ylo-ink-soft">
                        <span>Origen: {m.origin}</span>
                        <span className="font-mono text-ylo-ink">{m.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Bloque>
              <Bloque titulo="3. Producción">
                <Campo etiqueta="Fecha de producción" valor={lote.production.productionDate} />
                <Campo etiqueta="Volumen" valor={`${lote.production.volume} ud.`} />
                <Campo etiqueta="Método de producción" valor={lote.production.productionMethod} />
                <Campo etiqueta="Centro · ID" valor={lote.production.facility.facilityId} mono />
                <Campo etiqueta="Centro · Nombre" valor={lote.production.facility.name} />
                <Campo etiqueta="Centro · Ciudad" valor={lote.production.facility.city} />
                <Campo etiqueta="Centro · País" valor={lote.production.facility.country} />
              </Bloque>
              <Bloque titulo={`4. Cadena de proveedores (${lote.suppliers.length} eslabones)`}>
                <div className="col-span-full space-y-2">
                  {lote.suppliers.map((s, i) => (
                    <div key={i} className="bg-ylo-bg border border-ylo-border rounded-lg px-4 py-3 text-sm">
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="flex items-baseline gap-3">
                          <span className="font-mono text-[11px] text-ylo-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                          <span className="text-xs uppercase tracking-widest text-ylo-pool-dark">{s.role}</span>
                        </div>
                        <span className="text-ylo-ink-soft text-xs">{s.city}, {s.country}</span>
                      </div>
                      <p className="text-ylo-ink font-medium">{s.name}</p>
                      {s.certifications.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {s.certifications.map((c) => (
                            <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-ylo-surface border border-ylo-border text-ylo-ink">{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Bloque>
              <Bloque titulo="5. Huella de carbono">
                <Campo etiqueta="Valor" valor={String(lote.carbonFootprint.value)} />
                <Campo etiqueta="Unidad" valor={lote.carbonFootprint.unit} />
                <Campo etiqueta="Metodología" valor={lote.carbonFootprint.methodology} />
                <Campo etiqueta="Alcance" valor={lote.carbonFootprint.scope} />
                <Campo etiqueta="Certificada" valor={lote.carbonFootprint.certified ? "Sí" : "No"} />
              </Bloque>
              <Bloque titulo={`6. Certificaciones del lote (${lote.certifications.length})`}>
                <div className="col-span-full space-y-2">
                  {lote.certifications.map((c, i) => (
                    <div key={i} className="bg-ylo-bg border border-ylo-border rounded-lg px-4 py-3 text-sm">
                      <div className="flex items-baseline justify-between">
                        <span className="text-ylo-ink font-medium">{c.name}</span>
                        <span className="text-xs text-ylo-ink-soft">Válida hasta {c.validUntil}</span>
                      </div>
                      <p className="text-xs text-ylo-ink-soft mt-1">Emisor: {c.issuer} · {c.certified ? "Certificada" : "Pendiente"}</p>
                    </div>
                  ))}
                </div>
              </Bloque>
              <Bloque titulo="7. Instrucciones de cuidado">
                <Campo etiqueta="Lavado" valor={lote.careInstructions.washing} ancho />
                <Campo etiqueta="Secado" valor={lote.careInstructions.drying} ancho />
                <Campo etiqueta="Planchado" valor={lote.careInstructions.ironing} ancho />
                <Campo etiqueta="Consejos de reparación" valor={lote.careInstructions.repairTips} ancho />
              </Bloque>
              <Bloque titulo="8. Fin de vida">
                <Campo etiqueta="¿Reciclable?" valor={lote.endOfLife.recyclable ? "Sí" : "No"} />
                <Campo etiqueta="Instrucciones de reciclaje" valor={lote.endOfLife.recyclingInstructions} ancho />
                <Campo etiqueta="Desmontaje" valor={lote.endOfLife.disassembly} ancho />
              </Bloque>
              <Bloque titulo="9. Metadatos">
                <Campo etiqueta="Esquema" valor={lote.schema} mono ancho />
                <Campo etiqueta="Versión" valor={String(lote.version)} mono />
                <Campo etiqueta="Idioma" valor={lote.language} mono />
              </Bloque>
            </div>
          </section>
        )}

        {!nuevoLoteAbierto && (
          <section className="bg-ylo-surface border border-ylo-border rounded-3xl p-8 mb-8">
            <h3 className="text-lg font-semibold text-ylo-ink mb-1">Código de verificación del pasaporte</h3>
            <p className="text-sm text-ylo-ink-soft mb-5 max-w-2xl">Identificador único asociado a estos datos. Cualquier auditor o verificador externo puede usarlo para comprobar que el pasaporte no ha sido alterado.</p>
            <div className="bg-ylo-bg border border-ylo-border rounded-xl p-4 font-mono text-xs text-ylo-ink break-all">{hash ?? "Calculando..."}</div>
          </section>
        )}

        {!nuevoLoteAbierto && (
          <section className="bg-ylo-surface border border-ylo-border rounded-3xl p-8 mb-8">
            <h3 className="text-lg font-semibold text-ylo-ink mb-1">Publicación del pasaporte</h3>
            <p className="text-sm text-ylo-ink-soft mb-5 max-w-2xl">Publica el pasaporte digital del lote. Una vez publicado, podrás descargar los códigos QR para etiquetar la prenda.</p>
            {cid ? (
              <div className="space-y-4">
                <div className="bg-ylo-bg border border-ylo-border rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-widest text-ylo-ink-soft mb-1">Identificador del pasaporte publicado</p>
                  <p className="font-mono text-xs text-ylo-ink break-all">{cid}</p>
                </div>
                <div className="flex flex-wrap items-center gap-5">
                  <a href={`${IPFS_GATEWAY}${cid}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-ylo-pool-dark hover:text-ylo-ink underline underline-offset-4">Ver pasaporte publicado</a>
                  <button onClick={handlePublicar} disabled={subiendo} className="text-sm text-ylo-ink-soft hover:text-ylo-ink">{subiendo ? "Volviendo a publicar..." : "Volver a publicar"}</button>
                </div>
              </div>
            ) : (
              <button onClick={handlePublicar} disabled={subiendo} className="bg-ylo-ink text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-50">{subiendo ? "Publicando..." : "Publicar pasaporte"}</button>
            )}
            {error && <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">{error}</div>}
          </section>
        )}

        {!nuevoLoteAbierto && (
          <section className="bg-ylo-surface border border-ylo-border rounded-3xl p-8 mb-8">
            <button onClick={() => setJsonAbierto(!jsonAbierto)} className="w-full text-left flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-ylo-ink">Detalles técnicos del pasaporte</h3>
                <p className="text-xs text-ylo-ink-soft mt-1">Vista en bruto de los datos publicados ({jsonCanonical.length} bytes)</p>
              </div>
              <span className="text-sm text-ylo-ink-soft ml-4 flex-shrink-0">{jsonAbierto ? "Ocultar" : "Mostrar"}</span>
            </button>
            {jsonAbierto && <pre className="mt-5 bg-ylo-bg border border-ylo-border rounded-xl p-4 font-mono text-[11px] text-ylo-ink overflow-x-auto whitespace-pre-wrap break-all">{jsonCanonical}</pre>}
          </section>
        )}

        {!nuevoLoteAbierto && cid && (
          <section className="bg-ylo-surface border border-ylo-border rounded-3xl p-8">
            <h3 className="text-lg font-semibold text-ylo-ink mb-1">Códigos QR para la etiqueta</h3>
            <p className="text-sm text-ylo-ink-soft mb-8 max-w-2xl">Imprime estos dos códigos en la etiqueta interior de la prenda. El primero lleva al consumidor a la información del producto. El segundo permite a auditores externos verificar la autenticidad del pasaporte sin pasar por nosotros.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <BloqueQR titulo="Para el consumidor" descripcion="Lleva a la información del producto." url={urlConsumidor} nombreArchivo={`qr-consumidor-${lote.batchId}`} />
              <BloqueQR titulo="Para verificación externa" descripcion="Permite comprobar la autenticidad del pasaporte." url={urlVerificacion} nombreArchivo={`qr-verificacion-${lote.batchId}`} />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Bloque(props: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-3 pb-2 border-b border-ylo-border">{props.titulo}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">{props.children}</div>
    </div>
  );
}

function Campo(props: { etiqueta: string; valor: string; mono?: boolean; ancho?: boolean }) {
  const mono = props.mono ?? false;
  const ancho = props.ancho ?? false;
  return (
    <div className={ancho ? "sm:col-span-2" : ""}>
      <p className="text-[10px] uppercase tracking-wider text-ylo-ink-soft mb-1">{props.etiqueta}</p>
      <p className={`text-sm text-ylo-ink ${mono ? "font-mono text-[12px] break-all" : ""}`}>{props.valor}</p>
    </div>
  );
}

function InputCampo(props: { etiqueta: string; valor: string; onChange: (v: string) => void; mono?: boolean; ancho?: boolean; placeholder?: string }) {
  const mono = props.mono ?? false;
  const ancho = props.ancho ?? false;
  return (
    <div className={ancho ? "sm:col-span-2" : ""}>
      <label className="block text-[10px] uppercase tracking-wider text-ylo-ink-soft mb-1">{props.etiqueta}</label>
      <input type="text" value={props.valor} onChange={(e) => props.onChange(e.target.value)} placeholder={props.placeholder} className={`w-full bg-ylo-bg border border-ylo-border rounded-lg px-3 py-2 text-sm text-ylo-ink focus:outline-none focus:border-ylo-ink ${mono ? "font-mono text-[12px]" : ""}`} />
    </div>
  );
}

function BloqueQR(props: { titulo: string; descripcion: string; url: string; nombreArchivo: string }) {
  function descargarSVG() {
    const svg = document.getElementById(`qr-${props.nombreArchivo}`);
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${props.nombreArchivo}.svg`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  return (
    <div className="bg-ylo-bg border border-ylo-border rounded-2xl p-6 flex flex-col items-center text-center">
      <p className="text-xs uppercase tracking-widest text-ylo-ink-soft">{props.titulo}</p>
      <p className="text-xs text-ylo-ink-soft mt-1 mb-5">{props.descripcion}</p>
      <div className="bg-white p-4 rounded-xl border border-ylo-border">
        <QRCodeSVG id={`qr-${props.nombreArchivo}`} value={props.url} size={170} level="M" includeMargin={false} />
      </div>
      <p className="mt-4 font-mono text-[10px] text-ylo-ink-soft break-all max-w-full">{props.url}</p>
      <button onClick={descargarSVG} className="mt-4 text-xs font-medium text-ylo-ink hover:underline">Descargar SVG</button>
    </div>
  );
}

export default Admin;
