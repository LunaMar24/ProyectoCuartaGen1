"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No hay sesión activa");
      return;
    }

    fetch("http://localhost:3000/api/v1/auth/profile", {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success) setProfile(data.data);
        else setError(data?.message || "No se pudo obtener el perfil");
      })
      .catch(() => setError("Error de conexión"));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 bg-white/5 border border-white/10 rounded-lg p-6 text-slate-100">
        <h1 className="text-xl font-semibold mb-1">Perfil</h1>
        <p className="text-slate-300 text-sm mb-4">Visualiza la información del usuario.</p>

        {error && <p className="text-rose-400 text-sm mb-4">{error}</p>}
        {!profile && !error && <p className="text-slate-300 text-sm">Cargando...</p>}

        {profile && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-3 gap-3 items-center">
              <label className="col-span-1 text-slate-300">Nombre:</label>
              <input className="col-span-2 bg-slate-800 border border-slate-700 rounded-md px-3 py-2" defaultValue={profile.nombre || ""} readOnly />
            </div>
            <div className="grid grid-cols-3 gap-3 items-center">
              <label className="col-span-1 text-slate-300">Email:</label>
              <input className="col-span-2 bg-slate-800 border border-slate-700 rounded-md px-3 py-2" defaultValue={profile.email || ""} readOnly />
            </div>
            <div className="grid grid-cols-3 gap-3 items-center">
              <label className="col-span-1 text-slate-300">Teléfono:</label>
              <input className="col-span-2 bg-slate-800 border border-slate-700 rounded-md px-3 py-2" defaultValue={profile.telefono || ""} readOnly />
            </div>
          </div>
        )}
      </section>

      <aside className="bg-white/5 border border-white/10 rounded-lg p-6 text-slate-100">
        <div className="w-24 h-24 rounded-full bg-slate-700 mx-auto mb-4 ring-2 ring-emerald-400/60" />
        <div className="space-y-2 text-sm">
          <p><span className="text-slate-400">Nombre:</span> {profile?.nombre || "-"}</p>
          <p><span className="text-slate-400">Email:</span> {profile?.email || "-"}</p>
          <p><span className="text-slate-400">Teléfono:</span> {profile?.telefono || "-"}</p>
        </div>
      </aside>
    </div>
  );
}
