<script setup>
const { data } = await useFetch('/api/other')
</script>

<template>
  <div>
    <p>Page B</p>

    <teleport to="body">
      <div style="position:fixed;bottom:0;left:0;right:0;background:#1e293b;color:#fff;padding:16px;text-align:center">
        Footer
      </div>
    </teleport>
  </div>
</template>
