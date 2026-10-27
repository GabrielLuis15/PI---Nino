
import { auth, db } from "/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const form = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  if (!nome) {
    mensagem.textContent = "Digite seu nome.";
    return;
  }

  mensagem.textContent = "Criando sua conta...";

  try {
    const resultado = await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );

    await updateProfile(resultado.user, { displayName: nome });

    await setDoc(doc(db, "usuarios", resultado.user.uid), {
      nome,
      email,
      criadoEm: serverTimestamp()
    });

    mensagem.textContent = "Conta criada! Redirecionando...";
    window.location.href = "/registro";
  } catch (erro) {
    console.error(erro);

    const mensagens = {
      "auth/email-already-in-use": "Este e-mail já possui uma conta.",
      "auth/invalid-email": "Digite um e-mail válido.",
      "auth/weak-password": "Sua senha precisa ter pelo menos 6 caracteres.",
      "auth/network-request-failed": "Verifique sua conexão com a internet."
    };

    mensagem.textContent =
      mensagens[erro.code] || "Não foi possível criar a conta. Tente novamente.";
  }
});
