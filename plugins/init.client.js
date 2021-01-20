// /plugins/init.client.js
export default function ({ store }) {
    store.commit('setKey', localStorage.getItem('key') === 'null' ? '' : localStorage.getItem('key'))
    store.commit('setSecret', localStorage.getItem('secret') === 'null' ? '' : localStorage.getItem('secret'))
    store.commit('setAmount', localStorage.getItem('amount'))
    store.commit('setMargin', localStorage.getItem('leverage'))
    store.commit('setInterval', localStorage.getItem('interval'))
    store.commit('showCandles', localStorage.getItem('showCandles') == 'true' ? true : false)
}