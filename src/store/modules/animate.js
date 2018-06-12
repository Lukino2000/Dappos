import Vue from 'vue'
import { defaultMutations } from 'vuex-easy-access'
import anime from 'animejs'
import { hasClass, addClass, removeClass } from '../../helpers/DOMClassHelpers'
import { dom } from 'quasar'
const { offset } = dom

function initialState () {
  return {
    pop: {},
    fly: {},
  }
}

export default {
  namespaced: true,
  state: initialState(),
  mutations:
  {
    resetStateData (state) {
      let newState = initialState()
      Object.assign(state, newState)
    },
    updateState (state, payload) {
      Object.keys(payload).forEach(key => {
        Vue.set(state, key, payload[key])
      })
    },
    setAnimation (state, {type, id, animation}) {
      Vue.set(state[type], id, animation)
    },
    resetAnimation (state, {type, id}) {
      state[type][id].restart()
    },
    ...defaultMutations(initialState())
  },
  actions:
  {
    pop (
      {state, getters, rootState, rootGetters, commit, dispatch},
      {el, id = 'main'} = {}
    ) {
      // console.log('state.pop → ', state.pop)
      if (!state.pop[id]) {
        state.pop[id] = anime({
          targets: el,
          scale: [1, 1.5, 1],
          duration: 300,
          easing: 'easeOutQuad',
          elasticity: 0,
          autoplay: false,
        })
        window.sp = state.pop[id]
      }
      state.pop[id].restart()
    },
    fly (
      {state, getters, rootState, rootGetters, commit, dispatch},
      {el, target, id = 'main', hidden = false} = {}
    ) {
      return new Promise((resolve, reject) => {
        if (hidden) removeClass(el, 'hidden')
        // console.log('el → ', el)
        // console.log('target → ', target)
        const offsetEl = offset(el)
        const offsetTarget = offset(target)
        const Yend = offsetTarget.top - offsetEl.top
        const Xend = offsetTarget.left - offsetEl.left
        // const Ymid = Yend / 2 - 100
        // const Xmid = Xend / 2 + 100
        if (!state.fly[id]) {
          const animation = anime({
            targets: el,
            translateX: Xend,
            translateY: Yend,
            scale: [6, 1],
            duration: 500,
            easing: 'easeOutQuad',
            elasticity: 0,
            autoplay: false
          })
          commit('setAnimation', {type: 'fly', id, animation})
        }
        // state.fly[id].complete = (anim) => {
        //   if (hidden) addClass(el, 'hidden')
        //   resolve()
        // }
        setTimeout(_ => {
          if (hidden) addClass(el, 'hidden')
          resolve()
        }, 400)
        return commit('resetAnimation', {type: 'fly', id})
      })
    },
  },
  getters:
  {
    getIt: (state, getters, rootState, rootGetters) =>
    (id) => {
      getters.someOtherGetter // -> 'foo/someOtherGetter'
      rootGetters.someOtherGetter // -> 'someOtherGetter'
    }
  }
}