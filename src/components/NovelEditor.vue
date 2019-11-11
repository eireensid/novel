<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3">
        <label for="">Глава</label><br>
        <select v-model="curChapter">
          <option :value="''" :key="'chapter1'">Без главы</option>
          <option v-for="chapter in novel.chapters" :value="chapter" :key="'chapter1' + chapter">{{ chapter }}</option>
        </select><br>
        <button @click="addNewScene" class='btn btn-primary mt-2'>Добавить сцену</button>
        <draggable v-model="novel.scenes">
          <div class="mt-2" v-for="(scene, ind) in curScenes" :key="'scene' + ind">
            <span>{{scene.title}}</span>
            <button class="btn btn-danger ml-2" @click="removeScene(scene)">X</button>
            <button class="btn btn-primary ml-2" @click="editScene(scene)">E</button>
          </div>
        </draggable>
      </div>
      <div class="col">
        <NovelScene @next-scene="onNextScene" :scene="sceneEdit" :medias="novel.medias" height="300"/>
      </div>
      <div class="col-3">
        <label for="">Заголовок</label><br>
        <input type="text" v-model="sceneEdit.title"><br>
        <label for="">Глава</label><br>
        <select v-model="sceneEdit.chapter">
          <option :value="''" :key="'chapter2'">Без главы</option>
          <option v-for="chapter in novel.chapters" :value="chapter" :key="'chapter2' + chapter">{{ chapter }}</option>
        </select><br>
        <label for="">Изменить фон</label><br>
        <input type="file" accept="image/*" @change="changeFilePath($event, 'img')"><br>
        <label for="">Изменить аудио</label><br>
        <input type="file" accept="audio/*" @change="changeFilePath($event, 'audio')"><br>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ul class="nav nav-tabs" ref="tabs">
          <li class="nav-item">
            <a class="nav-link active" @click="selectTab($event, 'text')">Текст</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="selectTab($event, 'sprites')">Спрайты</a>
          </li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
          <div v-show="tab === 'text'">
            <NovelTextEditor :scene="sceneEdit" class="pt-4" />
          </div>
          <div v-show="tab === 'sprites'">bbb</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import NovelScene from './NovelScene'
import NovelTextEditor from './NovelTextEditor'
import draggable from 'vuedraggable'

export default {
  name: 'NovelEditor',
  components: { NovelScene, NovelTextEditor, draggable },
  data () {
    return {
      novel: null,
      novelList: [],
      sceneEdit: {},
      tab: 'text',
      curChapter: ''
    }
  },
  created () {
    let novelId = Number(this.$route.params.id)
    this.novelList = window.novelList
    this.novel = this.novelList.find(el => el.id === novelId)
    console.log('novel', this.novel)
    this.selectFirstSceneEdit()
    if (!this.novel.scenes) {
      this.novel.scenes = []
    }
    if (!this.novel.medias) {
      this.novel.medias = {}
    }
  },
  computed: {
    curScenes () {
      let chapter = this.curChapter
      let scenes = this.novel.scenes
      return scenes.filter(scene => {
        return scene.chapter === chapter
      })
    }
  },
  watch: {
    curChapter () {
      this.selectFirstSceneEdit()
    },
    'sceneEdit.chapter' () {
      this.selectFirstSceneEdit()
    }
  },
  methods: {
    addNewScene () {
      let maxScene = _.maxBy(this.novel.scenes, 'id')
      let id = maxScene ? maxScene.id + 1 : 0
      this.novel.scenes.push({
        id,
        title: 'Сцена' + id,
        bgImgPath: '',
        audioPath: '',
        texts: [],
        chapter: this.curChapter
      })
    },
    removeScene (scene) {
      const sceneIndex = this.novel.scenes.indexOf(scene)
      this.novel.scenes.splice(sceneIndex, 1)
      if (scene.id === this.sceneEdit.id) {
        this.sceneEdit = {}
      }
    },
    editScene (scene) {
      this.sceneEdit = scene
    },
    arrowClick (arrow) {
      let curIndex = this.novel.scenes.indexOf(this.sceneEdit)
      let nextIndex
      if (arrow === 'up') {
        nextIndex = curIndex - 1
      } else if (arrow === 'down') {
        nextIndex = curIndex + 1
      }
      if (nextIndex >= 0 && nextIndex < this.novel.scenes.length) {
        let temp = this.novel.scenes[curIndex]
        this.novel.scenes[curIndex] = this.novel.scenes[nextIndex]
        this.novel.scenes[nextIndex] = temp
        console.log('this.novel.scenes', this.novel.scenes)
        this.$forceUpdate()
      }
    },
    getBase64FromFile (file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = (error) => {
          reject(error)
        }
      })
    },
    async changeFilePath (e, format) {
      console.log('changeFilePath', e)
      let files = e.target.files
      console.log('files', files)
      let file = files[0]
      let fileName = file.name
      console.log('fileName', fileName)
      try {
        let base64 = await this.getBase64FromFile(file)
        this.novel.medias[fileName] = base64
        if (format === 'img') {
          this.sceneEdit.bgImgPath = fileName
        } else if (format === 'audio') {
          this.sceneEdit.audioPath = fileName
        }
        console.log('success this.sceneEdit', this.sceneEdit)
        e.target.value = ''
      } catch (err) {
        console.error('changeFilePath error', err)
      }
    },
    selectTab (event, tab) {
      this.tab = tab
      let ul = this.$refs.tabs
      let activeA = ul.querySelector('.nav-link.active')
      activeA.classList.remove('active')
      event.target.classList.add('active')
    },
    onNextScene () {
      let curIndex = this.curScenes.indexOf(this.sceneEdit)
      curIndex += 1
      if (curIndex < this.curScenes.length) {
        this.sceneEdit = this.curScenes[curIndex]
      }
    },
    selectFirstSceneEdit () {
      if (this.curScenes && this.curScenes.length) {
        this.sceneEdit = this.curScenes[0]
      } else {
        this.sceneEdit = {}
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
