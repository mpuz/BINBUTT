<template>
  <f7-page>
    <f7-navbar title="Settings" back-link="Back"></f7-navbar>
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
        <f7-list-item
          class="my-smart-select smart-select smart-select-init"
          title="Tradingview interval"
          smart-select
          :smart-select-params="{ closeOnSelect: true }"
          ref="ss1"
        >
          <select name="Candle Intervals">
            <option
              v-for="(word, index) in wordsList"
              :value="word.value"
              :ref="'ss' + index"
              v-bind:key="index"
            >
              {{ word.text }}
            </option>
          </select>
        </f7-list-item>
      </f7-list>
    </f7-block>
  </f7-page>
</template>

<script>
export default {
  data() {
    return {
      key: "",
      secret: "",
      interval: "",
      wordsList: [
        { value: "3", text: "3m" },
        { value: "5", text: "5m" },
        { value: "10", text: "10m" },
        { value: "15", text: "15m" },
        { value: "30", text: "30m" },
        { value: "1H", text: "1H" },
        { value: "2H", text: "2H" },
        { value: "3H", text: "3H" },
        { value: "6H", text: "6H" },
        { value: "12H", text: "12H" },
        { value: "1D", text: "1D" },
        { value: "1HW", text: "1W" },
      ],
    };
  },
  methods: {},
  watch: {
    key() {
      this.$store.commit("setKey", this.key);
    },
    secret() {
      this.$store.commit("setSecret", this.secret);
    },
  },
  mounted: async function () {
    this.key = this.$store.state.key;
    this.secret = this.$store.state.secret;
    this.interval = this.$el.querySelector(".item-after").innerText;
    //this.interval = this.$refs["ss1"].lastChild.value;
    console.log(this.interval);
  },
};
</script>

