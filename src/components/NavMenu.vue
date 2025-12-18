<template>
  <div class="nav-menu">
    <ul class="nav">
      <li v-for="item in menuItems" :key="item.id" class="menu-button">
        <NavMenuItem :item="item" :level="0"/>
      </li>
    </ul>
  </div>
</template>

<script>
import NavMenuItem from './NavMenuItem.vue';

export default {
  name: 'NavMenu',
  components: {
    NavMenuItem
  },
  props: {
    menuItems: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.nav-menu {
  display: flex;
  flex-direction: row;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>