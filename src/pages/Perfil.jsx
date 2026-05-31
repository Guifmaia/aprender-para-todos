import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const perfis = [
  { tipo: "professor", label: "👨‍🏫 Professor", cor: "#4285F4" },
  { tipo: "aluno", label: "🎓 Aluno", cor: "#34A853" },
  { tipo: "responsavel", label: "👨‍👩‍👧 Responsável", cor: "#FBBC05" },
];

export default function Perfil() {
  const navigate = useNavigate();

  async function escolherPerfil(tipo) {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(doc(db, "usuarios", user.uid), {
      perfil: tipo,
      email: user.email,
      nome: user.displayName
    });

    if (tipo === "professor") return navigate("/professores");
    if (tipo === "aluno") return navigate("/alunos");
    if (tipo === "responsavel") return navigate("/responsaveis");
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f4f6f9",
      fontFamily: "Arial"
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
        width: "320px"
      }}>
        <h1 style={{ color: "#333", marginBottom: "8px" }}>Quem é você?</h1>
        <p style={{ color: "#666", marginBottom: "24px" }}>Escolha seu perfil para continuar</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {perfis.map(({ tipo, label, cor }) => (
            <button
              key={tipo}
              onClick={() => escolherPerfil(tipo)}
              style={{
                backgroundColor: cor,
                color: tipo === "responsavel" ? "#333" : "white",
                border: "none",
                padding: "14px",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}