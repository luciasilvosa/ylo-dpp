import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-ylo-border bg-ylo-bg">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold tracking-tightest text-ylo-ink">
                YL
              </span>
              <span className="text-3xl font-bold tracking-tightest text-ylo-pool">
                Ö
              </span>
            </div>
            <p className="text-sm text-ylo-ink-soft mt-4 max-w-sm leading-relaxed">
              Moda activa sostenible. Prendas técnicas diseñadas para moverse,
              hechas para durar.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ylo-ink mb-4">
              Tienda
            </p>
            <ul className="space-y-2 text-sm text-ylo-ink-soft">
              <li>
                <Link
                  to="/catalogo"
                  className="hover:text-ylo-ink transition-colors"
                >
                  Colección
                </Link>
              </li>
              <li>Sostenibilidad</li>
              <li>Trazabilidad</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ylo-ink mb-4">
              Contacto
            </p>
            <ul className="space-y-2 text-sm text-ylo-ink-soft">
              <li>hola@ylo.com</li>
              <li>Madrid, España</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ylo-border flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-xs text-ylo-ink-soft">
            © 2025 YLÖ. Moda Activa Sostenible S.L. 
          </p>
          <div className="flex gap-6 text-xs text-ylo-ink-soft">
            <span>Términos</span>
            <span>Privacidad</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;