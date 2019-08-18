<script>
import _ from 'lodash'

export default {
  methods: {
    saveStoreNovelList () {
      window.novelList = _.cloneDeep(this.novelList)
    },
    getStoreNovelList () {
      return window.novelList
    }
  }
}
</script>
