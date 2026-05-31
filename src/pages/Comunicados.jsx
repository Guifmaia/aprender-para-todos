import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import Layout from "../components/Layout";

export default function Comunicados() {
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [turma, setTurma] = useState("");
  const [turmas, setTurmas] = useState([]);
  const [comunicados, setComunicados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubTurmas = onSnapshot(collection(db, "turmas"), (snap) => {
      setTurmas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubComunicados = onSnapshot(collection(db, "comunicados"), (snap) => {
      setComunicados(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubTurmas(); unsubComunicados(); };
  }, []);

  async function enviarComunicado() {
    if (!titulo || !mensagem || !turma) {
      alert("Preencha todos os campos!");
      return;
    }
    await addDoc(collection(db, "comunicados"), {
      titulo,
      mensagem,
      turma,
      criadoEm: new Date().toLocaleDateString("pt-BR")
    });
    setTitulo(""); setMensagem(""); setTurma("");
  }

  async function excluirComunicado(id) {
    if (!window.confirm("Tem certeza que deseja excluir este comunicado?")) return;
    await deleteDoc(doc(db, "comunicados", id));
  }

  return (
    <Layout>
      <div style={{ padding: "40px", fontFamily: "Segoe UI", background: "#f4f6f9", minHeight: "100vh" }}>
        <h1>📢 Comunicados</h1>
        <p>Envie comunicados para as turmas</p>

        <div style={formBox}>
          <h2>Novo Comunicado</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            <input
              placeholder="Título do comunicado"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={inputStyle}
            />
            <textarea
              placeholder="Mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              style={{ ...inputStyle, minHeight: "80px" }}
            />
            <select value={turma} onChange={(e) => setTurma(e.target.value)} style={inputStyle}>
              <option value="">Selecione a turma</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.nome}>{t.nome}</option>
              ))}
            </select>
            <button onClick={enviarComunicado} style={primaryButton}>
              📤 Enviar Comunicado
            </button>
          </div>
        </div>

        <div style={listBox}>
          <h2>Comunicados enviados</h2>
          {comunicados.length === 0 && <p style={{ color: "#999" }}>Nenhum comunicado enviado.</p>}
          {comunicados.map((item) => (
            <div key={item.id} style={{
              background: "#f8fafc",
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              borderLeft: "5px solid #2563eb"
            }}>
              <h3 style={{ margin: 0 }}>{item.titulo}</h3>
              <p style={{ margin: "6px 0", color: "#555" }}><strong>Turma:</strong> {item.turma}</p>
              <p style={{ color: "#333" }}>{item.mensagem}</p>
<p style={{ color: "#999", fontSize: "13px" }}>📅 {item.criadoEm}</p>
              <button onClick={() => excluirComunicado(item.id)} style={deleteButton}>
                🗑 Excluir
              </button>
            </div>
          ))}
        </div>

        <button onClick={() => navigate("/professores")} style={backButton}>
          ← Voltar ao Professor
        </button>
      </div>
    </Layout>
  );
}

const formBox = { background: "white", padding: "25px", borderRadius: "16px", marginTop: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" };
const listBox = { background: "white", padding: "25px", borderRadius: "16px", marginTop: "30px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" };
const inputStyle = { padding: "10px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "15px" };
const primaryButton = { padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const deleteButton = { marginTop: "10px", background: "#dc2626", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer" };
const backButton = { marginTop: "30px", backgroundColor: "#1e3a8a", color: "white", border: "none", padding: "12px 20px", borderRadius: "10px", cursor: "pointer" };