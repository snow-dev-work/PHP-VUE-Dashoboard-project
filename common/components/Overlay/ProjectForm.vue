<template>
  <form
    class="custom-form"
    :class="[{ pending }]"
    @submit.prevent="submit"
    @reset.prevent="reset"
    ref="form">
    <div class="loader" v-if="pending">
      <Icon icon="loader" />
    </div>
    <header class="custom-form__header large">
      <h2>
        <template v-if="this.id > 0">Modification d'un projet</template>
        <template v-else>Nouveau Projet</template>
      </h2>
      <button
        type="reset"
        class="custom-form__exit"
        style="color: var(--color-accent)">
        <Icon icon="times" />
      </button>
    </header>

    <CustomInput v-model="title.value" v-bind="title" class="large" />
    <CustomCheckbox v-model="priority.value" v-bind="priority" />

    <CustomTextarea
      v-model="description.value"
      v-bind="description"
      class="large" />

    <CustomSelect v-model="status.value" v-bind="status" />
    <CustomSelectMultiple
      v-model="fields.value"
      v-bind="fields"
      :disabled="isAdmin" />

    <CustomSelectInput
      v-model="date_start.value"
      v-bind="date_start"
      :pattern="DATE_PATTERNS[date_start.value.type]"
      :title="DATE_TITLES[date_start.value.type]"
      :disabled="status.value === STATUS.CANCELLED" />
    <CustomSelectInput
      v-model="date_end.value"
      v-bind="date_end"
      :label="dateEndLabel"
      :pattern="DATE_PATTERNS[date_end.value.type]"
      :title="DATE_TITLES[date_end.value.type]"
      :disabled="status.value === STATUS.CANCELLED" />

    <CustomInput
      v-model="timeSpent.value"
      v-bind="timeSpent"
      :pattern="/[0-9]+(\.[0-9]+)?/" />

    <CustomInput
      v-model="estimation.value"
      v-bind="estimation"
      :pattern="/[0-9]+(\.[0-9]+)?/" />

    <CustomRange
      v-model="progression.value"
      v-bind="progression"
      :disabled="progression.disabled || status.value === STATUS.CANCELLED"
      class="large" />

    <CustomSelect v-model="service.value" v-bind="service" />
    <CustomInput
      v-model="applicant.value"
      v-bind="applicant"
      :datalist="datalist_applicants" />

    <CustomInput
      v-model="referent_info.value"
      v-bind="referent_info"
      :datalist="datalist_referents_info" />
    <CustomInput
      v-model="referent_business.value"
      v-bind="referent_business"
      :datalist="datalist_referents_business" />

    <CustomSelectMultiple v-model="users.value" v-bind="users" class="large" />

    <CustomInputMultiple
      v-model="developers.value"
      v-bind="developers"
      :datalist="datalist_developers"
      class="large" />

    <CustomInput v-model="clickup.value" v-bind="clickup" class="large" />
    <CustomInput v-model="link.value" v-bind="link" class="large" />

    <div class="custom-form__buttons large">
      <button type="submit" class="custom-form__submit" :disabled="pending">
        Enregistrer
      </button>
      <button type="reset" class="custom-form__cancel">Annuler</button>
    </div>
  </form>
</template>

