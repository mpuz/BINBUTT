<template>
  <f7-page class="noscroll">
    <f7-navbar class="noscroll">
      <f7-nav-left>
        <f7-button
          small
          class="display-flex panel-open"
          icon-f7="bars"
          href="#"
          data-panel="#panel-nested"
        ></f7-button>
      </f7-nav-left>
      <f7-nav-title>{{ "BTCUSDT: " + ticker }}</f7-nav-title>
      <f7-nav-right>
        <f7-button
          small
          class="display-flex"
          icon-f7="gear_alt"
          href="/settings/"
        ></f7-button>
      </f7-nav-right>
      <!-- <f7-nav-right>
        <a
          class="link icon-only searchbar-enable"
          data-searchbar=".searchbar-components"
        >
          <i class="icon f7-icons ios-only">search_strong</i>
          <i class="icon material-icons md-only">search</i>
        </a>
      </f7-nav-right> -->

      <!-- <form
        data-search-container=".components-list"
        data-search-in="a"
        class="searchbar searchbar-expandable searchbar-components searchbar-init"
      >
        <div class="searchbar-inner">
          <div class="searchbar-input-wrap">
            <input type="search" placeholder="Search components" />
            <i class="searchbar-icon"></i>
            <span class="input-clear-button"></span>
          </div>
          <span class="searchbar-disable-button">Cancel</span>
        </div>
      </form> -->
    </f7-navbar>

    <div
      class="panel panel-left panel-cover panel-init"
      id="panel-nested"
      data-container-el="#panel-page"
    >
      <div class="page">
        <div class="page-content">
          <f7-button
            small
            class="panel-close float-left"
            icon-f7="close"
            href="#"
          ></f7-button>
          <p class="block-title">Trades History</p>
          <div class="list simple-list">
            <ul>
              <li v-for="trade in trades" v-bind:key="trade[0]">
                <span class="text-align-left">
                  {{
                    new Date(trade[1][0].time)
                      .toISOString()
                      .replace("T", " ")
                      .split(".")[0]
                  }}
                  <b>{{ trade[1][0].side == "SELL" ? "SHORT" : "LONG" }}</b>
                </span>
                <span class="text-align-right">
                  {{
                    trade[1]
                      .map((x) => parseFloat(x.qty))
                      .reduce((a, b) => a + b, 0)
                      .toFixed(4)
                  }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- <f7-list>
      <f7-list-item title="Settings" link="/settings/"></f7-list-item>
    </f7-list> -->

    <f7-block-title class="searchbar-found" strong
      >Status:
      <span v-bind:style="{ color: online ? 'green' : 'red' }">{{
        online ? "ONLINE" : "OFFLINE"
      }}</span>
      <span> | {{ usdtbalance }} USDT | {{ bnbbalance }} BNB</span>
    </f7-block-title>

    <f7-block-title
      >{{
        position && position[0].positionAmt > 0
          ? "LONG | "
          : position && position[0].positionAmt < 0
          ? "SHORT | "
          : "NO POSITIONS | "
      }}
      PnL: USDT
      {{
        parseFloat(position && position[0].unRealizedProfit).toFixed(4)
      }}</f7-block-title
    >
    <f7-block strong>
      <f7-row>
        <f7-col>
          <f7-button large fill color="green" @click="order('BUY')"
            >LONG</f7-button
          >
        </f7-col>
        <f7-col>
          <f7-button large fill color="blue" @click="exit()">EXIT</f7-button>
        </f7-col>
        <f7-col>
          <f7-button large fill color="red" @click="order('SELL')"
            >SHORT</f7-button
          >
        </f7-col>
      </f7-row>
    </f7-block>

    <f7-block strong>
      <f7-range
        :min="0"
        :max="100"
        :label="true"
        :step="1"
        :scale="true"
        :scale-steps="5"
        :scale-sub-steps="4"
        :value="amount"
        @range:change="onAmountChange"
      />
      <p>AMOUNT: {{ amount }} % of DEPOSIT</p>
      <f7-range
        :min="0"
        :max="125"
        :label="true"
        :step="5"
        :value="leverage"
        :scale="true"
        :scale-steps="5"
        :scale-sub-steps="5"
        @range:change="onMarginChange"
      />
      <p>LEVERAGE: {{ leverage }}X</p>
    </f7-block>

    <!-- <f7-block strong>
      <f7-segmented tag="p" raised>
        <f7-button @click="() => (gaugeValue = 0)">0%</f7-button>
        <f7-button @click="() => (gaugeValue = 0.25)">25%</f7-button>
        <f7-button @click="() => (gaugeValue = 0.5)">50%</f7-button>
        <f7-button @click="() => (gaugeValue = 0.75)">75%</f7-button>
        <f7-button @click="() => (gaugeValue = 1)">100%</f7-button>
      </f7-segmented>
    </f7-block> -->
  </f7-page>
</template>

<script>
import Binance from "binance-api-node";
import { mapValues, omit, groupBy } from "lodash";

var client = null;

export default {
  data() {
    return {
      amount: 5,
      leverage: 10,
      ticker: "",
      online: false,
      balance: "",
      usdtbalance: "",
      bnbbalance: "",
      position: null,
      trades: null,
      currentOrder: null,
    };
  },
  methods: {
    async checkPosition() {
      let position = await client.futuresPositionRisk({
        symbol: "BTCUSDT",
      });
      console.log("position", position);
      this.position = position;
    },
    onMarginChange(leverage) {
      this.leverage = leverage;
      this.$store.commit("setMargin", leverage);
    },
    onAmountChange(amount) {
      this.amount = amount;
      this.$store.commit("setAmount", amount);
    },
    async setMargin(symbol = "BTCUSDT", type = "ISOLATED") {
      // await client.futuresMarginType({
      //   symbol: symbol,
      //   marginType: type,
      // });
      let res = await client.futuresLeverage({
        symbol: "BTCUSDT",
        leverage: this.leverage,
      });
      console.log(res);
      return res;
    },
    async getBalance() {
      this.balance = await client.futuresAccountBalance();
      console.log(this.balance);
      if (this.balance[0].balance) {
        this.usdtbalance = parseFloat(this.balance[0].balance).toFixed(0);
        this.bnbbalance = parseFloat(this.balance[1].balance).toFixed(2);
        this.online = true;
      }
    },
    async getHistory() {
      let trades = await client.futuresUserTrades({
        symbol: "BTCUSDT",
      });

      //grouping by order id
      var grouped = await _.mapValues(_.groupBy(trades, "orderId"), (clist) =>
        clist.map((trade) => _.omit(trade, "make"))
      );
      this.trades = Object.entries(grouped).reverse();
      console.log("trades: ", Object.entries(grouped).reverse());
    },

    async order(side) {
      let setlever = await this.setMargin();
      console.log(setlever);
      if (setlever && setlever.leverage == this.leverage) {
        let order = await client.futuresOrder({
          symbol: "BTCUSDT",
          side: side,
          positionSide: "BOTH",
          type: "MARKET",
          quantity: (
            ((this.usdtbalance / 100) * this.amount) /
            this.ticker
          ).toFixed(3),
        });
        this.currentOrder = order;
        console.log(order);

        this.checkPosition();
      } else {
        alert("Check leverage");
      }
    },

    async exit() {
      this.position = await client.futuresPositionRisk({
        symbol: "BTCUSDT",
      });
      console.log(this.position[0], this.position[0].positionAmt);
      let closeOrder = await client.futuresOrder({
        symbol: "BTCUSDT",
        side: this.position[0].positionAmt > 0 ? "SELL" : "BUY",
        positionSide: "BOTH",
        type: "MARKET",
        //closePosition: true,
        quantity: Math.abs(this.position[0].positionAmt),
      });
      console.log(closeOrder);
      this.currentOrder = null;
      clearInterval(this.positionInterval);
      this.getBalance();
    },
  },

  mounted: async function () {
    this.amount = this.$store.state.amount;
    this.leverage = this.$store.state.leverage;

    client = Binance({
      apiKey: this.$store.state.key,
      apiSecret: this.$store.state.secret,
      //getTime: xxx, // time generator function, optional, defaults to () => Date.now()
    });

    //get trade history
    this.getHistory();

    //get position state

    this.checkPosition();

    setInterval(this.checkPosition.bind(this), 3000);

    //get balance

    this.getBalance();
    // let timerId = setInterval(() => {
    //   this.online = client.futuresTime().then((time) => {
    //     console.log(time);
    //     return time;
    //   });
    // }, 5000);

    client.ws.trades("BTCUSDT", (trade) => {
      //console.log(trade);
      this.ticker = parseFloat(trade.price).toFixed(4);
    });

    // client.ws.futuresUser((msg) => {
    //   console.log(msg);
    // });

    // this.ticker = await client
    //   .futuresMarkPrice({ symbol: "BTCUSDT" })
    //   .then((res) => {
    //     console.log(res.markPrice);
    //     if (res.markPrice) return res.markPrice;
    //   })
  },
};
</script>
<style>
.noscroll {
  overscroll-behavior: contain !important;
  position: fixed !important;
}
</style>
