import { defineComponent, toRefs } from 'vue'

export default defineComponent({
  name: 'MainContent',
  props: {
    wrapClass: {
      type: String,
      default: 'flex'
    }
  },
  setup(props, { slots }) {
    const { wrapClass } = toRefs(props)

    return () =>
      <div class={wrapClass.value}>
        {
          slots.default ? slots.default() : ''
        }
      </div>
  },
})
