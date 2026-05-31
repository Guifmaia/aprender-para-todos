import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function Alunos() {
  const [atividades, setAtividades] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "atividades"), (snap) => {
      setAtividades(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  async function concluirAtividade(id) {
    await updateDoc(doc(db, "atividades", id), { concluida: true });
  }

  return (
    <Layout>
      <div style={{ padding: "40px", fontFamily: "Segoe UI", background: "#f4f6f9", minHeight: "100vh" }}>
        <h1>📚 Área do Aluno</h1>
        <p>Veja suas atividades abaixo</p>

        <div style={{ marginTop: "20px" }}>
          {atividades.length === 0 && (
            <p style={{ color: "#999" }}>Nenhuma atividade disponível.</p>
          )}

          {atividades.map((a) => (
            <div key={a.id} style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderLeft: a.concluida ? "5px solid green" : "5px solid #2563eb"
            }}>
              <h3 style={{ margin: 0 }}>{a.titulo}</h3>
              <p style={{ color: "#555", marginTop: "8px" }}>{a.descricao}</p>

              {a.concluida ? (
                <span style={{ color: "green", fontWeight: "bold" }}>✅ Concluída</span>
              ) : (
                <button
                  onClick={() => concluirAtividade(a.id)}
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Marcar como concluída
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}