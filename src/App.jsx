import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Layout from "./components/Layout";
import Professores from "./pages/Professores";
import Alunos from "./pages/Alunos";
import Responsaveis from "./pages/Responsaveis";
import Turmas from "./pages/Turmas";
import Atividades from "./pages/Atividades";
import Comunicados from "./pages/Comunicados";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";

function Home() {
  const [alunos, setAlunos] = useState(0);
  const [turmas, setTurmas] = useState(0);
  const [atividades, setAtividades] = useState(0);
  const [comunicados, setComunicados] = useState(0);

  useEffect(() => {
    onSnapshot(collection(db, "alunos"), s => setAlunos(s.size));
    onSnapshot(collection(db, "turmas"), s => setTurmas(s.size));
    onSnapshot(collection(db, "atividades"), s => setAtividades(s.size));
    onSnapshot(collection(db, "comunicados"), s => setComunicados(s.size));
  }, []);

  return (
    <Layout>
      <div style={{ padding: "40px", fontFamily: "Arial" }}>
        <h1 style={{ color: "#1e3a8a", textAlign: "center" }}>🎓 Aprender para Todos</h1>
        <p style={{ color: "#555", textAlign: "center" }}>Plataforma de gestão escolar inteligente</p>

        <div style={{ display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={cardStyle}><h3>👨‍🎓 Alunos</h3><h2>{alunos}</h2></div>
          <div style={cardStyle}><h3>🏫 Turmas</h3><h2>{turmas}</h2></div>
          <div style={cardStyle}><h3>📝 Atividades</h3><h2>{atividades}</h2></div>
          <div style={cardStyle}><h3>📢 Comunicados</h3><h2>{comunicados}</h2></div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "40px", flexWrap: "wrap" }}>
          <Link to="/professores" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={linkCard}><h3>👨‍🏫 Professores</h3><p>Enviar materiais e avisos.</p></div>
          </Link>
          <Link to="/alunos" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={linkCard}><h3>🎓 Alunos</h3><p>Acessar atividades e conteúdos.</p></div>
          </Link>
          <Link to="/responsaveis" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={linkCard}><h3>👨‍👩‍👧 Responsáveis</h3><p>Receber notificações e comunicados.</p></div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

function RotaProtegida({ children }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return <p>Carregando...</p>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/professores" element={<RotaProtegida><Professores /></RotaProtegida>} />
      <Route path="/alunos" element={<RotaProtegida><Alunos /></RotaProtegida>} />
      <Route path="/responsaveis" element={<RotaProtegida><Responsaveis /></RotaProtegida>} />
      <Route path="/turmas" element={<RotaProtegida><Turmas /></RotaProtegida>} />
      <Route path="/atividades" element={<RotaProtegida><Atividades /></RotaProtegida>} />
      <Route path="/comunicados" element={<RotaProtegida><Comunicados /></RotaProtegida>} />
      <Route path="/perfil" element={<RotaProtegida><Perfil /></RotaProtegida>} />
    </Routes>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "180px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  textAlign: "center"
};

const linkCard = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "220px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  cursor: "pointer",
  textAlign: "center"
};

export default App;