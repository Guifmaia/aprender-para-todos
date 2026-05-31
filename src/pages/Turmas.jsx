import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

export default function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [novaTurma, setNovaTurma] = useState("");
  const [alunos, setAlunos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubTurmas = onSnapshot(collection(db, "turmas"), (snap) => {
      setTurmas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubAlunos = onSnapshot(collection(db, "alunos"), (snap) => {
      setAlunos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubTurmas(); unsubAlunos(); };
  }, []);

  async function adicionarTurma() {
    if (!novaTurma) { alert("Digite o nome da turma!"); return; }
    await addDoc(collection(db, "turmas"), { nome: novaTurma });
    setNovaTurma("");
  }

  async function excluirTurma(id) {
    if (!window.confirm("Tem certeza que deseja excluir esta turma?")) return;
    await deleteDoc(doc(db, "turmas", id));
  }

  return (
    <Layout>
      <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f9", padding: "40px", fontFamily: "Arial" }}>

        <h1>🏫 Turmas</h1>
        <p>Gerenciamento de turmas da escola.</p>

        <div style={cardInfo}>
          <h3>🏫 Total de Turmas</h3>
          <h2>{turmas.length}</h2>
        </div>

        <div style={formBox}>
          <h2>Nova Turma</h2>
          <input
            style={inputStyle}
            placeholder="Ex: 5º Ano A"
            value={novaTurma}
            onChange={(e) => setNovaTurma(e.target.value)}
          />
          <button style={primaryButton} onClick={adicionarTurma}>
            + Adicionar Turma
          </button>
        </div>

        <div style={listBox}>
          <h2>Turmas cadastradas</h2>
          {turmas.length === 0 ? (
            <p style={{ color: "#999" }}>Nenhuma turma cadastrada ainda.</p>
          ) : (
            <div style={{ display: "grid", gap: "15px" }}>
              {turmas.map((turma) => {
                const alunosDaTurma = alunos.filter(a => a.turma === turma.nome);
                return (
                  <div key={turma.id} style={turmaCard}>
                    <strong>🏫 {turma.nome}</strong>
                    <span style={{ marginLeft: "12px" }}>
                      👨‍🎓 {alunosDaTurma.length} alunos
                    </span>
                    <div style={{ marginTop: "10px" }}>
                      {alunosDaTurma.map((aluno) => (
                        <div key={aluno.id}>• {aluno.nome}</div>
                      ))}
                    </div>
                    <button style={deleteButton} onClick={() => excluirTurma(turma.id)}>
                      🗑 Excluir
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button style={backButton} onClick={() => navigate("/professores")}>
          Voltar ao Professor
        </button>

      </div>
    </Layout>
  );
}

const cardInfo = { background: "white", padding: "20px", borderRadius: "16px", width: "220px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", marginTop: "20px" };
const formBox = { background: "white", padding: "25px", borderRadius: "16px", marginTop: "30px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" };
const inputStyle = { padding: "12px", borderRadius: "10px", border: "1px solid #ccc", fontSize: "15px", marginRight: "10px", minWidth: "250px" };
const primaryButton = { backgroundColor: "#2563eb", color: "white", border: "none", padding: "12px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" };
const listBox = { background: "white", padding: "25px", borderRadius: "16px", marginTop: "30px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" };
const turmaCard = { display: "block", padding: "15px", borderRadius: "12px", border: "1px solid #e5e7eb" };
const deleteButton = { backgroundColor: "#dc2626", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", marginTop: "10px" };
const backButton = { marginTop: "30px", backgroundColor: "#1e3a8a", color: "white", border: "none", padding: "12px 20px", borderRadius: "10px", cursor: "pointer" };