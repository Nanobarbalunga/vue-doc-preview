<template>
  <VueDocPreview :value="docValue" :type="docType" 
    :office-styler-ui="styleUi" />
</template>

<script>
import VueDocPreview from './components/VueDocPreview.vue'

export default {
  name: 'app',
  components: {
    VueDocPreview
  },

  data() {
    return {
      docValue: 'newteach.pbworks.com%2Ff%2Fele%2Bnewsletter.docx',
      docType: 'office',
      styleUi: "EmbededView",
      // styleUi: "FullScreen",
      // styleUi: "Interactive",
    }
  },

}
</script>

<style>
div[aria-label="Pop-out"] {
display: none;
 }
div[aria-label="toolbar"] {
width: 52px;
}      

div.ms-Fabric{
  display: none;
}
</style>
