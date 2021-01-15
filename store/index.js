

export const state = () => ({
    key: '',
    secret: '',
    amount: 5,
    leverage: 10,
    interval: '5'
})

export const mutations = {
    setKey(state, value) {
        state.key = value
        if (process.client) {
            localStorage.setItem('key', value)
        }
    },
    setSecret(state, value) {
        state.secret = value
        if (process.client) {
            localStorage.setItem('secret', value)
        }
    },
    setAmount(state, value) {
        state.amount = value
        if (process.client) {
            localStorage.setItem('amount', value)
        }
    },
    setMargin(state, value) {
        state.leverage = value
        if (process.client) {
            localStorage.setItem('leverage', value)
        }
    },
    setInterval(state, value) {
        state.interval = value
        if (process.client) {
            localStorage.setItem('interval', value)
        }
    }
}