<script>
  import {
DATE_ERROR_MESSAGE,
DATE_PATTERNS,
DATE_TITLES,
DATE_TYPES,
FIELDS,
FORM_DEFAULT,
POPUP_VARIANTS,
STATUS,
STORE,
USERS,
} from "@Constants"
import { mapActions, mapMutations, mapState } from "@Modules/vuex"
import CustomInput from "../Base/CustomInput.vue"

  const watchers = new Map()

  const dateWatchFn = element => value => {
    const { type } = element.value
    if (value.length === 0) {
      element.error = false
      return
    }

    if (DATE_PATTERNS[type].test(value)) {
      element.error = false
      return
    }

    element.error = true
    element.errorMessage = DATE_ERROR_MESSAGE[type]
  }

  export default {
    name: "ProjectForm",
    data() {
      const PROJECT_DEFAULT = { ...FORM_DEFAULT.PROJECT }
      const id = {
        value: PROJECT_DEFAULT.id,
      }
      const title = {
        value: PROJECT_DEFAULT.title,
        name: "title",
        label: "Nom du projet",
        required: true,
        error: false,
        errorMessage: "Nom du projet requis",
      }
      const priority = {
        value: PROJECT_DEFAULT.priority,
        name: "priority",
        label: "Prioritaire",
        require: false,
      }
      const description = {
        value: PROJECT_DEFAULT.description,
        name: "description",
        label: "Description",
        required: false,
      }
      const status = {
        value: PROJECT_DEFAULT.status,
        name: "status",
        label: "Statut",
        required: true,
        error: false,
        errorMessage: "Le statut du projet doit être renseigné",
        options: Object.values(STATUS),
      }
      const service = {
        value: PROJECT_DEFAULT.service,
        name: "service",
        label: "Service demandeur",
        options: Object.values(USERS)
          .filter(user => user !== USERS.SUPERADMIN)
          .sort((a, b) => a.localeCompare(b)),
        required: true,
        error: false,
        errorMessage: "Le service demandeur doit être renseigné",
      }
      const fields = {
        value: [...PROJECT_DEFAULT.fields],
        name: "fields",
        label: "Domaines",
        required: true,
        options: Object.values(FIELDS).sort((a, b) => a.localeCompare(b)),
        error: false,
        errorMessage: "Au moins un domaine doit être renseigné",
        disabled: false,
      }
      const date_start = {
        value: {
          type: DATE_TYPES.EXACT,
          value: PROJECT_DEFAULT.date_start,
        },
        name: "date_start",
        label: "Date de départ",
        required: false,
        options: Object.entries(DATE_TYPES).map(([key, value]) => ({
          value: key,
          label: value,
        })),
        error: false,
        errorMessage: "Format invalide",
      }
      const date_end = {
        value: {
          type: DATE_TYPES.EXACT,
          value: PROJECT_DEFAULT.date_end,
        },
        name: "date_end",
        required: false,
        options: Object.entries(DATE_TYPES).map(([key, value]) => ({
          value: key,
          label: value,
        })),
        error: false,
        errorMessage: "Format invalide",
      }
      const progression = {
        value: PROJECT_DEFAULT.progression,
        name: "progression",
        label: "Progression",
        unity: "%",
        required: false,
        disabled: false,
      }
      const applicant = {
        value: PROJECT_DEFAULT.applicant,
        name: "applicant",
        label: "Demandeur physique",
        required: false,
      }
      const users = {
        value: [...PROJECT_DEFAULT.users],
        name: "users",
        label: "Utilisateurs autorisés",
        required: true,
        error: false,
        errorMessage: "Au moins un utilisateur doit être renseigné",
        options: Object.values(USERS)
          .filter(user => user !== USERS.SUPERADMIN)
          .sort((a, b) => a.localeCompare(b)),
      }
      const developers = {
        value: [...PROJECT_DEFAULT.developers],
        name: "developers",
        label: "Développeurs",
        required: false,
      }
      const clickup = {
        value: PROJECT_DEFAULT.clickup,
        name: "clickup",
        label: "Lien Clickup",
        required: false,
        type: "url",
      }
      const link = {
        value: PROJECT_DEFAULT.link,
        name: "link",
        label: "Lien",
        required: false,
        type: "url",
      }
      const referent_info = {
        value: PROJECT_DEFAULT.referent_info,
        name: "referent_info",
        label: "Scrum Master",
        required: false,
      }
      const referent_business = {
        value: PROJECT_DEFAULT.referent_business,
        name: "referent_business",
        label: "Product Owner",
        required: false,
      }
      const timeSpent = {
        value: `${PROJECT_DEFAULT.timeSpent}`,
        name: "timeSpent",
        label: "Temps consommé (en jours-homme)",
        error: false,
        errorMessage: "Le temps consommé doit être un nombre",
        required: false,
      }
      const estimation = {
        value: `${PROJECT_DEFAULT.estimation}`,
        name: "estimation",
        label: "Estimation du temps (en jours-homme)",
        error: false,
        errorMessage: "Le temps consommé doit être un nombre",
        required: false,
      }

      const pending = false

      const progressionPreviousValue = 0

      const isFirstRender = false

      return {
        id,
        title,
        description,
        priority,
        status,
        service,
        fields,
        date_start,
        date_end,
        progression,
        progressionPreviousValue,
        applicant,
        users,
        developers,
        clickup,
        link,
        referent_info,
        referent_business,
        timeSpent,
        estimation,
        pending,
        isFirstRender,
      }
    },
    computed: {
      ...mapState({
        selected: ({ projects }) => projects.selected,
        projects: ({ projects }) => projects.list,
        user: ({ user }) => user,
      }),
      dateEndLabel() {
        switch (this.status.value) {
          case STATUS.PRODUCTION:
            return "Date de livraison"
          default:
            return "Date de livraison estimée"
        }
      },
      STATUS() {
        return STATUS
      },
      DATE_PATTERNS() {
        return DATE_PATTERNS
      },
      DATE_TITLES() {
        return DATE_TITLES
      },
      values: {
        get() {
          let date_start = this.date_start.value.value

          switch (this.date_start.value.type) {
            case "WEEK":
              date_start = date_start.replace(
                /^(?<year>\d{4})-(?<num>[1-9]|[1-4][0-9]|5[0-2])$/g,
                "$<year>-S$<num>"
              )
              break
            case "QUARTER":
              date_start = date_start.replace(
                /^(?<year>\d{4})-(?<num>[1-4])$/g,
                "$<year>-T$<num>"
              )
              break
          }

          date_start ||= null

          let date_end = this.date_end.value.value
          switch (this.date_end.value.type) {
            case "WEEK":
              date_end = date_end.replace(
                /^(?<year>\d{4})-(?<num>[1-9]|[1-4][0-9]|5[0-2])$/g,
                "$<year>-S$<num>"
              )
              break
            case "QUARTER":
              date_end = date_end.replace(
                /^(?<year>\d{4})-(?<num>[1-4])$/g,
                "$<year>-T$<num>"
              )
              break
          }

          date_end ||= null

          const values = {
            title: this.title.value,
            description: this.description.value,
            status: this.status.value,
            progression: this.progression.value,
            date_start,
            date_end,
            fields: this.fields.value,
            service: this.service.value,
            applicant: this.applicant.value,
            referent_business: this.referent_business.value,
            referent_info: this.referent_info.value,
            developers: this.developers.value,
            users: this.users.value,
            priority: this.priority.value,
            clickup: this.clickup.value,
            link: this.link.value,
            timeSpent: +this.timeSpent.value,
			      estimation: +this.estimation.value || null,
          }

          for (const key in values) {
            values[key] ??= null
          }

          return values
        },
        set(values) {
          LOOP_VALUES: for (const key in values) {
            if (key === "id") {
              this.id.value = values.id
              continue LOOP_VALUES
            }
            if (key in this.$data) {
              if (key === "progression") {
                this.progression.value = values[key]
                continue LOOP_VALUES
              }
              if (["date_start", "date_end"].includes(key)) {
                if (values[key] === null || values[key].length === 0) {
                  continue LOOP_VALUES
                }
                this[key].value.type = "EXACT"
                if (values[key]._i.includes("T"))
                  this[key].value.type = "QUARTER"
                if (values[key]._i.includes("S")) this[key].value.type = "WEEK"
                this[key].value.value = values[key]._i.replace(/T|S/, "")
                continue LOOP_VALUES
              }
              if (key === "service" && values[key] === "BACKOFF") {
                this[key].value = "BACKOFFICE"
                continue LOOP_VALUES
              }
              if (["timeSpent", "estimation"].includes(key)) {
				        const value = values[key]
                this[key].value = value === null ? "" : `${value}`

                continue LOOP_VALUES
              }

              this[key].value = values[key] ?? FORM_DEFAULT.PROJECT[key]
            }
          }
        },
      },
      required() {
        const required = []

        for (const key in this.$data) {
          const obj = this[key]

          if (typeof obj !== "object") continue
          if (!("required" in obj)) continue

          obj.required && required.push(key)
        }

        return required
      },
      error() {
        return Object.values(this.$data).some(data => data?.error === true)
      },
      datalist_applicants() {
        return [
          ...new Set(
            this.projects
              .map(({ applicant }) => applicant)
              .filter(a => a !== null)
              .sort((a, b) => a.localeCompare(b))
          ),
        ]
      },
      datalist_developers() {
        return [
          ...new Set(
            this.projects
              .flatMap(({ developers }) => developers)
              .sort((a, b) => {
                if (a.toLocaleLowerCase() === "tous") return -1
                if (b.toLocaleLowerCase() === "tous") return 1
                return a.localeCompare(b)
              })
          ),
        ]
      },
      datalist_referents_info() {
        return [
          ...new Set(
            this.projects
              .map(({ referent_info }) => referent_info)
              .filter(r => r !== null)
              .sort((a, b) => a.localeCompare(b))
          ),
        ]
      },
      datalist_referents_business() {
        return [
          ...new Set(
            this.projects
              .map(({ referent_business }) => referent_business)
              .filter(r => r !== null)
              .sort((a, b) => a.localeCompare(b))
          ),
        ]
      },
      isAdmin() {
        return this.user.includes("_ADMIN")
      },
    },
    methods: {
      ...mapMutations({
        pop: STORE.MUTATIONS.POPUPS_ADD,
      }),
      ...mapActions({
        hide: STORE.ACTIONS.OVERLAY_HIDE,
        add: STORE.ACTIONS.PROJECTS_POST,
        update: STORE.ACTIONS.PROJECTS_PUT,
      }),
      reset() {
        this.values = { ...FORM_DEFAULT.PROJECT }
        this.hide()
      },
      async submit() {
        if (this.pending) return

        this.validate()

        if (this.error) return

        this.pending = true
        const data = { ...this.values }

        if (this.user.includes("_ADMIN")) {
          data.fields = [
            ...new Set([...data.fields, this.user.replace("_ADMIN", "")]),
          ]
        }

        if (typeof this.selected === "undefined") {
          await this.add({ data })
          this.pending = false
          this.hide()
          this.pop({ message: "Projet ajouté avec succès" })
          return
        }

        await this.update({ id: this.id.value, data })
        this.pending = false
        this.hide()
        this.pop({ message: "Projet mis à jour avec succès" })
      },
      validate() {
        const variant = POPUP_VARIANTS.DANGER
        const elements = []

        const values = this.values

        for (const key of this.required) {
          const unwatcher = watchers.get(key)

          if (typeof unwatcher === "function") {
            unwatcher()
          }

          if (!values[key]) {
            elements.push({ el: document.querySelector(`[name=${key}]`), key })

            this[key].error = true

            this.pop({
              message: this[key].errorMessage,
              variant,
            })

            watchers.set(
              key,
              this.$watch(
                () => this[key].value,
                value => {
                  this[key].error = value.length === 0
                }
              )
            )
          }

        }

        if (values.date_start !== null) {
          const unwatcher = watchers.get("date_start")
          if (typeof unwatcher === "function") unwatcher()

          this.date_start.error = false
          const { value, type } = this.date_start.value
          if (!DATE_PATTERNS[type].test(value)) {
            this.date_start.error = true
            this.date_start.errorMessage = DATE_ERROR_MESSAGE[type]
            elements.push({
              el: document.querySelector(`[name="date_start"]`),
              key: "date_start",
            })
            this.pop({
              message: this.date_start.errorMessage,
              variant,
            })
            watchers.set(
              "date_start",
              this.$watch(
                () => this.date_start.value.value,
                dateWatchFn(this.date_start)
              )
            )
          }
        }

        if (values.date_end !== null) {
          const unwatcher = watchers.get("date_end")
          if (typeof unwatcher === "function") unwatcher()

          this.date_end.error = false
          const { value, type } = this.date_end.value
          if (!DATE_PATTERNS[type].test(value)) {
            this.date_end.error = true
            this.date_end.errorMessage = DATE_ERROR_MESSAGE[type]
            elements.push({
              el: document.querySelector(`[name="date_end"]`),
              key: "date_end",
            })
            this.pop({
              message: this.date_end.errorMessage,
              variant,
            })
            watchers.set(
              "date_end",
              this.$watch(
                () => this.date_end.value.value,
                dateWatchFn(this.date_end)
              )
            )
          }
        }

        if (elements.length === 0) {
          return
        }

        this.$el.scroll({
          top: elements[0]?.el?.offsetParent?.offsetTop ?? 0,
        })
        elements[0]?.el?.focus()
      },
      percentage(value, total) {
        const result = Math.floor(value / total * 100)

        if (result > 100) return 100
        if (result < 0) return 0

        return result
      }
    },
    mounted() {
      this.isFirstRender = true

      if (this.user.includes("_ADMIN")) {
        this.fields.value = [this.user.replace("_ADMIN", "")]
      }
      this.values = {
        ...(this.selected ?? {}),
      }
    },
    beforeUpdate() {
      this.isFirstRender = false
    },
    watch: {
      ["estimation.value"](estimation) {
        if (this.isFirstRender) {
          this.progression.disabled = estimation.value !== null
          return
        }

        if (estimation) {
          this.progressionPreviousValue ||= this.progression.value
          this.progression.disabled = true
          this.progression.value = this.percentage(this.timeSpent.value, estimation)
          return
        }

        this.progression.disabled = this.status.value === STATUS.CANCELLED
        this.progression.value = this.progressionPreviousValue
        this.progressionPreviousValue = 0
      },
      ["timeSpent.value"](timeSpent) {
        if (this.isFirstRender) return

        if (this.estimation.value !== null) {
          this.progressionPreviousValue ||= this.progression.value
          this.progression.disabled = true
          this.progression.value = this.percentage(timeSpent, this.estimation.value)
          return
        }

        this.progression.disabled = this.status.value === STATUS.CANCELLED
        this.progression.value = this.progressionPreviousValue
        this.progressionPreviousValue = 0
      }
    },
    components: { CustomInput },
  }
</script>

<style src="@CommonAssets/css/custom-form.css"></style>
<style scoped>
  .custom-form.pending {
    pointer-events: none;
    overflow: hidden;
  }
  .loader {
    display: grid;
    place-items: center;
    position: fixed;
    inset: 0;
    z-index: 1000;
    font-size: 10em;
    pointer-events: none;
    cursor: progress;
  }
</style>
