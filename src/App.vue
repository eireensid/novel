<template>
  <div v-if="isLoad" id="app">
    <div id="nav">
      <router-link to="/">Список новелл</router-link>
      <font-awesome-icon icon="save" @click="saveNovelListOnServer" class="save-icon"/>
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      isLoad: false
    }
  },
  created () {
    axios.get('http://localhost:6700/novelList')
      .then(res => {
        console.log('get', res)
        window.novelList = JSON.parse(res.data)
        this.isLoad = true
      })
      .catch(() => console.error('get'))
  },
  methods: {
    saveNovelListOnServer () {
      let novelList = JSON.stringify(window.novelList || [])
      axios.post('http://localhost:6700/novelList', { novelList: novelList })
        .then(() => console.log('save'))
        .catch(() => console.error('save'))
    }
  }
}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  #nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
  .modal-backdrop {
    background: #0000007a !important;
  }
  .save-icon {
    margin-left: 10px;
    font-size: 25px;
  }
</style>
