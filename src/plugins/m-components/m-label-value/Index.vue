<template>
  <div class="row">
    <div class="label">
      {{ label }}
    </div>
    <div class="value">
      <template v-if="value">
        {{ value }}
      </template>
      <template v-else>
        <slot name="value" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  label: {type: [String, Number]},
  value: {type: [String, Number], required: false, default: ""},
})
</script>

<style scoped lang="scss">
.row {
  display: flex;
  border-bottom: 1px solid #EEEEEE;
  padding: 6px 0;
  margin-bottom: 12px;
  line-height: 1.5em;

  .label {
    flex-shrink: 0;
    width: 100px;
    text-align: right;
  }

  .value {
    flex: 1;
    margin: 0 40px;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
  }
}
</style>