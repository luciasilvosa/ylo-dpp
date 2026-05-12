import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header
      className={`sticky top-0 z-10 ${
        isHome
          ? "bg-transparent"
          : "bg-ylo-bg/80 backdrop-blur-md border-b border-ylo-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <Link to="/" className="group flex items-baseline">
          <span className="text-2xl font-bold tracking-tightest text-ylo-ink">
            YL
          </span>
          <span className="text-2xl font-bold tracking-tightest text-ylo-pool group-hover:text-ylo-fuchsia transition-colors duration-500">
            Ö
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-10 text-sm font-medium">
          {!isHome && (
            <Link
              to="/"
              className="text-ylo-ink-soft hover:text-ylo-ink transition-colors"
            >
              Inicio
            </Link>
          )}
          <Link
            to="/catalogo"
            className="text-ylo-ink-soft hover:text-ylo-ink transition-colors"
          >
            Colección
          </Link>
          <Link
            to="/catalogo"
            className="bg-ylo-ink text-white px-5 py-2 rounded-full hover:bg-ylo-ink-soft transition-colors"
          >
            Ver colección
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;