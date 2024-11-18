<script setup lang="ts">

// Use the auth composable to interact with authentication state
const { signIn, signOut, getSession, status} = useAuth()
const user = ref(null)

// Fetch user session when the component is mounted
onMounted(async () => {
  const session = await getSession()
  user.value = session?.user || null
})
</script>

<template>
  <div class="page">
    <section class="flex flex-col gap-6">
      <h1>Securing routes using Nuxt Auth</h1>
      <p>
        Wrapping your application with Nuxt Auth ensures all pages are secured.
        Configuring subdomains or rewrites ensures they are all behind an
        authentication wall.
      </p>
    </section>

    <hr class="border-t border-gray-300 my-6" />

    <section class="flex flex-col gap-3">
      <div v-if="status === 'authenticated'" class="flex flex-col gap-3">
        <p>Welcome, {{ user?.role }}!</p>
        <button class="btn" @click="signOut">Sign out</button>
        <ul>
          <li>
            <a href="localhost:3000" target="_blank">
              subdomain.solutions-subdomain-auth.vercel.sh
            </a>
          </li>
          <li>
            <a href="localhost:3000" target="_blank">
              solutions-subdomain-auth.vercel.sh
            </a>
          </li>
        </ul>
      </div>

      <div v-else-if="status === 'loading'" class="text-center">
        <p>Loading...</p>
      </div>

      <div v-else class="m-auto w-fit">
        <button class="btn-lg" @click="signIn('identityserver')">
          Sign in with Identity Server
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
