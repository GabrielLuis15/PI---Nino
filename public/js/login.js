
import { auth } from "/firebase-config.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const form = document.getElementById("formLogin");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  mensagem.textContent = "Entrando...";

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = "/registro";
  } catch (erro) {
    console.error(erro);

    if (
      erro.code === "auth/invalid-credential" ||
      erro.code === "auth/user-not-found" ||
      erro.code === "auth/wrong-password"
    ) {
      mensagem.textContent = "E-mail ou senha incorretos.";
    } else if (erro.code === "auth/invalid-email") {
      mensagem.textContent = "Digite um e-mail válido.";
    } else {
      mensagem.textContent = "Não foi possível entrar. Tente novamente.";
    }
  }
});
