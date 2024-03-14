<script setup>
defineProps({
    color: String
})
defineEmits(['onClick']);
</script>

<template>
   <div @click="$emit('onClick')" class="btn">
        <i><slot name="icon"></slot></i> 
        <div class="text">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.btn {
    display:flex;
    background: v-bind(color);
    width: fit-content;
    padding:12px;
    border-radius:5px;
    cursor:pointer;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 20px;
  height: 20px;
}

.text {
  flex: 1;
  margin-left: 1rem;
  color: white;
}
</style>