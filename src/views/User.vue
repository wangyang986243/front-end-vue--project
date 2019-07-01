<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 添加用户栏 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="keyword"
          @keyup.enter.native="searchUser"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="success" plain @click="addUserDialog">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 主体内容 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="stateChange(row)"
          >row</el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="editUserDialog(row)"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete-solid" plain size="mini"></el-button>
          <el-button type="success" plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      @current-change="onPageChange"
    ></el-pagination>
    <!-- 添加用户 模态框 -->
    <el-dialog title="添加用户" :visible.sync="isAddUserDialogShow" label-width="100px">
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input autocomplete="off" v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input autocomplete="off" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input autocomplete="off" v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddUserDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addUser('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户 模态框 -->
    <el-dialog title="修改用户信息" :visible.sync="isEditUserDialogShow" label-width="100px">
      <el-form :model="editUserForm" :rules="editUserRules" ref="editUserForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info" v-text="editUserForm.username"></el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input autocomplete="off" v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditUserDialogShow=false">取 消</el-button>
        <el-button type="primary" @click="editUser('editUserForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 3,
      keyword: "",
      isAddUserDialogShow: false,
      isEditUserDialogShow: false,
      //增加用户模态框
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //增加用户 模态框表单验证
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 4,
            max: 12,
            message: "长度在 4到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6到 12 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "请输入正确的邮箱",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "请输入正确的电话号码",
            trigger: "change"
          }
        ]
      },
      //修改用户模态框
      editUserForm: {
        id: -1,
        username: "",
        email: "",
        mobile: ""
      },
      //修改用户 模态框表当验证
      editUserRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "请输入正确的邮箱",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "请输入正确的电话号码",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 封装一个获取数据的axios请求方法
    getUserList() {
      this.$http({
        url: "users",
        method: "get",
        params: {
          query: this.keyword,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      }).then(res => {
        let {
          data: { data, meta }
        } = res;
        // console.log(res);
        this.tableData = data.users;
        this.total = data.total;
      });
    },
    //分页功能
    onPageChange(page) {
      // console.log(page);
      this.currentPage = page;
      this.getUserList();
    },
    //搜索相匹配的用户
    searchUser() {
      this.getUserList();
    },
    //点击增加用户，跳出增加用户模态框
    addUserDialog() {
      this.isAddUserDialogShow = true;
    },
    //添加用户功能实现
    async addUser(addUserForm) {
      try {
        //解释：因为这边校验表单是异步的，所以在async函数里，我们就把它用valid来接收await后面的promise对象
        let valid = await this.$refs[addUserForm].validate();
        // 打印这里的valid 应该是true，如果是true则是校验成功，如果是是false，则是校验不成功，这个时候，就要处理校验不成功的情况，校验不成功又会报错，所以需要把校验不成功的情况放到catch函数里
        console.log("校验成功");
        //发送ajax请求
        let res = await this.$http({
          url: "users",
          method: "post",
          data: this.addUserForm
        });
        console.log(res);

        if (res.data.meta.status === 201) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          this.isAddUserDialogShow = false;
          this.getUserList();
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: 1000
          });
        }
      } catch (err) {
        console.log("校验失败");
      }
      //没有用async和await的代码
      /* this.$refs[addUserForm].validate(valid => {
          if (valid) {
            this.$http({
              url: "users",
              method: "post",
              data: this.addUserForm
            }).then(res => {
              console.log(res);
              if (res.data.meta.status === 201) {
                this.isAddUserDialogShow = false;
                this.getUserList();
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        }
        ); */
    },
    //用户状态切换
    async stateChange(row) {
      // console.log(row);
      let res = await this.$http({
        url: `users/${row.id}/state/$(row.mg_state)`,
        method: "put"
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: "success",
          duration: 1000
        });
      } else {
        this.$message({
          message: res.data.meta.msg,
          type: "error",
          duration: 1000
        });
        //{解释：后天请求数据失败之后，页面的switch按钮不应该发生改变，所以这个时候要手动的更改状态}
        row.mg_state = !row.mg_state;
      }
    },
    //点击操作的修改用户按钮，跳出修改用户模态框
    editUserDialog(row) {
      this.isEditUserDialogShow = true;
      console.log(row);
      this.editUserForm.id = row.id;
      this.editUserForm.username = row.username;
      this.editUserForm.email = row.email;
      this.editUserForm.mobile = row.mobile;
    },
    //修改用户功能的实现
    async editUser(editUserForm) {
      try {
        let valid = await this.$refs[editUserForm].validate();
        // console.log(valid);
        let res = await this.$http({
          url: `users/${this.editUserForm.id}`,
          method: "put",
          data: this.editUserForm
        });
        console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          this.isEditUserDialogShow = false;
          this.getUserList();
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: 1000
          });
        }
      } catch (err) {
        console.log("校验失败", err);
      }
    }
  }
};
</script>
<style>
.el-breadcrumb {
  background-color: cyan;
  height: 50px;
  line-height: 50px !important;
  font-size: 16px !important;
  padding-left: 10px;
}
.el-form {
  padding: 0;
}
</style>
