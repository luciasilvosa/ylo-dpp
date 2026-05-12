import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { lotes, visualLotes } from "../data/lotes";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-ylo-bg flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Productos />
        <Stats />
        <Pilares />
        <CTAFinal />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative -mt-[73px] h-screen w-full overflow-hidden">
      <img
        src="/images/brand-stack.png"
        alt="Modelos YLO en movimiento"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-white/10"></div>

      <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
        <FadeUp>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-ylo-ink leading-[1] tracking-tight">
  Move. Train. Live.
</h1>
        </FadeUp>

        <FadeUp delay={1}>
          <p className="mt-8 text-base sm:text-lg text-ylo-ink-soft max-w-lg leading-relaxed">
            Tres prendas técnicas con historia verificable
          </p>
        </FadeUp>

        <FadeUp delay={2}>
          <Link
            to="/catalogo"
            className="mt-10 inline-block bg-ylo-ink text-white px-10 py-4 rounded-full text-sm font-medium hover:bg-ylo-ink-soft hover:scale-105 transition-all duration-300"
          >
            Ver colección
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

function Productos() {
  return (
    <section
      id="productos"
      className="border-t border-ylo-border max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-24"
    >
      <FadeUp>
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-3">
              La colección
            </p>
            <h2 className="text-5xl sm:text-7xl font-bold tracking-tightest text-ylo-ink leading-none">
              Edición limitada
            </h2>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {lotes.map((lote, index) => {
          const visual = visualLotes[index];
          return (
            <FadeUp key={lote.batchId} delay={(index % 3) + 1}>
              <TarjetaProducto
                tokenId={index}
                modelo={lote.productName}
                variante={visual.colorName}
                imagenFront={visual.imagenes.front}
                imagenBack={visual.imagenes.back}
                colorBadge={visual.color}
              />
            </FadeUp>
          );
        })}
      </div>
    </section>
  );
}

function TarjetaProducto(props: {
  tokenId: number;
  modelo: string;
  variante: string;
  imagenFront: string;
  imagenBack: string;
  colorBadge: string;
}) {
  return (
    <Link to={`/producto/${props.tokenId}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-ylo-surface aspect-[3/4]">
        <img
          src={props.imagenFront}
          alt={`${props.modelo} ${props.variante}`}
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 group-hover:opacity-0"
        />
        <img
          src={props.imagenBack}
          alt=""
          className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-ylo-border">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: props.colorBadge }}
          ></span>
          <p className="text-[10px] uppercase tracking-widest text-ylo-ink">
            {props.variante}
          </p>
        </div>
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="bg-ylo-ink text-white text-xs font-medium px-4 py-2.5 rounded-full text-center">
            Ver producto
          </div>
        </div>
      </div>
      <div className="mt-5">
        <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-1">
          {props.modelo}
        </p>
        <h3 className="text-lg font-semibold text-ylo-ink">
          {props.variante}
        </h3>
      </div>
    </Link>
  );
}

function Stats() {
  const datos = [
    { numero: 3, etiqueta: "Lotes producidos", sufijo: "" },
    { numero: 3, etiqueta: "Países documentados", sufijo: "" },
    { numero: 5, etiqueta: "Eslabones por prenda", sufijo: "" },
    { numero: 100, etiqueta: "Trazabilidad", sufijo: "%" },
  ];

  return (
    <section className="bg-ylo-ink text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <FadeUp>
          <p className="text-xs uppercase tracking-widest text-white/60 mb-3">
            La colección en datos
          </p>
          <h2 className="text-5xl sm:text-7xl font-bold tracking-tightest mb-14 max-w-2xl leading-[0.9]">
            Cada cifra está{" "}
            <span className="italic font-light text-ylo-pool">verificada</span>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {datos.map((d, i) => (
            <FadeUp key={i} delay={(i % 3) + 1}>
              <Stat numero={d.numero} etiqueta={d.etiqueta} sufijo={d.sufijo} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat(props: { numero: number; etiqueta: string; sufijo: string }) {
  const [valor, setValor] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 1200;
          const steps = 30;
          const increment = props.numero / steps;
          let current = 0;
          const timer = setInterval(() => {
            current = current + increment;
            if (current >= props.numero) {
              setValor(props.numero);
              clearInterval(timer);
            } else {
              setValor(Math.floor(current));
            }
          }, duration / steps);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [props.numero]);

  return (
    <div ref={ref}>
      <p className="text-6xl sm:text-8xl font-bold tracking-tightest tabular-nums leading-none">
        {valor}
        {props.sufijo}
      </p>
      <p className="text-xs uppercase tracking-widest text-white/60 mt-3">
        {props.etiqueta}
      </p>
    </div>
  );
}

function Pilares() {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
      <FadeUp>
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-widest text-ylo-ink-soft mb-4">
            Lo que nos define
          </p>
          <h2 className="text-5xl sm:text-7xl font-bold tracking-tightest text-ylo-ink leading-none">
            Cada decisión cuenta
          </h2>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <FadeUp delay={1}>
          <Pilar
            numero="01"
            acento="text-ylo-fuchsia"
            titulo="Materiales que importan"
            texto="Algodón orgánico certificado GOTS y poliéster reciclado certificado GRS. Sin atajos"
          />
        </FadeUp>
        <FadeUp delay={2}>
          <Pilar
            numero="02"
            acento="text-ylo-pool-dark"
            titulo="Producción transparente"
            texto="Conoce de dónde viene cada prenda. Cada lote documenta su origen, fábrica y huella"
          />
        </FadeUp>
        <FadeUp delay={3}>
          <Pilar
            numero="03"
            acento="text-ylo-poppy"
            titulo="Ciclo completo"
            texto="Diseñado para reparar, reutilizar y reciclar. Ropa que vuelve a empezar"
          />
        </FadeUp>
      </div>
    </section>
  );
}

function Pilar(props: {
  numero: string;
  acento: string;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="border-t-2 border-ylo-ink pt-6">
      <p
        className={`text-4xl font-bold tracking-tightest ${props.acento} mb-6`}
      >
        {props.numero}
      </p>
      <h3 className="text-xl font-semibold text-ylo-ink mb-3">
        {props.titulo}
      </h3>
      <p className="text-sm text-ylo-ink-soft leading-relaxed">
        {props.texto}
      </p>
    </div>
  );
}

function CTAFinal() {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-24 sm:pb-32">
      <FadeUp>
        <div className="bg-ylo-ink rounded-[2rem] px-8 sm:px-20 py-20 sm:py-24 text-center">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-4">
            YLO Moda Activa Sostenible
          </p>
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tightest text-white leading-[0.95]">
            Empieza a moverte
          </h2>
          <p className="mt-6 text-base text-white/70 max-w-md mx-auto leading-relaxed">
            Tres prendas. Tres colores. Una historia detrás de cada una
          </p>
          <Link
            to="/catalogo"
            className="inline-block mt-10 bg-white text-ylo-ink px-8 py-4 rounded-full text-sm font-medium hover:bg-ylo-bg hover:scale-105 transition-all duration-300"
          >
            Ver colección
          </Link>
        </div>
      </FadeUp>
    </section>
  );
}

function FadeUp(props: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const delayClass = props.delay ? `delay-${props.delay}` : "";

  return (
    <div ref={ref} className={`fade-up ${delayClass} ${visible ? "is-visible" : ""}`}>
      {props.children}
    </div>
  );
}

export default Home;