"use client";

export default function Dashboard() {
    return (
        <main className="wrap">
            <div className="card" role="main" aria-label="Pantalla de bienvenida">
                <h1 className="title">¡Bienvenid@!</h1>
                <p className="subtitle">Comienza tu aventura</p>
            </div>

            <style jsx>{`
                .wrap {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.12), transparent),
                                            radial-gradient(900px 500px at 90% 90%, rgba(16,185,129,0.08), transparent),
                                            linear-gradient(180deg, #0f172a 0%, #020617 100%);
                    padding: 24px;
                    box-sizing: border-box;
                }

                .card {
                    text-align: center;
                    padding: 48px 64px;
                    border-radius: 20px;
                    backdrop-filter: blur(6px) saturate(120%);
                    -webkit-backdrop-filter: blur(6px) saturate(120%);
                    background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
                    box-shadow: 0 8px 30px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
                    transform: translateY(0);
                    animation: float 6s ease-in-out infinite;
                    max-width: 920px;
                    width: 100%;
                }

                .title {
                    margin: 0;
                    font-weight: 800;
                    line-height: 1;
                    letter-spacing: -0.02em;
                    font-size: clamp(40px, 8vw, 96px);
                    background: linear-gradient(90deg, #7c3aed 0%, #06b6d4 40%, #10b981 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    text-shadow: 0 6px 30px rgba(124,58,237,0.12);
                    filter: drop-shadow(0 12px 40px rgba(2,6,23,0.6));
                    margin-bottom: 12px;
                    transition: transform 240ms ease;
                }

                .title:hover {
                    transform: translateY(-6px) scale(1.02);
                }

                .subtitle {
                    margin: 0;
                    margin-top: 6px;
                    color: rgba(255,255,255,0.8);
                    font-size: clamp(14px, 2.4vw, 18px);
                    opacity: 0.95;
                }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                    100% { transform: translateY(0px); }
                }

                @media (max-width: 520px) {
                    .card {
                        padding: 36px 20px;
                        border-radius: 16px;
                    }
                }
            `}</style>
        </main>
    );
}