<template>
  <div
    class="modal fade"
    id="addCommentModal"
    tabindex="-1"
    aria-labelledby="addCommentModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addCommentModalLabel">Add Comment for {{ game.name }}</h5>

          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click.prevent="$emit('cancelAddComment')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="user">
            <div class="form-group">
              <textarea
                type="text"
                class="form-control"
                id="comment"
                placeholder="Comment"
                v-model="newComment"
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-dismiss="modal"
            @click.prevent="$emit('cancelAddComment', resetCommentRef())"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-dismiss="modal"
            @click.prevent="onCommentSubmit(newComment)"
          >
            Save Comment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { GameCollection } from '@/services/fireUserData'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'

const userStore = useUserStore()
const newComment = ref<string>('')
const toast = useToast()

const props = defineProps<{
  game: GameCollection
}>()

const onCommentSubmit = async (comment: string) => {
  const commentAdded = await userStore.updateGameComment(props.game, comment)
  if (commentAdded) {
    toast.add({
      severity: 'success',
      summary: 'Comment Added',
      detail: `Comment added for ${props.game.name}`,
      life: 3000
    })
    resetCommentRef()
  } else {
    toast.add({
      severity: 'error',
      summary: 'Comment Not Added',
      detail: `Comment not added for ${props.game.name}`,
      life: 3000
    })
  }
}

const resetCommentRef = () => {
  newComment.value = ''
}

onMounted(() => {
  newComment.value = props.game.comment
})
</script>

<style lang="scss" scoped></style>
