<template>
  <div id="VueDocPreviewRoot" class="root" :style=styler>
    <div v-if="type === 'markdown' || type === 'code'" :style="{'height': '100%', 'width': '100%'}">
      <Markdown :value=actualValue :mdStyle=mdStyle />
    </div>
    <div v-else-if="type === 'text'" :style="{'height': '100%', 'width': '100%'}">
      <TextPreview :value=actualValue :textStyle=textStyle />
    </div>
    <div v-else-if="type === 'office'" :style="styler">
      <Office :value=actualValue :height="officeStylerHeight" :width="officeStylerWidth" />
    </div>
    <div v-else :style="{'height': '100%', 'width': '100%'}">
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
import Markdown from './VueDocPreview/components/Markdown.vue'
import TextPreview from './VueDocPreview/components/TextPreview.vue'
import Office from './VueDocPreview/components/Office.vue'

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
    officeStylerHeight: {
      type: String,
      default: '1000px'
    },
    officeStylerWidth: {
      type: String,
      default: '1000px'
    },
    officeStylerUi: {
      type: String,
      default: ''//EmbededView | FullScreen | Interactive
    },
    height: {
      type: Number,
      default: 90
    },
    width: {
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
    getStyler() {
        return `${this.stylerHeight} ${this.stylerWidth};`	 
    },
    actualValue() {
      //
      /*
      src=http%3A%2F%2Fnewteach%2Epbworks%2Ecom%3A80%2Ff%2Fele%2Bnewsletter%2Edocx
      wdEmbedCode=1
      wdPrint=0" 
      wdStartOn=0
      */
      this.tempValueC()
      if (this.type === 'office') {
        const ui=this.officeStylerUi.length?`${this.officeStylerUi}`:'';
        let options='';
        let mode='';
        switch(ui.toLowerCase()){
          case 'embededview':
          case 'embeded':
          case 'embed':
            mode='embed';
            break;
          // case 'fullscreen':
          //   mode='fullscreen';
          //   break;
          // case 'interactive':
          //   mode='interactive';
          //   break;
          // case 'print':
          //   mode='print';
          //   break;
          default:
            mode='view';
        }
        console.log(mode)
        return `https://view.officeapps.live.com/op/${mode}.aspx?src=${this.tempValue}${options}`
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
        this.stylerHeight = `height: ${height}px`
      } else {
        if (this.type === 'office') {
          const contentHeight = this.getClientHeight() * height / 100
          this.stylerHeight = `height: ${contentHeight}px`
        } else {
          this.stylerHeight = `height: ${height}%`
        }
      }
    },
    getClientHeight() {
      const clientHeight = document.documentElement.clientHeight
      return clientHeight
    },
    setWidth() {
      let width = this.width
      if (width < 0) width = 0
      if (width > 100) {
        this.stylerWidth = `width: ${width}px`
      } else {
        if (this.type === 'office') {
          const contentWidth = this.getClientWidth() * width / 100
          this.stylerWidth = `width: ${contentWidth}px`
        } else {
          this.stylerWidth = `width: ${width}%`
        }
      }
    },

    getClientWidth() {
      const clientWidth = document.documentElement.clientWidth
      return clientWidth
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
      this.setWidth()
    }
  },
}
</script>

<style scoped>
.root {
  height: 100%;
}
</style>
