import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router'

var production = !window.location.host.includes('localhost');
var baseUrl = production ? '//cmcinspire.herokuapp.com/' : '//localhost:3000/';

let auth = axios.create({
  baseURL: baseUrl + 'auth',
  timeout: 3000,
  withCredentials: true
})

let api = axios.create({
  baseURL: baseUrl + 'api',
  timeout: 3000,
  withCredentials: true
})

const pixKey = '9888263-5e82026c4efaed628c83b0467';
const url2 = 'https://pixabay.com/api/?key=' + pixKey + '&q=sunset&order=popular&per_page=200&image_type=photo&page='
const apiUrl = url2;
function randomNum() {
  return Math.floor(Math.random() * 3) + 1;
}

const imgApi = axios.create({
  baseURL: apiUrl,
  timeout: 3000
});

const weatherKey = 'c71f73f66f69011b48df6b46800d4e79'

const weatherApi = axios.create({
  baseURL: 'http://api.openweathermap.org/data/2.5/',
  timeout: 3000
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    bgImg: '',
    imgResults: [],
    tasks: [],
    opacity: 0,
    weather: '',
    tempF: ''
  },
  mutations: {
    setImgResults(state, imgData) {
      state.imgResults.push(...imgData)
    },
    setUser(state, user) {
      state.user = user
    },
    setImg(state, img) {
      state.bgImg = img
    },
    setTasks(state, tasks) {
      state.tasks = tasks
    },
    setOpacity(state, opacity) {
      state.opacity = opacity
    },
    setWeather(state, weather) {
      state.weather = weather
    },
    setF(state, temp) {
      state.tempF = temp
    }
  },
  actions: {
    //AUTH STUFF
    // @ts-ignore
    register({ commit, dispatch }, newUser) {
      auth.post('register', newUser)
        .then(res => {
          commit('setUser', res.data)
          dispatch('getImages')
          router.push({ name: 'main' })
        })
    },
    authenticate({ commit, dispatch }) {
      auth.get('authenticate')
        .then(res => {
          commit('setUser', res.data)
          console.log("Authenticate has shot off")
          dispatch('getImages')
          dispatch('getTasks')
          dispatch('getWeather')
          router.push({ name: 'main' })
        })
    },
    login({ commit, dispatch }, creds) {
      auth.post('login', creds)
        .then(res => {
          console.log(res.data)
          commit('setUser', res.data)
          dispatch('getImages')
          dispatch('getTasks')
          dispatch('getWeather')
          router.push({ name: 'main' })
        })
    },
    logout({ commit }) {
      auth.delete('logout')
        // @ts-ignore
        .then(res => {
          router.push({ name: 'home' })
          commit('setUser', {})
        })
    },
    //IMAGE GETTER
    getImages({ commit, dispatch }) {
      if (this.state.imgResults.length > 0) {
        return
      }
      else {
        imgApi('' + 1)
          .then(res => {
            commit('setImgResults', res.data.hits)
            if (this.state.imgResults.length == 600) {
              dispatch('setBGImg')
            }
          })
        imgApi('' + 2)
          .then(res => {
            commit('setImgResults', res.data.hits)
            if (this.state.imgResults.length == 600) {
              dispatch('setBGImg')
            }
          })
        imgApi('' + 3)
          .then(res => {
            commit('setImgResults', res.data.hits)
            if (this.state.imgResults.length == 600) {
              dispatch('setBGImg')
            }
          })
      }
    },
    setBGImg({ commit }) {
      let randomNum = Math.floor(Math.random() * 601)
      commit('setImg', this.state.imgResults[randomNum].largeImageURL)
    },
    createTask({ dispatch }, task) {
      api.post('/task/createTask', task)
        .then(res => {
          dispatch('getTasks')
        })
    },
    getTasks({ commit }) {
      api.get('/task/' + this.state.user._id)
        .then(res => {
          commit('setTasks', res.data)
        })
    },
    changeTask({ dispatch }, taskId) {
      var task = this.state.tasks.find(task => task._id == taskId)
      task.completed = !task.completed
      api.put('/task/update/' + taskId, task)
        .then(res => {
          dispatch('getTasks')
        })
    },
    deleteTask({ dispatch }, taskId) {
      api.delete('/task/delete/' + taskId)
        .then(res => {
          dispatch('getTasks')
        })
    },
    changeOpacity({ commit }, opacity) {
      commit('setOpacity', opacity)
    },
    getWeather({ commit }) {
      var city = this.state.user.city
      weatherApi('' + 'weather?q=' + city + '&&APPID=' + weatherKey)
        .then(res => {
          commit('setWeather', res.data)
          commit('setF', Math.round((res.data.main.temp * 9 / 5) - 459.67))
        })
    },
    changeCity({ dispatch, commit }, userData) {
      api.put('/user/city', userData)
        .then((res) => {
          commit('setUser', res.data)
          dispatch('getWeather')
        })
    }
  }
})