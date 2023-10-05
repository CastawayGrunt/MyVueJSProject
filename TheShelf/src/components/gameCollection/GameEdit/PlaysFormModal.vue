<template>
  <div
    class="modal fade"
    id="addGamePlayModal"
    tabindex="-1"
    aria-labelledby="addGamePlayModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addGamePlayModalLabel">Add Play</h5>

          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click.prevent="$emit('cancelAddPlay')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <form @submit="onSubmit" id="playForm">
            <div class="field d-flex flex-column">
              <label for="datePlayed">Date Played</label>
              <Calendar
                inputId="datePlayed"
                id="datePlayed"
                v-bind="datePlayed"
                :class="{ 'p-invalid': errors.datePlayed }"
                aria-describedby="date-error"
                showIcon
              />
              <small v-if="errors.datePlayed" class="p-error" id="text-error">{{
                errors.datePlayed || '&nbsp;'
              }}</small>
            </div>
            <div class="field">
              <label for="location">Location</label>
              <InputText
                id="location"
                v-bind="location"
                type="text"
                :class="{ 'p-invalid': errors.location }"
                class="w-100"
                aria-describedby="text-error"
                :pt="{ root: { maxlength: '50' } }"
              />
              <small v-if="errors.location" class="p-error" id="text-error">{{
                errors.location || '&nbsp;'
              }}</small>
            </div>
            <FieldArray name="players">
              <fieldset class="InputGroup" v-for="(field, idx) in fields" :key="field.key">
                <hr class="border-primary" />
                <div class="form-group">
                  <div class="field">
                    <label
                      class="mr-2"
                      :for="`name_${idx}`"
                      v-html="`Player ${idx + 1} Name`"
                    ></label>
                    <Field
                      class="mr-2 rounded"
                      style="border: 1px solid #ced4da"
                      :id="`name_${idx}`"
                      :name="`players[${idx}].name`"
                      v-slot="{ field }"
                    >
                      <InputText
                        :id="`name_${idx}`"
                        v-bind="field"
                        type="text"
                        class="w-100"
                        aria-describedby="text-error"
                        :pt="{ root: { maxlength: '50' } }"
                      />
                    </Field>
                    <ErrorMessage class="text-danger" :name="`players[${idx}].name`" />
                  </div>
                </div>
                <div class="form-group">
                  <div class="field">
                    <label class="mr-2" :for="`score_${idx}`">Score</label>
                    <Field
                      class="mr-2 rounded"
                      style="border: 1px solid #ced4da"
                      :id="`score_${idx}`"
                      :name="`players[${idx}].score`"
                      v-slot="{ field }"
                    >
                      <InputText
                        :id="`score_${idx}`"
                        v-bind="field"
                        type="text"
                        class="w-100"
                        aria-describedby="text-error"
                        :pt="{ root: { maxlength: '10' } }"
                      />
                    </Field>
                    <ErrorMessage class="text-danger" :name="`players[${idx}].score`" />
                  </div>
                </div>

                <div class="d-flex justify-content-between justify-content-center">
                  <div class="d-flex justify-content-center">
                    <Field
                      :name="`players[${idx}].winner`"
                      type="checkbox"
                      :value="true"
                      v-slot="{ field }"
                    >
                      <label class="mr-2" :for="`winner_${idx}`">Winner</label>
                      <input
                        :id="`winner_${idx}`"
                        class="checkbox"
                        type="checkbox"
                        v-bind="field"
                        :value="true"
                      />
                    </Field>
                  </div>
                  <button
                    type="button"
                    class="btn btn-danger btn-user md:ml-2"
                    @click.prevent="remove(idx)"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </fieldset>
              <button
                type="button"
                class="btn btn-primary btn-block mt-2"
                @click.prevent="push({ name: '', score: '', winner: false })"
              >
                Add Player
              </button>
            </FieldArray>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-dismiss="modal"
            @click.prevent="$emit('hideForm', resetForm())"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click.prevent="onSubmit()"
            form="playForm"
            data-dismiss="modal"
          >
            Save play
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { GameCollection } from '@/services/fireUserData'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import { useUserStore } from '@/stores/user'
import { useToast } from 'primevue/usetoast'
import { useForm, FieldArray, useFieldArray, ErrorMessage, Field } from 'vee-validate'
import * as yup from 'yup'
import { Timestamp } from 'firebase/firestore'

const userStore = useUserStore()
const toast = useToast()

const props = defineProps<{
  game: GameCollection
}>()

const schema = yup.object().shape({
  datePlayed: yup.date().required().label('Date played'),
  location: yup.string().required().max(50).label('Location'),
  players: yup.array().of(
    yup.object().shape({
      name: yup.string().required().max(50).label('Name'),
      score: yup.string().nullable().max(10).label('Score'),
      winner: yup
        .boolean()
        .transform((value) => (value === undefined || value === 'undefined' ? false : true))
        .label('Winner')
    })
  )
})

const { defineComponentBinds, handleSubmit, resetForm, errors } = useForm({
  validationSchema: schema
})

const { remove, push, fields } = useFieldArray('players')

const datePlayed = defineComponentBinds('datePlayed')
const location = defineComponentBinds('location')

const onSubmit = handleSubmit(async (values) => {
  const gameId = props.game.gameId
  const playtoAdd = {
    gameId: gameId,
    datePlayed: Timestamp.fromDate(values.datePlayed),
    location: values.location,
    players: values.players ? values.players : []
  }

  const playAdded = await userStore.addGamePlay(props.game, playtoAdd)
  if (playAdded) {
    toast.add({
      severity: 'success',
      summary: 'Play Added',
      detail: 'Play has been added to your collection',
      life: 3000
    })
    resetForm()
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Play could not be added to your collection',
      life: 3000
    })
  }
})
</script>

<style scoped>
input.checkbox {
  cursor: pointer;
  width: 20px;
  height: 20px;
  transition:
    background-color 0.15s,
    border-color 0.15s,
    box-shadow 0.15s;
}
</style>
