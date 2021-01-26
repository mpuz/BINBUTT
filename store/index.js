

export const state = () => ({
    key: '',
    secret: '',
    amount: 5,
    leverage: 10,
    darkTheme: false,
    //interval: "5",
    showCandles: true,
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
    darkTheme(state, value) {
        state.darkTheme = value
        if (process.client) {
            localStorage.setItem('darkTheme', value)
        }
    },
    // setInterval(state, value) {
    //     state.interval = value
    //     if (process.client) {
    //         localStorage.setItem('interval', value)
    //     }
    // },
    showCandles(state, value) {
        state.showCandles = value
        if (process.client) {
            localStorage.setItem('showCandles', value)
        }
    },

}