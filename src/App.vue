<template>
    <VueDocPreview :value="docValue" :type="docType" 
    aoffice-styler-ui="EmbededView" 
    office-styler-ui="FullScreen" 
    aboffice-styler-ui="Interactive" 
    />
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
    }
  },
  
}
</script>

