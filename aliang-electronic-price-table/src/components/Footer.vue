<template>
  <footer>
    <div class="disclaimer_section">
      <span class="weaken">本页面由</span>
      <span class="emphasize">
        <a 
          id="huoban-link" 
          href="https://lilihuyu.com" 
          class=""
          target="_blank" 
          rel="noreferrer"
        >
          礼礼互娱
        </a>
      </span>
      <span class="weaken">提供技术支持</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component for the price table page
</script>

<style scoped lang="less">
.disclaimer_section {
  margin-top: 48px;
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
  justify-content: center;
  padding: 32px;
  font-size: 12px;
  display: flex;
  
  .weaken {
  }
  
  #huoban-link {
    color: rgba(0, 0, 0, 0.65);
    margin: 0 4px;
    text-decoration: none;
    list-style: none;
  }
}
</style>