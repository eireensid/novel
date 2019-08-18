<template>
  <div ref="root" @click="rootClick" class="novel-scene">
    <img :src="medias[scene.bgImgPath]" :style="bgImgStyle">
    <div class="container text-panel">
      <div class="row">
        <div class="col text-center">
          {{ curText.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'novel-scene',
  props: ['scene', 'width', 'height', 'medias'],
  data () {
    return {
      curText: '',
      textIndex: 0
    }
  },
  created () {
    this.onSceneChange()
    document.addEventListener('click', this.playAudioSound)
  },
  beforeDestroy () {
    if (window.sound) {
      window.sound.pause()
    }
  },
  watch: {
    scene: {
      handler (newScene) {
        this.onSceneChange()
      },
      deep: true
    }
  },
  computed: {
    bgImgStyle () {
      let res = {
        width: '100%',
        height: '100%'
      }
      if (this.width) {
        res.width = this.width + 'px'
      }
      if (this.height) {
        res.height = this.height + 'px'
      }
      return res
    }
  },
  methods: {
    playAudioSound () {
      let base64 = this.medias[this.scene.audioPath]
      this.playAudioByBase64(base64)
    },
    playAudioByBase64 (base64) {
      if (window.sound) {
        window.sound.pause()
      }
      if (base64) {
        window.sound = new Audio()
        window.sound.src = base64
        window.sound.loop = 'loop'
        window.sound.play()
        document.removeEventListener('click', this.playAudioSound)
      }
    },
    rootClick () {
      if (this.scene.texts && this.textIndex < this.scene.texts.length) {
        this.curText = this.scene.texts[this.textIndex++]
      } else {
        this.$emit('next-scene')
      }
    },
    onSceneChange () {
      this.curText = ''
      this.textIndex = 0
      this.playAudioSound()
    }
  }
}
</script>

<style scoped>
  .novel-scene {
    position: relative;
  }
  .text-panel {
    background: black;
    opacity: 0.5;
    position: absolute;
    width: 100%;
    height: 25%;
    top: 75%;
    color: white;
    font-weight: bold;
  }
</style>
