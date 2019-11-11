<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3">
        <button @click="addNewText" class='btn btn-primary'>Добавить текст</button>
        <draggable>
          <div class="mt-2" v-for="(text, ind) in scene.texts" :key="'text' + ind">
            <span>{{text.title}}</span>
            <button class="btn btn-danger ml-2" @click="removeText(text)">X</button>
            <button class="btn btn-primary ml-2" @click="editText(text)">E</button>
          </div>
        </draggable>
      </div>
      <div class="col">
        <textarea v-model="textEdit.value" rows="10" cols="80"></textarea>
      </div>
      <div class="col-3">
        <label for="">Заголовок</label><br>
        <input type="text" v-model="textEdit.title">
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'NovelTextEditor',
  components: { draggable },
  props: ['scene'],
  data () {
    return {
      textEdit: {}
    }
  },
  created () {
    this.onSceneChange()
  },
  watch: {
    scene () {
      this.onSceneChange()
    }
  },
  methods: {
    onSceneChange () {
      this.textEdit = {}
      if (!this.scene.texts) {
        this.scene.texts = []
      }
      if (this.scene.texts && this.scene.texts.length) {
        this.textEdit = this.scene.texts[0]
      }
    },
    addNewText () {
      this.scene.texts.push({
        title: 'Текст' + this.scene.texts.length,
        value: ''
      })
      this.$forceUpdate()
    },
    removeText (text) {
      const textIndex = this.scene.texts.indexOf(text)
      this.scene.texts.splice(textIndex, 1)
      if (this.textEdit === text) {
        this.textEdit = {}
      }
      this.$forceUpdate()
    },
    editText (text) {
      this.textEdit = text
    },
    arrowClick (arrow) {
      let curIndex = this.scene.texts.indexOf(this.textEdit)
      let nextIndex
      if (arrow === 'up') {
        nextIndex = curIndex - 1
      } else if (arrow === 'down') {
        nextIndex = curIndex + 1
      }
      if (nextIndex >= 0 && nextIndex < this.scene.texts.length) {
        let temp = this.scene.texts[curIndex]
        this.scene.texts[curIndex] = this.scene.texts[nextIndex]
        this.scene.texts[nextIndex] = temp
        console.log('this.scene.texts', this.scene.texts)
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  ul {
    list-style-type: none;
    padding: 0;
  }
</style>
