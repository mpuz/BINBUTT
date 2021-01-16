<template>
  <no-ssr>
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

      <f7-block>
        <VueTradingView :options="options" />
      </f7-block>

      <f7-block>
        <p>
          Status:
          <span v-bind:style="{ color: online ? 'green' : 'red' }">{{
            online ? "ONLINE" : "OFFLINE"
          }}</span>
          <span> | {{ usdtbalance }} USDT | {{ bnbbalance }} BNB</span>
        </p>

        <p>
          {{
            position && position[0].positionAmt > 0
              ? "LONG: USDT "
              : position && position[0].positionAmt < 0
              ? "SHORT: USDT "
              : "NO POSITIONS: "
          }}
          {{ position && parseFloat(position[0].notional).toFixed(2) }} | PnL:
          USDT
          {{ parseFloat(position && position[0].unRealizedProfit).toFixed(4) }}
        </p>
      </f7-block>
      <f7-block>
        <f7-row>
          <f7-col>
            <f7-button
              large
              fill
              color="green"
              @click="order('BUY')"
              :disabled="processing"
              >LONG</f7-button
            >
          </f7-col>
          <f7-col>
            <f7-button
              large
              fill
              color="blue"
              @click="exit()"
              :disabled="processing"
              >EXIT</f7-button
            >
          </f7-col>
          <f7-col>
            <f7-button
              large
              fill
              color="red"
              @click="order('SELL')"
              :disabled="processing"
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
  </no-ssr>
</template>

<script>
import Binance from "binance-api-node";
import { mapValues, omit, groupBy } from "lodash";
import VueTradingView from "vue-trading-view/src/vue-trading-view";

var client = null;

export default {
  // props: {
  //   msg: String,
  // },
  components: {
    VueTradingView,
  },

  data() {
    return {
      options: {
        autosize: true,
        symbol: "BINANCE:BTCPERP",
        theme: "light",
        interval: "5",
        style: "1",
        hide_top_toolbar: true,
        hide_legend: true,
        timezone: "Etc/UTC",
      },
      processing: false,
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
      candles: [],
      checkInt: null,
    };
  },
  methods: {
    // async getCandles() {
    //   let candles = await client.futuresCandles({
    //     symbol: "BTCUSDT",
    //     interval: "5m",
    //     limit: 100,
    //   });
    //   console.log(candles);
    //   this.candles = candles;
    // },
    async checkPosition() {
      if (!this.$store.state.key && !this.$store.state.secret) {
        //alert("API keys are not set in the Settings");
        this.processing = true;
        return;
      }
      let position = await client.futuresPositionRisk({
        symbol: "BTCUSDT",
      });
      console.log("position", position);
      this.position = position;
      if (position && position[0].unRealizedProfit != 0) {
        this.processing = false;
      }
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
      let res = await client.futuresLeverage({
        symbol: "BTCUSDT",
        leverage: this.leverage,
      });
      console.log(res);
      return res;
    },
    async getBalance() {
      if (!this.$store.state.key && !this.$store.state.secret) {
        this.processing = true;

        //alert("API keys are not set in the Settings");
        return;
      }
      this.balance = await client.futuresAccountBalance();
      console.log(this.balance);
      if (this.balance[0].balance) {
        this.usdtbalance = parseFloat(this.balance[0].balance).toFixed(0);
        this.bnbbalance = parseFloat(this.balance[1].balance).toFixed(2);
        this.online = true;
      }
    },
    async getHistory() {
      if (!this.$store.state.key && !this.$store.state.secret) {
        this.processing = true;

        //alert("API keys are not set in the Settings");
        return;
      }
      let trades = await client.futuresUserTrades({
        symbol: "BTCUSDT",
      });

      //grouping by order id
      var grouped = await _.mapValues(_.groupBy(trades, "orderId"), (clist) =>
        clist.map((trade) => _.omit(trade, "make"))
      );
      this.trades = Object.entries(grouped).reverse();
      //console.log("trades: ", Object.entries(grouped).reverse());
    },

    async order(side) {
      if (!this.$store.state.key && !this.$store.state.secret) {
        alert("API keys are not set in the Settings");
        return;
      }
      this.processing = true;
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
        //console.log(order);
        this.checkInt = setInterval(this.checkPosition.bind(this), 3000);

        //this.checkPosition();
      } else {
        alert("Check leverage");
      }
    },

    async exit() {
      if (!this.$store.state.key && !this.$store.state.secret) {
        alert("API keys are not set in the Settings");
        return;
      }
      this.processing = true;
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
      //console.log(closeOrder);
      this.currentOrder = null;
      clearInterval(this.checkInt);

      await this.getBalance();
      await this.checkPosition();
      this.processing = false;
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

    //set isolated margin
    // await client.futuresMarginType({
    //   symbol: "BTCUSDT",
    //   marginType: "ISOLATED",
    // });

    //get user's orders history
    this.getHistory();

    //get position state

    this.checkPosition();

    //get balance

    this.getBalance();

    if (process.client) {
      client.ws.trades("BTCUSDT", (trade) => {
        //console.log(trade);
        this.ticker = parseFloat(trade.price).toFixed(4);
      });
      // client.ws.candles("BTCUSDT", "5m", (msg) => {
      //   console.log(msg);
      // });
    }
  },
};
</script>
<style>
.noscroll {
  overscroll-behavior: contain !important;
  position: fixed !important;
}
</style>
