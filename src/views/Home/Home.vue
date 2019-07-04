<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6">
          <div class="grid-content bg-purple topleft">
            <img src="../../assets/logo.png" alt />
          </div>
        </el-col>
        <el-col>
          <div class="grid-content bg-purple-light">
            <h1>品优购后台管理系统</h1>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple topRight">
            <span>欢迎39期星耀会员</span>
            <a href="#" @click.prevent="loginOut">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- //////////////////////////////////// -->
        <el-row class="tac">
          <el-menu
            :default-active="$route.path"
            :router="true"
            :unique-opened="true"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu v-for="level1 in rightsList " :key="level1.id" :index="''+level1.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{level1.authName}}</span>
              </template>
              <el-menu-item
                v-for="level2 in level1.children"
                :key="level2.id"
                :index="'/'+level2.path"
              >
                <i class="el-icon-menu"></i>
                <span>{{level2.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-row>
        <!-- ////////////////////////////////////// -->
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return { rightsList: [] };
  },
  methods: {
    loginOut() {
      this.$router.push("/login");
      localStorage.removeItem("token");
    }
  },
  async created() {
    let res = await this.$http({
      url: "menus",
      method: "get"
    });
    console.log(res);
    this.rightsList = res.data.data;
  }
};
</script>



<style>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c1cd;
  padding: 0 !important;
}
.el-col {
  text-align: center;
}
.el-col h1 {
  padding: 0;
  margin: 0;
  font-size: 28px;
  color: #fff;
  font-weight: 700;
}
.topleft {
  text-align: left;
}
.topleft img {
  width: 200px;
}
.topRight {
  font-size: 16px;
  font-weight: 700;
  text-align: right;
  padding-right: 20px;
}
.topRight a {
  color: orange;
}
.el-container .el-aside {
  background-color: rgb(84, 92, 100);
}
</style>
