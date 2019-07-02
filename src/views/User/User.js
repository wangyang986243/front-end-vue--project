export default {
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 2,
      pageSize: 3,
      keyword: '',
      isAddUserDialogShow: false,
      isEditUserDialogShow: false,
      //增加用户模态框
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //增加用户 模态框表单验证
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 4,
            max: 12,
            message: '长度在 4到 12 个字符',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '长度在 6到 12 个字符',
            trigger: 'change'
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: '请输入正确的邮箱',
            trigger: 'change'
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确的电话号码',
            trigger: 'change'
          }
        ]
      },
      //修改用户模态框
      editUserForm: {
        id: -1,
        username: '',
        email: '',
        mobile: ''
      },
      //修改用户 模态框表当验证
      editUserRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: '请输入正确的邮箱',
            trigger: 'change'
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确的电话号码',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 封装一个获取数据的axios请求方法
    getUserList() {
      this.$http({
        url: 'users',
        method: 'get',
        params: {
          query: this.keyword,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      }).then(res => {
        let {
          data: { data, meta }
        } = res
        // console.log(res);
        this.tableData = data.users
        this.total = data.total
      })
    },
    //分页功能
    onPageChange(page) {
      // console.log(page);
      this.currentPage = page
      this.getUserList()
    },
    //搜索相匹配的用户
    searchUser() {
      this.getUserList()
    },
    //点击增加用户，跳出增加用户模态框
    addUserDialog() {
      this.isAddUserDialogShow = true
    },
    //添加用户功能实现
    async addUser(addUserForm) {
      try {
        //解释：因为这边校验表单是异步的，所以在async函数里，我们就把它用valid来接收await后面的promise对象
        let valid = await this.$refs[addUserForm].validate()
        // 打印这里的valid 应该是true，如果是true则是校验成功，如果是是false，则是校验不成功，这个时候，就要处理校验不成功的情况，校验不成功又会报错，所以需要把校验不成功的情况放到catch函数里
        console.log('校验成功')
        //发送ajax请求
        let res = await this.$http({
          url: 'users',
          method: 'post',
          data: this.addUserForm
        })
        console.log(res)

        if (res.data.meta.status === 201) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success',
            duration: 1000
          })
          this.isAddUserDialogShow = false
          this.getUserList()
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: 'error',
            duration: 1000
          })
        }
      } catch (err) {
        console.log('校验失败')
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
        method: 'put'
      })
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: 'success',
          duration: 1000
        })
      } else {
        this.$message({
          message: res.data.meta.msg,
          type: 'error',
          duration: 1000
        })
        //{解释：后天请求数据失败之后，页面的switch按钮不应该发生改变，所以这个时候要手动的更改状态}
        row.mg_state = !row.mg_state
      }
    },
    //点击操作的修改用户按钮，跳出修改用户模态框
    editUserDialog(row) {
      this.isEditUserDialogShow = true
      console.log(row)
      this.editUserForm.id = row.id
      this.editUserForm.username = row.username
      this.editUserForm.email = row.email
      this.editUserForm.mobile = row.mobile
    },
    //修改用户功能的实现
    async editUser(editUserForm) {
      try {
        let valid = await this.$refs[editUserForm].validate()
        // console.log(valid);
        let res = await this.$http({
          url: `users/${this.editUserForm.id}`,
          method: 'put',
          data: this.editUserForm
        })
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success',
            duration: 1000
          })
          this.isEditUserDialogShow = false
          this.getUserList()
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: 'error',
            duration: 1000
          })
        }
      } catch (err) {
        console.log('校验失败', err)
      }
    },
    //删除用户
    // deleteUser(id) {
    //   this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       this.$message({
    //         type: "success",
    //         message: "删除成功!"
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除"
    //       });
    //     });
    // }
    async deleteUser(id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        let res = await this.$http({
          url: `users/${id}`,
          method: 'delete',
          data: id
        })
        console.log(res)

        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success',
            duration: 1000
          })
          this.getUserList()
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    }
  }
}
