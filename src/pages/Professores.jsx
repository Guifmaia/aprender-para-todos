import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection, addDoc, deleteDoc,
  doc, onSnapshot
} from "firebase/firestore";

export default function Professores() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mostrarFormAluno, setMostrarFormAluno] = useState(false);
  const [mostrarFormAtividade, setMostrarFormAtividade] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [turmasDisponiveis, setTurmasDisponiveis] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [nome, setNome] = useState("");
  const [turma, setTurma] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    const unsubAlunos = onSnapshot(collection(db, "alunos"), (snap) => {
      setAlunos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubTurmas = onSnapshot(collection(db, "turmas"), (snap) => {
      setTurmasDisponiveis(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubAtividades = onSnapshot(collection(db, "atividades"), (snap) => {
      setAtividades(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubAlunos(); unsubTurmas(); unsubAtividades(); };
  }, []);

  async function salvarAluno() {
    if (!nome || !turma || !responsavel || !telefone) {
      alert("Preencha todos os campos!");
      return;
    }
    await addDoc(collection(db, "alunos"), { nome, turma, responsavel, telefone });
    setNome(""); setTurma(""); setResponsavel(""); setTelefone("");
    setMostrarFormAluno(false);
  }

  async function excluirAluno(id) {
    if (!window.confirm("Tem certeza que deseja excluir este aluno?")) return;
    await deleteDoc(doc(db, "alunos", id));
  }

  async function criarAtividade() {
    if (!titulo || !descricao) {
      alert("Preencha título e descrição!");
      return;
    }
    await addDoc(collection(db, "atividades"), { titulo, descricao, turma: "Geral" });
    setTitulo(""); setDescricao("");
    setMostrarFormAtividade(false);
  }

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <Layout>
      <div style={{ padding: "40px", fontFamily: "Segoe UI", background: "#f4f6f9", minHeight: "100vh" }}>

        <h1>Área do Professor</h1>
        <p>Painel de gerenciamento escolar</p>

        {/* CARDS */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
          <div style={cardStyle}>👨‍🎓 Alunos <h2>{alunos.length}</h2></div>
          <div style={cardStyle}>🏫 Turmas <h2>{turmasDisponiveis.length}</h2></div>
          <div style={cardStyle}>📝 Atividades <h2>{atividades.length}</h2></div>
        </div>

        {/* BOTÕES */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button style={primaryButton} onClick={() => setMostrarFormAluno(!mostrarFormAluno)}>
            + Novo Aluno
          </button>
          <button style={{ ...primaryButton, background: "#7c3aed" }} onClick={() => setMostrarFormAtividade(!mostrarFormAtividade)}>
            + Nova Atividade
          </button>
        </div>

        {/* FORM ALUNO */}
        {mostrarFormAluno && (
          <div style={formBox}>
            <h2>Cadastrar Aluno</h2>
            <div style={{ display: "grid", gap: "10px" }}>
              <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} />
              <select value={turma} onChange={(e) => setTurma(e.target.value)} style={inputStyle}>
                <option value="">Selecione a turma</option>
                {turmasDisponiveis.map((t) => (
                  <option key={t.id}>{t.nome}</option>
                ))}
              </select>
              <input placeholder="Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} style={inputStyle} />
              <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={inputStyle} />
              <button style={saveButton} onClick={salvarAluno}>Salvar</button>
            </div>
          </div>
        )}

        {/* FORM ATIVIDADE */}
        {mostrarFormAtividade && (
          <div style={formBox}>
            <h2>Nova Atividade</h2>
            <div style={{ display: "grid", gap: "10px" }}>
              <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} style={inputStyle} />
              <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ ...inputStyle, minHeight: "80px" }} />
              <button style={saveButton} onClick={criarAtividade}>Salvar</button>
            </div>
          </div>
        )}

        {/* LISTA ALUNOS */}
        <div style={tableBox}>
          <h2>Alunos</h2>
          {alunos.length === 0 && <p style={{ color: "#999" }}>Nenhum aluno cadastrado.</p>}
          {alunos.map((a) => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #ddd" }}>
              <span>{a.nome} - {a.turma}</span>
              <button onClick={() => excluirAluno(a.id)} style={{ background: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "6px" }}>
                Excluir
              </button>
            </div>
          ))}
        </div>

        {/* LISTA ATIVIDADES */}
        <div style={tableBox}>
          <h2>Atividades</h2>
          {atividades.length === 0 && <p style={{ color: "#999" }}>Nenhuma atividade criada.</p>}
          {atividades.map((a) => (
            <div key={a.id} style={{ marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
              <strong>{a.titulo}</strong>
              <p>{a.descricao}</p>
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <button onClick={handleLogout} style={{ position: "fixed", top: "20px", right: "20px", background: "#ef4444", color: "white", border: "none", padding: "10px 15px", borderRadius: "8px" }}>
          Sair
        </button>

      </div>
    </Layout>
  );
}

const cardStyle = { background: "white", padding: "20px", borderRadius: "12px", minWidth: "150px" };
const primaryButton = { padding: "10px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" };
const saveButton = { padding: "10px", background: "green", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" };
const formBox = { background: "white", padding: "20px", marginTop: "20px", borderRadius: "12px" };
const inputStyle = { padding: "10px", border: "1px solid #ccc", borderRadius: "8px" };
const tableBox = { background: "white", padding: "20px", marginTop: "20px", borderRadius: "12px" };