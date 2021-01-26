<template>
  <no-ssr>
    <f7-page
      class="noscroll"
      @page:afterin="pageAfterInHandler"
      v-bind:class="{ 'theme-dark': $store.state.darkTheme }"
    >
      <f7-navbar class="navbar noscroll">
        <f7-nav-left>
          <f7-button
            small
            class="display-flex panel-open"
            icon-f7="bars"
            href="#"
            data-panel="#panel-nested"
          ></f7-button>
        </f7-nav-left>
        <f7-nav-title>
          <span v-if="ticker.price.length"
            >{{ ticker.symbol + " : " }}
            {{ ticker.price.length && ticker.price.split(".")[0] }}</span
          >
          <f7-preloader v-if="!ticker.price.length" color="white" />
        </f7-nav-title>
        <f7-nav-right>
          <f7-button
            small
            class="link display-flex"
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
            <f7-block-title
              >Trades History
              <f7-button
                small
                class="panel-close float-right"
                icon-f7="xmark"
              ></f7-button>
            </f7-block-title>

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

      <f7-row class="align-items-stretch" style="height: 100%">
        <f7-col width="100" medium="60">
          <!-- <f7-block> -->
          <VueTradingView
            :options="themed"
            :key="refreshkey"
            v-if="$store.state.showCandles"
          />
          <!-- </f7-block> -->
        </f7-col>
        <f7-col width="100" medium="40">
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
              {{ position && parseFloat(position[0].notional).toFixed(2)
              }}<span style="color: grey">X</span
              >{{ position ? position[0].leverage : "" }}
              | PnL: USDT
              {{
                parseFloat(position && position[0].unRealizedProfit).toFixed(4)
              }}
              <br />ENTRY:
              {{ position && position[0].entryPrice.split(".")[0] }} |
              LIQIDATION:
              {{ position && position[0].liquidationPrice.split(".")[0] }}
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
            <p>
              AMOUNT: {{ amount }} % of DEPOSIT
              <span>({{ (usdtbalance / 100) * amount }} USDT)</span>
            </p>
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
        </f7-col>
      </f7-row>
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
var client0 = null;

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
        hide_top_toolbar: false,
        hide_legend: true,
        timezone: "Etc/UTC",
      },
      ticker: {
        symbol: "",
        price: "",
      },
      refreshkey: 0,
      showCandles: true,
      processing: false,
      amount: 5,
      leverage: 10,
      online: false,
      balance: "",
      usdtbalance: "",
      bnbbalance: "",
      position: null,
      trades: null,
      currentOrder: null,
      candles: [],
      checkPosInt: null,
      checkPriceInt: null,
      INTERVAL: 10000,
    };
  },
  computed: {
    themed: function () {
      this.options.theme = this.$store.state.darkTheme ? "dark" : "light";
      return this.options;
    },
  },
  head() {
    return {
      title: this.ticker.price && this.ticker.price.split(".")[0],
    };
  },
  methods: {
    async getPrice() {
      let tmp = await client0.futuresMarkPrice({ symbol: "BTCUSDT" });
      this.ticker = {
        symbol: tmp.symbol,
        price: tmp.markPrice,
      };

      //console.log(this.ticker);
    },
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
      } else {
        let position = await client.futuresPositionRisk({
          symbol: "BTCUSDT",
        });
        //console.log("position", position);
        this.position = position;
        if (position && position[0].unRealizedProfit != 0) {
          this.processing = false;
          /////STOP price fetching for header and use position mark price instead
          clearInterval(this.checkPriceInt);
          if (!this.checkPosInt) {
            this.checkPosInt = setInterval(
              this.checkPosition.bind(this),
              this.INTERVAL
            );
          }
          this.ticker.price = this.position[0].markPrice;
          this.ticker.symbol = this.position[0].symbol;
        } else {
          clearInterval(this.checkPosInt);
          this.position = null;
          if (!this.checkPriceInt) {
            this.checkPriceInt = setInterval(
              this.getPrice.bind(this),
              this.INTERVAL
            );
          }
        }
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
      } else {
        this.balance = await client.futuresAccountBalance();
        //console.log(this.balance);
        if (this.balance[0].balance) {
          this.usdtbalance = parseFloat(this.balance[0].balance).toFixed(0);
          this.bnbbalance = parseFloat(this.balance[1].balance).toFixed(2);
          this.online = true;
        }
      }
    },
    async getHistory() {
      if (!this.$store.state.key && !this.$store.state.secret) {
        this.processing = true;

        //alert("API keys are not set in the Settings");
        return;
      } else {
        let trades = await client.futuresUserTrades({
          symbol: "BTCUSDT",
        });

        //grouping by order id
        var grouped = await _.mapValues(_.groupBy(trades, "orderId"), (clist) =>
          clist.map((trade) => _.omit(trade, "make"))
        );
        this.trades = Object.entries(grouped).reverse();
        //console.log("trades: ", Object.entries(grouped).reverse());
      }
    },

    async order(side) {
      if (!this.$store.state.key || !this.$store.state.secret) {
        alert("API keys are not set in the Settings");
        return;
      } else {
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
              parseFloat(this.ticker.price)
            ).toFixed(3),
          });
          this.currentOrder = order;
          //console.log(order);
          this.checkPosition();

          //this.checkPosition();
        } else {
          alert("Check leverage");
        }
      }
    },

    async exit() {
      if (!this.$store.state.key && !this.$store.state.secret) {
        alert("API keys are not set in the Settings");
        return;
      } else {
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
        //clearInterval(this.checkPosInt);
        this.checkPriceInt = setInterval(
          this.getPrice.bind(this),
          this.INTERVAL
        );
        await this.getBalance();
        await this.checkPosition();
        this.processing = false;
      }
    },
    pageAfterInHandler() {
      //this.options.interval = this.$store.state.interval;
      this.$nextTick(() => {
        //console.log(this.$store.state.darkTheme);
        this.refreshkey += 1;
      });
      //console.log("setting interval candle", this.options.interval);
      // this.$nextTick(() => {
      //   this.showCandles = this.$store.state.showCandles;
      // });
    },
  },
  watch: {},
  created() {
    //this.showCandles = this.$store.state.showCandles;
  },
  destroyed() {
    //console.log("beforedestroy");
    clearInterval(this.checkPriceInt);
    clearInterval(this.checkPosInt);
  },
  mounted: async function () {
    this.leverage = this.$store.state.leverage;
    this.amount = this.$store.state.amount;
    client = Binance({
      apiKey: this.$store.state.key,
      apiSecret: this.$store.state.secret,
    });
    client0 = Binance({});

    //console.log(this.$nuxt.$f7);
    //console.log(this.$store.state.interval);

    //TODO - check and set margin type

    //set isolated margin
    // await client.futuresMarginType({
    //   symbol: "BTCUSDT",
    //   marginType: "ISOLATED",
    // });

    //console.log("Google Analiticus ID:", process.env.goo);

    this.getPrice();

    this.getHistory();

    this.checkPosition();

    this.getBalance();

    // if (process.client) {
    //   client.ws.trades("BTCUSDT", (trade) => {
    //     //console.log(trade);
    //     this.ticker = parseFloat(trade.price).toFixed(4);
    //   });
    //   // client.ws.candles("BTCUSDT", "5m", (msg) => {
    //   //   console.log(msg);
    //   // });
    // }
  },
};
</script>
<style>
.noscroll {
  overscroll-behavior: contain !important;
  position: fixed !important;
}
#vue-trading-view {
  width: 100% !important;
  height: 100% !important;
}
row {
  height: 100% !important;
}
</style>
