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
  </f7-page>
</template>

<script>
export default {
  data() {
    return {
      key: "",
      secret: "",
    };
  },
  methods: {
    // onKeyChange() {
    //   this.$store.commit("setKey", this.key);
    // },
    // onSecretChange() {
    //   this.$store.commit("setSecret", this.secret);
    // },
  },
  watch: {
    key() {
      this.$store.commit("setKey", this.key);
    },
    secret() {
      this.$store.commit("setSecret", this.secret);
    },
  },
  mounted: function () {
    this.key = this.$store.state.key;
    this.secret = this.$store.state.secret;
  },
};
</script>
