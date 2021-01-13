// /plugins/init.client.js
export default function ({ store }) {
    store.commit('setKey', localStorage.getItem('key'))
    store.commit('setSecret', localStorage.getItem('secret'))
    store.commit('setAmount', localStorage.getItem('amount'))
    store.commit('setMargin', localStorage.getItem('leverage'))
}