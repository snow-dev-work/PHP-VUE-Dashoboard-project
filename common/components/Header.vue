<template>
  <header
    class="header"
    :class="[{ scroll: scroll || isMobile }]"
    :style="[styleSideView]">
    <img src="@CommonAssets/img/p.png" class="header__logo" />
    <div class="header__title__container">
      <h1 class="header__title">Suivi de projets</h1>
      <p class="header__subtitle" v-if="date !== null && projects.length > 0">
        Etat d'avancement au {{ date.format("DD/MM/YYYY") }}
      </p>
    </div>

    <template v-if="isMobile || scroll">
      <input
        hidden
        type="checkbox"
        id="header__menu__toggle"
        v-model="showMenu" />
      <label
        class="header__menu__toggle__btn"
        :class="[{ open: showMenu }]"
        for="header__menu__toggle">
        <Icon icon="arrow-up" />
      </label>
    </template>

    <nav class="header__nav buttons" v-else>
      <a
        :href="`/?token=${token}`"
        class="btn"
        :class="{ active: view === 'MOBILE' }"
        title="Vue Mobile">
        <Icon icon="smartphone" />
      </a>
      <a
        :href="`/table?token=${token}`"
        class="btn"
        :class="{ active: view === 'TABLE' }"
        title="Vue Tableau">
        <Icon icon="table" />
      </a>
      <a
        :href="`/timeline?token=${token}`"
        class="btn"
        :class="{ active: view === 'TIMELINE' }"
        title="Vue Timeline">
        <Icon icon="timeline" />
      </a>
      <a
        :href="`/availability?token=${token}`"
        class="btn"
        v-if="[USERS.DIRECTION, USERS.SUPERADMIN].includes(user)"
        title="Disponibilité Informatique">
        <Icon icon="charts" />
      </a>
    </nav>

    <div
      class="header__menu"
      :class="[{ open: showMenu && (scroll || isMobile) }]"
      v-if="show_all_btns">
      <SearchBar v-if="show_search_bar" />

      <div class="buttons">
        <button @click="() => filterProjects()">
          <Icon icon="filters" />Filtrer
        </button>
        <button @click="() => sortProjects()" v-if="show_btns">
          <Icon icon="sorting" />Trier
        </button>
        <button v-if="admin" @click="() => newProject()">
          <Icon icon="more" />Nouveau projet
        </button>
        <button @click="() => excel()">Exporter</button>
      </div>
    </div>
  </header>
</template>

<script>
  import { mapActions, mapState, mapMutations } from "@Modules/vuex"
  import SearchBar from "./SearchBar.vue"

  import { STORE, USERS, POPUP_VARIANTS } from "@Constants"

  export default {
    name: "Header",
    components: { SearchBar },
    props: {
      scroll: {
        type: Boolean,
        default: () => false,
      },
      view: {
        type: String,
        default: () => "MOBILE",
      },
      show_btns: {
        type: Boolean,
        default: () => true,
      },
      show_search_bar: {
        type: Boolean,
        default: () => true,
      },
      show_all_btns: {
        type: Boolean,
        default: () => true,
      },
      side_view: {
        type: String,
        default: () => "",
      },
    },
    data() {
      const windowWidth = window.outerWidth
      const showMenu = false

      return { windowWidth, showMenu }
    },
    computed: {
      ...mapState({
        admin: ({ admin }) => admin,
        date: ({ projects }) => projects.date,
        token: ({ token }) => token,
        user: ({ user }) => user,
        isMobile: ({ isMobile }) => isMobile,
        isScroll: ({ isScroll }) => isScroll,
        projects: ({ projects }) => projects.list,
        sorted: ({ projects }) => projects.sorted,
      }),
      projectsIds() {
        return this.sorted.map(project => project.id)
      },
      USERS() {
        return USERS
      },
      styleSideView() {
        switch (this.side_view) {
          case "left":
            return {
              right: "2em",
            }
          case "right":
            return {
              left: "2em",
            }
          case "":
          case "both":
          default:
            return {
              left: "0",
              right: "0",
            }
        }
      },
    },
    methods: {
      ...mapActions({
        showProjectForm: STORE.ACTIONS.OVERLAY_SHOW_PROJECT_FORM,
        showSortingForm: STORE.ACTIONS.OVERLAY_SHOW_SORTING_FORM,
        showFilterForm: STORE.ACTIONS.OVERLAY_SHOW_FILTERS_FORM,
      }),
      ...mapMutations({
        pop: STORE.MUTATIONS.POPUPS_ADD,
      }),
      async excel() {
        document.documentElement.style.cursor = "progress"
        try {
          const response = await fetch("/api/projects/excel", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify(this.projectsIds),
          })

          if (!response.ok) {
            throw new Error("Un problème est survenu")
          }

          const contentDisposition = Object.fromEntries(
            response.headers
              .get("Content-Disposition")
              .split(";")
              .map(row => {
                const _row = [
                  ...row
                    .replace(/"([^"]+)"/g, "$1")
                    .trim()
                    .split("="),
                ]

                if (_row.length < 2) _row.push(null)

                return _row
              })
          )

          const blob = await response.blob()
          const fileURL = URL.createObjectURL(blob)
          const anchor = document.createElement("a")
          anchor.href = fileURL
          anchor.download = contentDisposition.filename
          document.body.append(anchor)
          anchor.click()
          anchor.remove()

          URL.revokeObjectURL(fileURL)
        } catch (e) {
          this.pop({
            message: e.message,
            variant: POPUP_VARIANTS.WARNING,
          })
        }

        document.documentElement.style.cursor = ""
      },
      setWindowWidth() {
        this.windowWidth = window.outerWidth
      },
      filterProjects() {
        this.showMenu = false
        this.showFilterForm()
      },
      sortProjects() {
        this.showMenu = false
        this.showSortingForm()
      },
      newProject() {
        this.showMenu = false
        this.showProjectForm()
      },
    },
    mouted() {},
  }
