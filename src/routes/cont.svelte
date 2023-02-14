<script lang="ts">
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { auth, provider, db } from "../firebase";
  import { redirect } from "@sveltejs/kit";
  import { goto } from "$app/navigation";
  import { onDestroy } from "svelte";
  import {
    addDoc,
    collection,
    deleteDoc,
    onSnapshot,
    QuerySnapshot,
    doc,
    updateDoc,
  } from "firebase/firestore";
  import { onMount } from "svelte";

  export let userData = {
    nombre: "",
    email: "",
  };

  let contacto = {
    nombre: "",
    usuario: "",
    apellido: "",
    telefono: "",
    correo: "",
  };

  let contactos: any = [];
  let editar: boolean = false;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      crearContacto();
    } catch (error) {
      console.error(error);
    }
  };

  const borrarTodo = async () => {
    await contactos.map((contacto: any) => {
      deleteDoc(doc(db, userData.email, contacto.id));
    });
  };

  const clearForm = () => {
    contacto = {
      nombre: "",
      usuario: "",
      apellido: "",
      telefono: "",
      correo: "",
    };
  };

  const toggleCrear = () => {
    console.log(mitema);
    crear = !crear;
  };

  const crearContacto = async () => {
    await addDoc(collection(db, userData.email), contacto);
    contacto = {
      usuario: "",
      nombre: "",
      apellido: "",
      telefono: "",
      correo: "",
    };
  };
  const editarContacto = async () => {};

  const unsub = onSnapshot(collection(db, userData.email), (QuerySnapshot) => {
    contactos = QuerySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    console.log(contactos);
  });
  onDestroy(unsub);

  let crear: boolean = false;

  let mostrar: boolean = false;
  let mitema: string;

  const toggleDarkTheme = (): void => {
    window.document.body.classList.toggle("dark-mode");
    if (window.document.body.classList.contains("dark-mode")) {
      mitema = "dark";
    } else {
      mitema = "light";
    }
    localStorage.setItem("tema", mitema);
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

<div class="app">
  <button on:click={toggleDarkTheme} class="theme-button"
    >Theme: {mitema}</button
  >
  <button on:click={toggleCrear}>crear</button>
  <button on:click={borrarTodo}>Borrar Todo</button>
  {#if crear === true}
    <form
      class:dark={mitema === "dark"}
      class:light={mitema === "light"}
      class="crear"
      on:submit={handleSubmit}
    >
      <h1>Añade un contacto</h1>
      <div class="inp">
        <label for="">Nombre de usuario</label>
        <input
          maxlength="20"
          autocomplete="off"
          autofocus
          class:dark-i={mitema === "dark"}
          class:light-i={mitema === "light"}
          bind:value={contacto.usuario}
          type="text"
        />
      </div>
      <div class="inp">
        <label for="">Nombre</label>
        <input
          maxlength="20"
          autocomplete="off"
          class:dark-i={mitema === "dark"}
          class:light-i={mitema === "light"}
          type="text"
          bind:value={contacto.nombre}
        />
      </div>
      <div class="inp">
        <label for="">Apellido</label>
        <input
          maxlength="30"
          autocomplete="off"
          class:dark-i={mitema === "dark"}
          class:light-i={mitema === "light"}
          type="text"
          bind:value={contacto.apellido}
        />
      </div>
      <div class="inp">
        <label for="">Telefono</label>
        <input
          maxlength="9"
          autocomplete="off"
          class:dark-i={mitema === "dark"}
          class:light-i={mitema === "light"}
          type="text"
          bind:value={contacto.telefono}
        />
      </div>
      <div class="inp">
        <label for="">Correo</label>
        <input
          maxlength="30"
          autocomplete="off"
          class:dark-i={mitema === "dark"}
          class:light-i={mitema === "light"}
          type="text"
          bind:value={contacto.correo}
        />
      </div>
      <div class="buttons">
        <button>Submit</button>
        <button type="reset" on:click={clearForm}>Clear</button>
      </div>
    </form>
  {/if}
  {#each contactos as c}
    <h3>{c.nombre}</h3>
    <h2>{c.usuario}</h2>
    <h3>{c.apellido}</h3>
    <h3>{c.telefono}</h3>
    <h3>{c.correo}</h3>
  {/each}
</div>

<style>
  .crear {
    z-index: 3;
    position: absolute;
    width: 400px;
    height: 520px;
    top: 70px;
    font-family: sans-serif;
  }
  .dark {
    background-color: rgb(17, 17, 17);
  }
  .light {
    background-color: rgb(195, 196, 197);
  }
  .app {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    flex-direction: column;
    align-items: center;
    display: flex;
  }
  .theme-button {
    position: fixed;
    z-index: 3;
    font-family: sans-serif;
    cursor: pointer;
    width: 120px;
    font-size: 1rem;
    outline: none;
    height: 38px;
    background-color: rgb(0, 98, 255);
    color: white;
    border: none;
    left: 5px;
    top: 5px;
    border-radius: 3px;
  }
  form {
    text-decoration: none;
    border-radius: 5px;
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    margin-top: 100px;
    align-items: center;
    gap: 10px;
  }
  form > h1 {
    text-align: center;
  }
  .inp {
    display: flex;
    flex-direction: column;
    width: 80%;
    gap: 5px;
  }
  .inp > input {
    outline: none;
    border-radius: 5px;
    font-size: 1rem;
    font-family: sans-serif;
    text-indent: 20px;
    height: 30px;
  }
  .dark-i {
    background-color: rgb(51, 51, 51);
    color: white;
    border: 1px solid rgb(122, 122, 122);
  }
  input:focus {
    outline: none;
    border: 1px solid rgb(0, 98, 255);
    text-decoration: none;
    text-decoration-style: none;
  }
  input {
    text-decoration: none;
  }
</style>
