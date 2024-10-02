<template>
  <div ref="iframeContainer" :style="{'height': height, 'width': width}">
    <iframe 
      ref="iframe"
      :src="value" 
      frameborder="0" 
      :width="containerWidth"
      :height="containerHeight"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'Office',
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: [String, Number],
      default: '100%'
    },
    width: {
      type: [String, Number],
      default: '100%'
    }
  },
  data() {
    return {
      containerWidth: '100%',  // Valori iniziali
      containerHeight: '100%'
    }
  },
  mounted() {
    this.setIframeSize(); // Setta inizialmente la dimensione
    window.addEventListener('resize', this.setIframeSize); // Aggiunge un listener per aggiornare la dimensione quando la finestra viene ridimensionata
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.setIframeSize); // Rimuove il listener quando il componente viene smontato
  },
  methods: {
    applyStyleToIframe() {
      
    },
    setIframeSize() {
      const container = this.$refs.iframeContainer;
      
      if (container) {
        // Imposta l'altezza e la larghezza in base alle dimensioni del contenitore
        this.containerWidth = `${container.offsetWidth}px`;
        this.containerHeight = `${container.offsetHeight}px`;
      }
    }
  }
}
</script>

<style scoped>
div {
  height: 100%; /* Per fare in modo che il contenitore div si espanda al massimo disponibile */
  width: 100%;
}
iframe {
  display: block; /* Per evitare lo spazio bianco sotto l'iframe (comportamento inline per iframe) */
}
</style>
