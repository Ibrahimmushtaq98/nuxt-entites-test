<script setup lang="ts">

// Use the auth composable to interact with authentication state
const { signIn, signOut, getSession, status, data} = useAuth()
const user = ref(null)

// Fetch user session when the component is mounted
onMounted(async () => {
  const session = await getSession()
  user.value = session?.user || null
})

const handleLogin = async () => {
  await signIn('github')
}
</script>

<template>
  <div class="page">
    <section class="flex flex-col gap-6">
      <h1>Nuxt Auth</h1>
    </section>

    <hr class="border-t border-gray-300 my-6" />

    <section class="flex flex-col gap-3">
      <div v-if="status === 'authenticated'" class="flex flex-col gap-3">
        <p>Logged in!</p>
        <p>{{ data }}</p>
        <button class="btn" @click="signOut()">Sign out</button>
      </div>

      <div v-else-if="status === 'loading'" class="text-center">
        <p>Loading...</p>
      </div>

      <div v-else class="m-auto w-fit">
        <button class="btn-lg" @click="handleLogin()">
          Sign in with Github
        </button>
      </div>
    </section>
  </div>
</template>

<style>
.page {
  padding: 2rem;
}

.btn {
  background-color: #0070f3;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}

.btn-lg {
  background-color: #0070f3;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.25rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}

.btn:hover,
.btn-lg:hover {
  background-color: #005bb5;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin: 0.5rem 0;
}
</style>
