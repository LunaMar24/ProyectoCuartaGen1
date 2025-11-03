"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState({ nombre: "Usuario", email: "", rol: "" });
  const [loading, setLoading] = useState(true);

  // Determina si una ruta del menú está activa
  const isActive = (href) => pathname?.startsWith(href);

  // Logout centralizado para el layout
  const handleLogout = () => {
    const token = localStorage.getItem("authToken");
    // Limpia credenciales locales
    localStorage.removeItem("authToken");
    // Llama al endpoint de logout si existe (ignora errores)
    fetch("http://localhost:3000/api/v1/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }).finally(() => {
      router.push("/");
    });
  };

  // Cargar datos básicos del usuario para el topbar
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || token === "undefined" || token.trim() === "") {
      // Sin token: redirige a login
      router.push("/");
      return;
    }

    const remembered = localStorage.getItem("rememberedUser");
    if (remembered) {
      try {
        const parsed = JSON.parse(remembered);
        setUser((u) => ({ ...u, email: parsed.email ?? u.email }));
      } catch {}
    }

    // Intentar obtener perfil para mostrar nombre/rol
    fetch("http://localhost:3000/api/v1/auth/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data?.data) {
          const { nombre, email, rol } = data.data;
          setUser({ nombre: nombre || "Usuario", email: email || user.email, rol: rol || "" });
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const menuItems = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/propietarios", label: "Propietarios" },
      { href: "/dashboard/mascotas", label: "Mascotas" },
    ],
    []
  );

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-60 bg-slate-800 border-r border-slate-700">
        <div className="flex items-center gap-3 p-4 border-b border-slate-700">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-400/50">
            <span className="text-emerald-300 font-bold">A</span>
          </div>
          <div>
            <p className="text-sm text-emerald-300">Bienvenido</p>
            <p className="text-xs text-slate-300 truncate max-w-[160px]">{user.nombre}</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                (isActive(item.href)
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/60") +
                " block rounded-md px-3 py-2 text-sm font-medium"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center rounded-md bg-rose-600 hover:bg-rose-700 px-3 py-2 text-sm font-semibold text-white"
          >
            Salir
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-slate-800/90 backdrop-blur border-b border-slate-700 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-100 font-extrabold tracking-wide">
              VETERINARIA
            </Link>
            <span className="hidden sm:inline text-slate-400 text-sm">LunaMar</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-100 leading-4">
                {loading ? "Cargando..." : user.nombre}
              </p>
              <p className="text-xs text-slate-400 leading-4">
                {user.rol ? `Rol: ${user.rol}` : user.email}
              </p>
            </div>
            <Link
              href="/dashboard/profile"
              className="hidden sm:inline rounded-md border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
            >
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-md bg-rose-600 hover:bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Logout
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-600 ring-2 ring-emerald-400/60" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {/* Content wrapper keeps children looking good even si vienen con su propio estilo */}
          <div className="min-h-[calc(100vh-3.5rem)] rounded-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
