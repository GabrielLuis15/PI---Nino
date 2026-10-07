const btnMenu = document.getElementById("btnMenu");
const btnFecharMenu = document.getElementById("btnFecharMenu");

const menuLateral = document.getElementById("menuLateral");
const menuOverlay = document.getElementById("menuOverlay");


btnMenu.addEventListener("click", () => {

  menuLateral.classList.add("aberto");
  menuOverlay.classList.add("aberto");

});


btnFecharMenu.addEventListener("click", () => {

  menuLateral.classList.remove("aberto");
  menuOverlay.classList.remove("aberto");

});


menuOverlay.addEventListener("click", () => {

  menuLateral.classList.remove("aberto");
  menuOverlay.classList.remove("aberto");

});