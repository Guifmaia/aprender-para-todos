import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);

  async function loginGoogle() {
    const provider = new GoogleAuthProvider();
    setCarregando(true);
    try {
      const resultado = await signInWithPopup(auth, provider);
      const user = resultado.user;
      const snap = await getDoc(doc(db, "usuarios", user.uid));
      if (snap.exists()) {
        const perfil = snap.data().perfil;
        if (perfil === "professor") return navigate("/professores");
        if (perfil === "aluno") return navigate("/alunos");
        if (perfil === "responsavel") return navigate("/responsaveis");
      }
      navigate("/perfil");
    } catch (error) {
      alert("Erro ao fazer login. Tente novamente.");
      console.log(error);
    } finally {
      setCarregando(false);
    }
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
        <h1 style={{ color: "#333", marginBottom: "8px" }}>🎓 Aprender para Todos</h1>
        <p style={{ color: "#666", marginBottom: "24px" }}>Entre com sua conta Google</p>

        <button
          onClick={loginGoogle}
          disabled={carregando}
          style={{
            backgroundColor: "#4285F4",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: carregando ? "not-allowed" : "pointer",
            opacity: carregando ? 0.7 : 1,
            width: "100%"
          }}
        >
          {carregando ? "Entrando..." : "🔵 Entrar com Google"}
        </button>
      </div>
    </div>
  );
}