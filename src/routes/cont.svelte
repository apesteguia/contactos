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

  const toggleCrear = () => {
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
</script>

<div class="app">
  <button on:click={toggleCrear}>crear</button>
  <button on:click={borrarTodo}>Borrar Todo</button>
  {#if crear === true}
    <form class="crear" on:submit={handleSubmit}>
      <label for="">Nombre de usuario</label>
      <input bind:value={contacto.usuario} type="text" />
      <label for="">Nombre</label>
      <input type="text" bind:value={contacto.nombre} />
      <label for="">Apellido</label>
      <input type="text" bind:value={contacto.apellido} />
      <label for="">Telefono</label>
      <input type="text" bind:value={contacto.telefono} />
      <label for="">Correo</label>
      <input type="text" bind:value={contacto.correo} />
      <button>Submit</button>
    </form>
  {/if}
  {#each contactos as c}
    <h3>{c.nombre}</h3>
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
    height: 550px;
    top: 70px;
  }
  :global(body.dark-mode) > .crear {
    background-color: red;
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
  form {
    display: flex;
    flex-direction: column;
    margin-top: 100px;
  }
</style>
