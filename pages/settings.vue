<template>
  <f7-page v-bind:class="{ 'theme-dark': darkTheme }">
    <f7-navbar
      title="Settings"
      back-link="Back"
      @click:back="changeCandles"
    ></f7-navbar>
    <f7-block-title>Enter your API keys</f7-block-title>
    <f7-block strong>
      <div class="item-title item-label">API Key</div>
      <div class="item-input-wrap">
        <input type="text" placeholder="Enter key here" v-model="key" />
        <span class="input-clear-button"></span>
      </div>
      <div class="item-title item-label">API Secret</div>
      <div class="item-input-wrap">
        <input type="text" placeholder="Enter secret here" v-model="secret" />
        <span class="input-clear-button"></span>
      </div>
    </f7-block>

    <f7-block>
      <f7-list>
        <f7-list-item>
          <span>Dark Theme</span>
          <f7-toggle :checked="darkTheme" @change="toggleTheme"></f7-toggle>
        </f7-list-item>
        <f7-list-item>
          <span>Show candles</span>
          <f7-toggle :checked="showCandles" @change="changeSwitch"></f7-toggle>
        </f7-list-item>
        <!-- 
        <f7-list-item
          v-if="showCandles"
          class="my-smart-select smart-select smart-select-init"
          title="Tradingview interval"
          smart-select
          :smart-select-params="{ closeOnSelect: true }"
        >
          <select
            name="Candle Intervals"
            @smartselect:close="console.log('closed')"
          >
            <option
              v-for="(word, index) in wordsList"
              :value="word.value"
              :ref="'ss' + index"
              v-bind:key="index"
              :selected="word.selected"
            >
              {{ word.text }}
            </option>
          </select>
        </f7-list-item> -->
      </f7-list>
    </f7-block>
    <f7-block>
      Binance Buttons ver. {{ version }}<br />
      <a
        href="https://github.com/mpuz/BINBUTT"
        class="link external"
        target="blank"
        >Github</a
      >
    </f7-block>

    <f7-block-title>Support development</f7-block-title>

    <f7-block>
      ETH/ERC-20 USDT:
      <br />
      <a @click="doCopy(erc20)" href="#">{{ erc20 }}</a>
      <br />
      BTC:
      <br />
      <a @click="doCopy(bitcoin)" href="#">{{ bitcoin }}</a>
    </f7-block>
  </f7-page>
</template>

<script>
export default {
  data() {
    return {
      darkTheme: true,
      erc20: "0xb3Aeb01549B07FA0C5bDFc85f367B1f0Ca224c70",
      bitcoin: "39WvJg2rKgBXBZ6FZuv8QKXQNWfDjGe9UK",
      key: "",
      secret: "",
      //interval: "",
      //showCandles: true,
      // wordsList: [
      //   { value: "3", text: "3", selected: false },
      //   { value: "5", text: "5", selected: false },
      //   { value: "10", text: "10", selected: false },
      //   { value: "15", text: "15", selected: false },
      //   { value: "30", text: "30", selected: true },
      //   { value: "60", text: "60", selected: false },
      //   { value: "120", text: "120", selected: false },
      //   { value: "240", text: "240", selected: false },
      //   { value: "480", text: "480", selected: false },
      //   { value: "1D", text: "1D", selected: false },
      //   { value: "1W", text: "1W", selected: false },
      // ],
    };
  },
  computed: {
    version() {
      return process.env.ver;
    },
    showCandles() {
      return this.$store.state.showCandles;
    },
  },
  methods: {
    toggleTheme(obj) {
      this.darkTheme = obj.target.checked; //this.$nuxt.$f7.toggle.get().checked;
      this.$store.commit("darkTheme", this.darkTheme);
    },

    changeSwitch(obj) {
      console.log(obj.target.checked);
      //   this.showCandles = obj.target.checked;
      this.$store.commit("showCandles", obj.target.checked);
    },
    async changeCandles() {
      //   this.interval = await this.$el.querySelector(
      //     ".my-smart-select .smart-select div.item-content div.item-inner div.item-after"
      //   ).innerText;
      //   this.$store.commit("setInterval", this.interval);
      //   console.log("store set to", this.$store.state.interval);
    },
    async doCopy(obj) {
      const text = await this.$copyText(obj);
      console.log(text.text);
      if (text) {
        this.doToast("Copied: " + text.text);
      }
    },
    doToast(msg) {
      if (!toastBottom) {
        var toastBottom = this.$nuxt.$f7.toast.create({
          text: msg,
          closeTimeout: 2000,
        });
      }
      toastBottom.open();
    },
  },
  watch: {
    key() {
      this.$store.commit("setKey", this.key);
    },
    secret() {
      this.$store.commit("setSecret", this.secret);
    },
  },
  created: function () {
    //this.showCandles = this.$store.state.showCandles;
    this.key = this.$store.state.key;
    this.secret = this.$store.state.secret;
    this.darkTheme = this.$store.state.darkTheme;
    //this.interval = this.$store.state.interval;

    //let prev = this.wordsList.map((x) => x.selected).indexOf(true);
    //console.log(prev);
    //this.wordsList[prev].selected = false;

    //let curr = this.wordsList.map((x) => x.text).indexOf(this.interval);
    //this.wordsList[curr].selected = true;
  },
  mounted: async function () {
    //try {
    // this.interval = await this.$el.querySelector(
    //   ".my-smart-select .smart-select div.item-content div.item-inner div.item-after"
    // ).innerText;
    // } catch (e) {
    //   console.log(e);
    // }
    //console.log(this.$nuxt.$f7.smartSelect.get());
  },
};
</script>
<style>
.bottom {
  vertical-align: bottom;
}
</style>
