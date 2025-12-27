<template>
  <div class="home-page">
    <TasaCambio />
    <Hero />
    <Products />
    <Location />
    <Contact />
  </div>
</template>

<script>
import TasaCambio from '../components/common/TasaCambio.vue'
import Hero from '../components/sections/Hero.vue'
import Products from '../components/sections/Products.vue'
import Location from '../components/sections/Location.vue'
import Contact from '../components/sections/Contact.vue'

export default {
  name: 'HomeView',
  components: {
    TasaCambio,
    Hero,
    Products,
    Location,
    Contact
  }
}
</script>