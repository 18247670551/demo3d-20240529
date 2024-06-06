<template>

  <div class="page">

    <div class="title">用户协议</div>

    <div class="date">
      <div>
        更新日期: 2023年09月20日
      </div>
      <div>
        生效日期: 2023年09月20日
      </div>
    </div>

    <div class="content">
      <div class="row" v-for="item in content" :key="item">
        {{item}}
      </div>
    </div>

  </div>

</template>

<style lang="scss" scoped>
.page{
  padding: 20px;

  .title{
    text-align: center;
    font-size: 20px;
    color: #409eff;
  }

  .date{
    margin: 16px 0;
    font-size: 14px;
    color: #999;
    line-height: 1.5em;
  }

  .content{
    .row{
      margin: 10px 0;
      font-size: 14px;
      color: #333;
      line-height: 1.5em;
    }
  }
}
</style>

<script lang="ts" setup>

const content = [
    '为使用XX云平台，你应当阅读并遵守《用户协议》(以下简称”本协议”), 请您务必审慎阅读，充分理解各条件内容。 在使用平台服务过程中，应严格遵守以下义务:',
    '1. 不得传输或发表损害国家、社会公共利益和涉及国家安全的信息资料或言论。',
    '2. 不利用本站从事窃取商业秘密、窃取个人信息等违法犯罪活动。',
    '3. 不采取不正当竞争行为，不扰乱网上的正常秩序。',
    '4. 不发布任何侵犯他人著作权、商标权等知识产权或合法权利的内容。',
    '5. 不以虚构或歪曲事实的方式不当评价其他会员。',
    '6. 不对平台上的任何数据作商业性利用，包括但不限于在未经事先书面同意的情况下，以复制、传播等任何方式使用平台上展示的资料。不使用任何装置、软件或程序干预平台的正常运营。'
]

</script>