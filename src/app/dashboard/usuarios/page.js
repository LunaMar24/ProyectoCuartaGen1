"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// Nota: Asumimos que existen endpoints REST de usuarios:
//  - GET    http://localhost:3000/api/v1/users          -> lista de usuarios
//  - DELETE http://localhost:3000/api/v1/users/:id      -> eliminar usuario
// Para crear, usaremos el endpoint existente de registro: POST /auth/register
// Si los endpoints reales difieren, ajusta las constantes API_USERS y los métodos.

const API_BASE = "http://localhost:3000/api/v1";
const API_USERS = `${API_BASE}/users`;

export default function UsuariosListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("authToken") : null), []);

  useEffect(() => {
    if (!token) {
      setError("No hay token de autenticación");
      setLoading(false);
      return;
    }

    fetch(API_USERS, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        // Intentamos soportar dos formas comunes: {success,data:[...]} o arrays directos
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setItems(list);
      })
      .catch(() => setError("No se pudo obtener la lista de usuarios"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    fetch(`${API_USERS}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json().catch(() => ({})))
      .then(() => {
        setItems((prev) => prev.filter((u) => String(u.id ?? u._id) !== String(id)));
      })
      .catch(() => alert("No se pudo eliminar el usuario"));
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Usuarios</h1>
        <Link
          href="/dashboard/usuarios/crear"
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-sm font-semibold text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Crear usuario
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/60 text-slate-300">
            <tr>
              <th className="text-left px-4 py-2">Nombre</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Teléfono</th>
              <th className="text-left px-4 py-2">Creación</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="px-4 py-3 text-slate-300" colSpan={5}>Cargando...</td></tr>
            )}
            {!loading && error && (
              <tr><td className="px-4 py-3 text-rose-300" colSpan={5}>{error}</td></tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr><td className="px-4 py-3 text-slate-300" colSpan={5}>Sin usuarios</td></tr>
            )}
            {!loading && !error && items.map((u) => {
              const id = u.id ?? u._id;
              return (
                <tr key={id} className="border-t border-white/10">
                  <td className="px-4 py-2">{u.nombre || u.name || "-"}</td>
                  <td className="px-4 py-2">{u.email || "-"}</td>
                  <td className="px-4 py-2">{u.telefono || u.phone || "-"}</td>
                  <td className="px-4 py-2">{u.fecha_creacion ? new Date(u.fecha_creacion).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <button
                        title="Eliminar"
                        onClick={() => handleDelete(id)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-700/60 text-rose-400 hover:text-rose-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a2 2 0 012-2h4a2 2 0 012 2m-8 0h10" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
