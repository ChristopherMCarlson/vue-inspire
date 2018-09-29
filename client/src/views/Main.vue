<template>
  <v-container fill-height style="flex-direction: column;">
    <v-layout row align-start justify-space-between class="full-width fade-in">
      <v-dialog v-model="dialog" width="500">
        <v-btn slot="activator" color="blue-grey lighten-2" dark>
          Options
        </v-btn>

        <v-list>
          <v-slider v-model="opacity" :max="9" label="Brightness" class="py-1 px-3"></v-slider>
          <v-layout row wrap>
            <v-flex xs12>
              <v-form ref="form" class="py-3 px-2" @submit.prevent="changeCity">
                <v-layout row wrap justify-center>
                  <v-flex xs4>
                    <v-text-field v-model="newCity" type="City" label="City"></v-text-field>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn type="submit" class="blue-grey lighten-2">
                      submit
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
          </v-layout>
          <v-layout row wrap justify-center>
            Photo supplied by Pixabay
          </v-layout>
        </v-list>
      </v-dialog>
      <v-flex xs6 class="fade-up">
        <div class="display-2">
          <p class="text-xs-right white--text text-shadow">
            {{weather.name}}
          </p>
        </div>
        <div class="title">
          <p class="text-xs-right white--text text-shadow">
            {{temp}}°
          </p>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row align-center justify-center class="full-width">
      <v-flex xs6 class="fade-up">
        <div class="display-2">
          <p class="text-xs-center white--text text-shadow">
            {{time}}
          </p>
        </div>
        <div class="title">
          <p class="text-xs-center white--text text-shadow">
            Hello, {{user.name}}
          </p>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row align-end justify-end class="full-width fade-in">
      <v-card class="pa-2">
        <div class="task-scroll">
          <v-layout row v-for="(task, i) in this.tasks" :key="i">
            <v-checkbox height="0.2rem" :label="task.name" @change="changeTask(task._id)" :input-value="task.completed"></v-checkbox>
            <i class="material-icons delete" @click="deleteTask(task._id)">
              delete_forever
            </i>
          </v-layout>
        </div>
        <v-layout row wrap>
          <v-flex xs12>
            <v-form ref="form" class="py-3 px-2" @submit.prevent="createTask">
              <v-layout row wrap>
                <v-flex xs8>
                  <v-text-field v-model="task" type="New Task" label="New Task"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-btn type="submit" class="blue-grey lighten-2">
                    submit
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
      </v-card>
    </v-layout>
  </v-container>
</template>


<script>
  export default {
    name: 'Main',
    created() {
      //blocks users not logged in
      if (!this.$store.state.user._id) {
        this.$router.push({ name: "home" });
      }
      this.makeTime()
      setInterval(this.makeTime, 15000)
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      tasks() {
        return this.$store.state.tasks
      },
      weather() {
        return this.$store.state.weather
      },
      temp() {
        return this.$store.state.tempF
      }
    },
    methods: {
      makeTime() {
        let today = new Date()
        var h = today.getHours() % 12
        var m = today.getMinutes()
        let time = h + ":" + this.addZero(m, 2)
        this.time = time
      },
      addZero(num, digit) {
        var zero = ""
        for (let i = 0; i < digit; i++) {
          zero += "0"
        }
        return (zero + num).slice(-digit)
      },
      createTask() {
        let task = {
          name: this.task,
          user: this.$store.state.user._id,
          completed: false
        }
        console.log(task);
        this.$store.dispatch('createTask', task)
        this.task = ''
      },
      changeTask(taskId) {
        this.$store.dispatch('changeTask', taskId)
      },
      deleteTask(taskId) {
        this.$store.dispatch('deleteTask', taskId)
      },
      changeCity() {
        let userData = {
          userId: this.$store.state.user._id,
          city: this.newCity
        }
        this.$store.dispatch('changeCity', userData)
        this.newCity = ''
      }
    },
    data() {
      return {
        time: '',
        task: '',
        opacity: 9,
        newCity: '',
        dialog: false
      }
    },
    watch: {
      opacity: function () {
        let brightness = 10 - this.opacity
        this.$store.dispatch('changeOpacity', (brightness / 10))
      }
    }
  }
</script>

<style>
  .full-width {
    width: 100%;
  }

  .fade-up {
    opacity: 0;
    animation: fade 1s 0.2s forwards, translate-up 1s 0.2s forwards;
  }

  .fade-in {
    opacity: 0;
    animation: fade 1s 0.2s forwards;
  }

  @keyframes fade {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes translate-up {
    0% {
      transform: translateY(8rem);
    }

    100% {
      transform: translateY(0rem);
    }
  }

  .form {
    float: left;
  }

  .delete {
    color: black;
    cursor: pointer;
  }

  .delete:hover {
    color: red
  }

  .text-shadow {
    text-shadow: 2px 2px 2px #000000;
  }

  .task-scroll {
    max-height: 180px;
    overflow-y: auto;
  }
</style>