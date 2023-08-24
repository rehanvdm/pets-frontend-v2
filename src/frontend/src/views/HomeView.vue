<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Api} from "@rehanvdm/pets-api-v2"

const apiBaseUrl = import.meta.env.VITE_API_URL;
const api = new Api({
  baseUrl: apiBaseUrl,
  // baseApiParams: {
  //   headers: {
  //     "Authorization": "<YOUR TOKEN HERE, JUST AN EXAMPLE>"
  //   }
  // }
});

const consoleRef = ref();
onMounted(async () => {
  const htmlConsole = (html: any) => consoleRef.value.innerHTML = consoleRef.value.innerHTML + html + "<br>";
  const formattedObj= (obj: any) => JSON.stringify(obj, null, 2);
  try
  {
    htmlConsole("await api.pets.getPets();");
    let pets = await api.pets.petGetAll();
    htmlConsole(formattedObj(pets.data));

    htmlConsole("");

    htmlConsole("await api.pets.getPetById(1);");
    let pet = await api.pets.petGet(1);
    htmlConsole(formattedObj(pet.data));

    htmlConsole("");

    htmlConsole("await api.pets.petCreate(...);");
    let petsAfterCreate = await api.pets.petCreate({name: "Fido" + Date.now(), type: "dog"});
    htmlConsole(formattedObj(petsAfterCreate.data));
  }
  catch (err)
  {
    console.log("ERR", err, formattedObj(err));
    htmlConsole(err);
  }
});

</script>

<template>
  <main>
    <div style="height: 2000px; width: 800px; background: lightgrey;">
      <pre ref="consoleRef" style="padding: 10px"></pre>
    </div>
  </main>
</template>
