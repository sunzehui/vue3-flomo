<script lang="tsx" seutp>
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'User',
  setup() {
    return () => <RouterView />
  },
})
</script>

