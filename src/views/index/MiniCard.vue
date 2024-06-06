<template>
    <div class="m-flex-col m-flex-c m-gap10 m-border-light2 m-border-radius-small3 m-w200 m-h100">
        <div class="m-text-light m-font16">{{label}}</div>
        <div class="m-font20">{{value}}</div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    label: {type: [String, Number], default: ""},
    value: {type: [String, Number], default: ""},
})
</script>