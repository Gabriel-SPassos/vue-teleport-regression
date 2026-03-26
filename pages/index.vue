<script setup>
const { data } = await useFetch('/api/something')
const items = ref([1, 2, 3])
const isNavigating = ref(false)
const showSplash = ref(false)

const navigate = async () => {
  isNavigating.value = true
  showSplash.value = true

  try {
    await new Promise(r => setTimeout(r, 100))
    showSplash.value = false
    await navigateTo('/page-b')
    items.value = []
  } finally {
    isNavigating.value = false
  }
}
</script>

<template>
  <div>
    <button @click="navigate">Go</button>
    <p>Items: {{ items.length }}</p>

    <teleport to="body">
      <Transition name="fade">
        <div v-if="items.length > 0" style="position:fixed;bottom:0;left:0;right:0;background:#333;color:#fff;padding:16px">
          <SomeComponent />
        </div>
      </Transition>
    </teleport>

    <teleport to="body">
      <Transition name="fade">
        <div v-if="showSplash" style="position:fixed;inset:0;background:rgba(0,0,0,.5);display:grid;place-items:center">
          <SomeComponent />
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity .2s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
