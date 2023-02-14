<script lang="ts">
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { auth, provider, db } from "../firebase";
  import { redirect } from "@sveltejs/kit";
  import { goto } from "$app/navigation";
  import {
    addDoc,
    collection,
    onSnapshot,
    QuerySnapshot,
  } from "firebase/firestore";
  import Cont from "./cont.svelte";
  import { onMount } from "svelte";

  export let tema: boolean;
  const toggleDarkTheme = (): void => {
    window.document.body.classList.toggle("dark-mode");
    if (window.document.body.classList.contains("dark-mode")) {
      mitema = "dark";
    } else {
      mitema = "light";
    }
    localStorage.setItem("tema", mitema);
  };

  let mostrar: boolean = false;
  let mitema: string;

  export let userData = {
    nombre: "",
    email: "",
  };

  const autenticar = async () => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
        userData.email = user.email as string;
        userData.nombre = user.displayName as string;
        mostrar = true;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMesage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  onMount(async () => {
    try {
      if (localStorage.getItem("tema") === null) {
        localStorage.setItem("tema", "light");
        mitema = "light";
      } else {
        let th = localStorage.getItem("tema");
        if (th === "light") {
          window.document.body.classList.remove("dark-mode");
          mitema = "light";
        } else if (th === "dark") {
          window.document.body.classList.add("dark-mode");
          mitema = "dark";
        }
      }
    } catch (error) {
      console.error("Error en el local storage");
    }
  });
</script>

<main>
  <button on:click={toggleDarkTheme} class="theme-button"
    >Theme: {mitema}</button
  >

  {#if mostrar === false}
    <div class="app">
      <div class="card">
        <div class="slogan">
          <h1>Nueva y revolucionaria app de contactos</h1>
          <h2>Administrar tus contactos nunca habia sido tan facil</h2>
          <p>Inicia sesion con Google y disfruta de todas las ventajas!</p>
          <button on:click={autenticar}>Inicia sesion</button>
        </div>
      </div>
    </div>
    <footer>Mikel Apesteguia - 2023</footer>
  {/if}
  {#if mostrar === true}
    <Cont {userData} {tema} />
  {/if}
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap");
  .slogan {
    margin-top: 100px;
    width: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  :global(body) {
    background-color: white;
    transition: 0.3s;
  }
  :global(body.dark-mode) {
    background-color: rgb(24, 24, 24);
    color: white;
    transition: 0.3s;
  }
  footer {
    opacity: 0.8;
    position: absolute;
    top: 90%;
    margin-left: 100px;
  }
  .slogan > button {
    margin-top: 30px;
  }
  h1 {
    font-family: Inter;
    font-size: 3.8rem;
  }
  h2 {
    font-size: 1.6rem;
    font-weight: normal;
  }
  .dark {
    background-color: rgb(61, 61, 61);
    color: rgb(229, 229, 229);
  }
  .dark2 {
    background-color: rgb(84, 84, 84);
  }
  div {
    font-family: sans-serif;
  }
  button {
    font-family: sans-serif;
    cursor: pointer;
    width: 120px;
    font-size: 1rem;
    outline: none;
    height: 38px;
    background-color: rgb(0, 98, 255);
    color: white;
    border: none;
    border-radius: 3px;
  }
  .app {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
  .theme-button {
    position: fixed;
    z-index: 3;
  }
</style>
