import { Link, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Layout({ children }) {
  const location = useLocation();
  const [user] = useAuthState(auth);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    async function carregarPerfil() {
      if (!user) return;
      const snap = await getDoc(doc(db, "usuarios", user.uid));
      if (snap.exists()) setPerfil(snap.data().perfil);
    }
    carregarPerfil();
  }, [user]);

  const menuProfessor = [
    { to: "/", label: "🏠 Home" },
    { to: "/professores", label: "👨‍🏫 Professores" },
    { to: "/turmas", label: "🏫 Turmas" },
    { to: "/atividades", label: "📝 Atividades" },
    { to: "/comunicados", label: "📢 Comunicados" },
  ];

  const menuAluno = [
    { to: "/", label: "🏠 Home" },
    { to: "/alunos", label: "🎓 Minhas Atividades" },
  ];

  const menuResponsavel = [
    { to: "/", label: "🏠 Home" },
    { to: "/responsaveis", label: "👨‍👩‍👧 Comunicados" },
  ];

  const menu = perfil === "professor" ? menuProfessor
    : perfil === "aluno" ? menuAluno
    : perfil === "responsavel" ? menuResponsavel
    : [{ to: "/", label: "🏠 Home" }];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      <aside style={{
        width: "240px",
        background: "linear-gradient(180deg, #1e3a8a, #152c6e)",
        color: "white",
        padding: "30px 20px",
        flexShrink: 0
      }}>
        <h2 style={{ margin: 0, fontSize: "20px" }}>🎓 Aprender para Todos</h2>
        {perfil && (
          <p style={{ color: "#93c5fd", fontSize: "13px", marginTop: "6px" }}>
            {perfil === "professor" ? "👨‍🏫 Professor" : perfil === "aluno" ? "🎓 Aluno" : "👨‍👩‍👧 Responsável"}
          </p>
        )}

        <nav style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "30px" }}>
          {menu.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                color: "white",
                textDecoration: "none",
                padding: "10px 14px",
                borderRadius: "8px",
                background: location.pathname === to ? "rgba(255,255,255,0.2)" : "transparent",
                fontWeight: location.pathname === to ? "bold" : "normal",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, background: "#f4f6f9", overflowY: "auto" }}>
        {children}
      </main>

    </div>
  );
}