</script>

<style scoped>
  .header {
    grid-column: 2;

    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto;

    gap: 0.5em;
    align-items: center;

    padding-top: 2em;
  }

  .header__logo {
    height: 5em;
    width: 5em;

    border-radius: 0.75em;

    align-items: center;
  }

  .header__title {
    margin: 0;
    color: var(--color-secondary);
  }

  .header__nav {
    display: flex;
    align-items: center;
    gap: 0;
  }
  .header__nav label {
    margin-right: 0.5em;
    font-weight: bold;
  }

  .header__menu {
    grid-column: 1 / -1;

    display: flex;
    justify-content: space-between;
  }
  .header__menu .search-bar {
    flex: 1;
    margin-right: 0.5em;
  }
  .header__menu .search-bar__input {
    flex: 1;
  }
  .header__menu button {
    --contrasting-color: var(--color-primary);
  }
  .header__menu .buttons {
    margin-left: auto;
  }

  .header.scroll .header__nav {
    display: none;
  }

  .header.scroll {
    position: fixed;
    top: 0;
    z-index: 500;

    padding: 0.5em 0;

    font-size: 0.75em;

    max-width: 800px;
    width: 100vw;
    margin: auto;

    transition: transform 500ms;
  }
  .header.scroll .header__menu__toggle__btn.open {
    transform: scaleY(1);
  }

  .header.scroll .header__menu__toggle__btn {
    cursor: pointer;
    font-size: 3.5em;
    display: flex;
    align-items: center;
    justify-content: center;

    transform: scaleY(-1);
    transition: transform 500ms;

    color: var(--color-primary);
  }

  .header.scroll .header__menu {
    overflow: hidden;
    max-height: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 1em;
    font-size: 1.5em;

    transition: max-height 500ms;
  }
  .header.scroll .header__menu.open {
    max-height: 30vh;
  }

  .header.scroll .header__menu .buttons {
    margin: 0;
    flex-direction: column;
  }

  .header.scroll .header__menu .buttons button {
    border: none;
    border-radius: 0;
    justify-content: start;
  }

  .header-enter,
  .header-leave-to {
    transform: translateY(-110%);
  }

  .header-enter-to {
    transform: translateY(0);
  }

  .header.scroll::before {
    content: "";
    display: block;
    position: absolute;
    z-index: -1;
    background-color: var(--bg-color);
    top: 0;
    bottom: 0;
    left: calc(50% - 100vw);
    width: 200vw;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
  }

  @media screen and (max-width: 800px) {
    .header.scroll {
      padding: 1em;
    }

    .header.scroll .header__menu {
      font-size: 1.2em;
    }
  }
</style>
