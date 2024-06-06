<template>
    <div class="space" :style = "{width, height}"/>
</template>

<script setup lang="ts">
defineProps({
    width: {
        type: String,
        default: '20px',
    },
    height: {
        type: String,
        default: '20px',
    },
})
</script>