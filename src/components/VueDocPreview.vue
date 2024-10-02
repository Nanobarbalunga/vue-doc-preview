<template>
  <div id="VueDocPreviewRoot" class="root" :style=styler>
    <div v-if="type === 'markdown' || type === 'code'">
      <Markdown :value=actualValue :mdStyle=mdStyle />
    </div>
    <div v-else-if="type === 'text'">
      <TextPreview :value=actualValue :textStyle=textStyle />
    </div>
    <div v-else-if="type === 'office'">
      <Office :value=actualValue />
    </div>
    <div v-else>
      <div>{{ errorText }}</div>
    </div>
  </div>
</template>

<script>
//-------------------------------------------------------------
/* Need to install:
      https://highlightjs.org/
    npm install highlight.js
      https://axios-http.com/docs/intro
    npm install axios  
      https://marked.js.org/
    npm install marked  
//-------------------------------------------------------------*/
import axios from 'axios'
import Markdown from './components/Markdown.vue'
import TextPreview from './components/TextPreview.vue'
import Office from './components/Office.vue'

const defaultRequestConfig = {
  method: 'get',
  responseType: 'blob'
}

export default {
  name: 'app',
  components: {
    Markdown,
    TextPreview,
    Office,
    HelloWorld
  },
  props: {
    errorText: {
      type: String,
      default: 'Prop type error, Type must be markdown/office/text/code!'
    },
    type: {
      type: String,
      default: 'md'
    },
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 90
    },
    language: {
      type: String,
      default: ''
    },
    mdStyle: {
      type: Object,
      default: null
    },
    textStyle: {
      type: Object,
      default: null
    },
    url: {
      type: String,
      default: ''
    },
    requestConfig: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      tempValue: '',
      parseComponent: 'Markdown',
      styler: ''
    }
  },
  watch: {
    type(val) {
      this.updateType()
    }
  },
  computed: {
    actualValue() {
      this.tempValueC()
      if (this.type === 'office') {
        return `https://view.officeapps.live.com/op/view.aspx?src=${this.tempValue}`
      } else if (this.type === 'code' && this.language) {
        return `\`\`\`${this.language}\n${this.tempValue}\n\`\`\``
      } else {
        return this.tempValue
      }
    }
  },
  mounted() {
    this.updateType()
  },
  methods: {
    tempValueC() {
      if (this.value) {
        this.tempValue = this.value
      } else {
        if (this.type !== 'office') {
          let self = this
          Object.assign(defaultRequestConfig, this.requestConfig, { url: this.url })
          this.download(defaultRequestConfig).then(data => {
            self.tempValue = data
          }).catch(err => {
            self.tempValue = 'Download Error!'
            console.error(err)
          })
        } else {
          this.tempValue = this.url
        }
      }
    },
    download(config) {
      return new Promise((resolve, reject) => {
        axios(config).then(res => {
          const reader = new FileReader()
          reader.readAsText(new Blob([res.data]))
          reader.onload = function () {
            resolve(reader.result)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    setHeight() {
      let height = this.height
      if (height < 0) height = 0
      if (height > 100) {
        this.styler = `height: ${height}px`
      } else {
        if (this.type === 'office') {
          const contentHeight = this.getClientHeight() * height / 100
          this.styler = `height: ${contentHeight}px`
        } else {
          this.styler = `height: ${height}%`
        }
      }
    },
    getClientHeight() {
      const clientHeight = document.documentElement.clientHeight
      return clientHeight
    },
    updateType() {
      switch (this.type) {
        case 'markdown':
          this.parseComponent = 'Markdown'
          break
        case 'text':
          this.parseComponent = 'TextPreview'
          break
        case 'office':
          this.parseComponent = 'Office'
          break
        case 'code':
          this.parseComponent = 'Markdown'
          break
      }
      this.setHeight()
    }
  },
}
</script>

<style scoped>
.root {
  height: 100%;
}
</style>
