<template>
  <div class="container">
    <div class="row mt-2">
      <div class="col d-flex justify-content-center">
        <h1>Создать новеллу</h1>
      </div>
    </div>
    <div class="row mb-2">
      <div class="col">
        <input class="form-control" v-model="newTitle" type="text" @keyup.enter="addNovel">
      </div>
    </div>
    <div class="row mb-4">
      <div class="col">
        <button class="btn btn-success" @click="addNovel">Создать</button>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col d-flex justify-content-center">
        <h3>Cписок новелл</h3>
      </div>
    </div>
    <div class="row mb-2" v-for="(novel, ind) in novelList" :key="'novel' + ind">
      <div class="col-7 d-flex align-items-center">
        <span class="novel-title">{{novel.title}}</span>
      </div>
      <div class="col-5 d-flex align-items-center justify-content-end">
        <button class="btn btn-primary" @click="goToEditor(novel)">Перейти в редактор</button>
        <button class="btn btn-success ml-2" @click="editNovel(novel)">Параметры</button>
        <button class="btn btn-danger ml-2" @click="removeNovel(novel)">Удалить</button>
      </div>
    </div>
    <EditNovelModal :active='isEditModal' :novel='novelEdit' @close='isEditModal=false' @save='saveNovel' />
  </div>
</template>

<script>
import _ from 'lodash'
import EditNovelModal from './EditNovelModal'

export default {
  name: 'NovelList',
  components: { EditNovelModal },
  data () {
    return {
      newTitle: '',
      novelList: [],
      isEditModal: false,
      novelEdit: null
    }
  },
  created () {
    this.novelList = window.novelList
  },
  methods: {
    addNovel () {
      let maxNovel = _.maxBy(this.novelList, 'id')
      this.novelList.push({
        id: maxNovel ? maxNovel.id + 1 : 0,
        title: this.newTitle,
        chapters: [],
        persons: [],
        scenes: [],
        medias: {}
      })
      this.newTitle = ''
    },
    removeNovel (novel) {
      const novelIndex = this.novelList.indexOf(novel)
      this.novelList.splice(novelIndex, 1)
    },
    editNovel (novel) {
      console.log('editNovel', novel)
      this.novelEdit = _.cloneDeep(novel)
      this.isEditModal = true
    },
    goToEditor (novel) {
      this.$router.push('editor/' + novel.id)
    },
    saveNovel (novel) {
      console.log('saveNovel', novel)
      let editIndex = this.novelList.findIndex(n => n.id === novel.id)
      console.log('editIndex', editIndex)
      this.novelList[editIndex] = _.cloneDeep(novel)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
