<script lang="ts">
  export let userData = {
    nombre: "",
    email: "",
  };
  export let tema: boolean;
  $: mitema = tema ? "light" : "dark";
</script>

<h1>{userData.nombre}</h1>
<h2>{userData.email}</h2>
