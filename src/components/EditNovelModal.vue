<template>
  <b-modal
    v-model="isOpen"
    centered
    size="lg"
    title="Редактирование новелл"
    @ok="saveModal"
    @hide="closeModal"
    @show="showModal">
    <div class="container-fluid">
      <div class="row no-gutters">
        <div class="col">
          <label>Название новеллы</label>
          <input class='form-control' type="text" v-model='novelEdit.title'>
        </div>
      </div>
      <div class="row no-gutters mt-2">
        <div class="col">
          <label>Добавить главу</label>
          <input class='form-control' type="text" v-model='chapterNameAdd'>
        </div>
        <div class="col-2 d-flex justify-content-end align-items-end ml-2">
          <button class='btn btn-success form-control' @click='addChapter'>Добавить</button>
        </div>
      </div>
      <div v-show='errorAddChapter' class="row no-gutters mt-2">
        <div class="col d-flex justify-content-center alert alert-warning">
          {{ errorAddChapter }}
        </div>
      </div>
      <div class="row no-gutters mt-2">
        <div class="col d-flex justify-content-center">
          <h3>Список глав</h3>
        </div>
      </div>
      <div v-for="(chapter, ind) in novelEdit.chapters" :key="'chapter' + ind" class="row no-gutters mt-2">
        <div class="col">
          {{ chapter }}
        </div>
        <div class="col-1 d-flex justify-content-center px-2">
          <button class='btn btn-danger form-control' @click='removeChapter(ind)'>X</button>
        </div>
      </div>
      <div class="row no-gutters mt-2">
        <label>Добавить персонажа</label>
      </div>
      <div class="row no-gutters mt-2">
        <div class="col-6">
          <input class='form-control' type="text" :style="{ color: personAdd.color }" v-model='personAdd.name'>
        </div>
        <div class="col-4 d-flex justify-content-center px-2">
          <button class='btn btn-secondary form-control' @click='isShowAddPersonColor = !isShowAddPersonColor'>
            {{ isShowAddPersonColor ? 'Скрыть палитру' : 'Показать палитру' }}
          </button>
        </div>
        <div class="col-2 d-flex justify-content-end">
          <button class='btn btn-success form-control' @click='addPerson'>Добавить</button>
        </div>
      </div>
      <div class="row no-gutters mt-2">
        <div class="col-4 offset-6 d-flex justify-content-center">
          <chrome-picker v-show='isShowAddPersonColor' :value="personAdd.color" @input="colors => changeColorPerson(colors, personAdd)"></chrome-picker>
        </div>
      </div>
      <div v-show='errorAddPerson' class="row no-gutters mt-2">
        <div class="col d-flex justify-content-center alert alert-warning">
          {{ errorAddPerson }}
        </div>
      </div>
      <div class="row no-gutters mt-2">
        <div class="col d-flex justify-content-center">
          <h3>Список персонажей</h3>
        </div>
      </div>
      <div v-for="(person, ind) in novelEdit.persons" :key="'person' + ind" class="row no-gutters mt-2">
        <div class="col-5">
          <input class='form-control' type="text" :style="{ color: person.color }" v-model='person.name'>
        </div>
        <div class="col-3 d-flex justify-content-center px-2">
          <button class='btn btn-secondary form-control' @click='tooglePersonColorShow(ind)'>
            {{ personShowColor[ind] ? 'Скрыть палитру' : 'Показать палитру' }}
          </button>
        </div>
        <div class="col-3 d-flex justify-content-end">
          <chrome-picker v-show='personShowColor[ind]' :value="person.color" @input="colors => changeColorPerson(colors, person)"></chrome-picker>
        </div>
        <div class="col-1 d-flex justify-content-center px-2">
          <button class='btn btn-danger form-control' @click='removePerson(ind)'>X</button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import _ from 'lodash'
import { Chrome } from 'vue-color'

export default {
  name: 'EditNovelModal',
  components: { 'chrome-picker': Chrome },
  props: ['active', 'novel'],
  data () {
    return {
      novelEdit: {},
      personAdd: {
        name: '',
        color: '#FFF'
      },
      errorAddPerson: '',
      isShowAddPersonColor: false,
      personShowColor: [],
      chapterNameAdd: '',
      errorAddChapter: ''
    }
  },
  computed: {
    isOpen: {
      get () {
        return this.active
      },
      set () {}
    }
  },
  methods: {
    saveModal () {
      console.log('saveModal', this.novelEdit)
      this.$emit('save', _.cloneDeep(this.novelEdit))
    },
    closeModal () {
      this.$emit('close')
    },
    showModal () {
      this.novelEdit = _.cloneDeep(this.novel)
      this.personShowColor = _.times(this.novelEdit.persons.length, _.constant(false))
    },
    addChapter () {
      if (!this.novelEdit.chapters) {
        this.novelEdit.chapters = []
      }
      if (this.chapterNameAdd) {
        let chapter = this.novelEdit.chapters.find(chapterName => chapterName === this.chapterNameAdd)
        if (!chapter) {
          this.novelEdit.chapters.push(this.chapterNameAdd)
          this.chapterNameAdd = ''
          this.errorAddChapter = ''
        } else {
          this.errorAddChapter = 'Глава с таким названием уже существует'
        }
      } else {
        this.errorAddChapter = 'Название главы не задано'
      }
    },
    addPerson () {
      if (this.personAdd.name) {
        let person = this.novelEdit.persons.find(p => p.name === this.personAdd.name)
        if (!person) {
          this.novelEdit.persons.push(_.cloneDeep(this.personAdd))
          this.personShowColor = _.times(this.novelEdit.persons.length, _.constant(false))
          this.isShowAddPersonColor = false
          this.personAdd.name = ''
          this.personAdd.color = '#FFF'
          this.errorAddPerson = ''
        } else {
          this.errorAddPerson = 'Персонаж с таким именем уже существует'
        }
      } else {
        this.errorAddPerson = 'Имя персонажа не должно быть пустым'
      }
    },
    changeColorPerson (colors, person) {
      person.color = colors.hex8
    },
    tooglePersonColorShow (ind) {
      console.log('tooglePersonColorShow', ind)
      console.log(this.personShowColor)
      this.personShowColor[ind] = !this.personShowColor[ind]
      console.log(this.personShowColor)
      this.$forceUpdate()
    },
    removePerson (ind) {
      this.novelEdit.persons.splice(ind, 1)
      this.$forceUpdate()
    },
    removeChapter (ind) {
      console.log('removeChater', ind)
      this.novelEdit.chapters.splice(ind, 1)
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
