import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Layout from "../components/Layout";

export default function Responsaveis() {
  const [comunicados, setComunicados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "comunicados"), (snap) => {
      setComunicados(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <Layout>
      <div style={{ padding: "40px", fontFamily: "Segoe UI", background: "#f4f6f9", minHeight: "100vh" }}>
        <h1>👨‍👩‍👧 Área dos Responsáveis</h1>
        <p>Acompanhe os comunicados da escola</p>

        <div style={{ marginTop: "20px" }}>
          {comunicados.length === 0 ? (
            <p style={{ color: "#999" }}>Nenhum comunicado disponível.</p>
          ) : (
            comunicados.map((item) => (
              <div key={item.id} style={{
                background: "white",
                padding: "20px",
                marginBottom: "16px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                borderLeft: "5px solid #2563eb"
              }}>
                <h3 style={{ margin: 0 }}>{item.titulo}</h3>
                <p style={{ color: "#555", margin: "6px 0" }}>
                  <strong>Turma:</strong> {item.turma}
                </p>
                <p style={{ color: "#333" }}>{item.mensagem}</p>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          ← Voltar
        </button>
      </div>
    </Layout>
  );
}