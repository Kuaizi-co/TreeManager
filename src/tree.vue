<template>
  <div class="kz-tree__wrapper">
    <div class="kz-tree__top">
      <el-button size="small" icon="plus" type="primary" @click="treeAdd({ id: 0 })">分类</el-button>
    </div>
    <el-tree
      ref="kzTree"
      :data="treeData"
      :props="data.defaultProps"
      :expand-on-click-node="false"
      lazy
      :load="loadTreeNode"
      @node-click="handleNodeClick"
      :render-content="nodeRender"
      class="kz-tree">
    </el-tree>
    <!--dialog-->
    <el-dialog :title="dialog.title" v-model="dialog.visible" :close-on-click-modal="false">
      <el-form :model="dialog.form" ref="dialogForm" :rules="dialog.rules" class="el-col-offset-4">
        <el-form-item label="标签名称" prop="name" label-width="120" required>
          <el-input v-model="dialog.form.name" auto-complete="off" class="el-col-12"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="dialog.submiting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'kz-tree',
    props: {
      data: {
        type: Object,
        required: true,
        default () {
          return {
            // 默认tree-node的字段名
            defaultProps: {
              children: 'children',
              label: 'name',
              isLeaf: 'isLeaf'
            },
            // 异步ajax地址
            // CURD
            url: {
              C: '',
              U: '',
              R: '',
              D: ''
            }
          }
        }
      }
    },
    data () {
      // 声明保存当前操作分类node对象
      this.__currentNode = null
      return {
        treeData: [],
        /* 弹框 */
        dialog: {
          title: '增加分类',
          visible: false,
          submiting: false,
          form: {
            name: '',
            id: '',
            parent_id: 0
          },
          rules: {
            name: {
              required: true,
              message: '请输入分类名称',
              trigger: 'blur'
            }
          }
        }
      }
    },
    methods: {
      /* 加载子分类 */
      loadTreeNode (treeItem, resolve) {
        const url = this.data.url.R
        this.fetch(url, { parent_id: treeItem.id })
            .then(data => {
              resolve(data)
            })
      },
      /* 点击响应时间 */
      handleNodeClick (...args) {
        this.$emit('node-click', ...args)
      },
      /* 构建分类title及工具 */
      nodeRender (h, { _self, node, data }) {
        // @todo: 使用jsx插件更好理解
        const childrenNodes = data.id === 0 ? [h('span', data.name)] : [
          h('span', data.name),
          h('span',
            {
              'class': 'kz-tree-bar'
            },
            [
              // 编辑
              h('i', {
                'class': 'el-icon-edit',
                on: {
                  click: function (event) {
                    event.stopPropagation()
                    typeof _self.treeEdit === 'function' && _self.treeEdit(data, event, node)
                  }
                }
              }),
              // 添加
              h('i', {
                'class': 'el-icon-plus',
                on: {
                  click: function (event) {
                    event.stopPropagation()
                    typeof _self.treeAdd === 'function' && _self.treeAdd(data, event, node)
                  }
                }
              }),
              // 删除
              h('i', {
                'class': 'el-icon-close',
                props: {
                  'v-popover': 'delTreeConfirm'
                },
                on: {
                  click: function (event) {
                    event.stopPropagation()
                    typeof _self.treeDelete === 'function' && _self.treeDelete(data, event, node)
                  }
                }
              })
            ]
          )
        ]
        return h(
          'div',
          {
            'class': 'el-tree-node__label',
            prop: {
              children: '-'
            }
          },
          childrenNodes
        )
      },
      /* 添加 */
      treeAdd (treeItem, event, node) {
        this.__currentNode = node
        Object.assign(this.dialog, {
          title: '增加分类',
          visible: true,
          form: {
            name: '',
            id: '',
            parent_id: treeItem.id
          }
        })
      },
      /* 编辑 */
      treeEdit (treeItem, event, node) {
        this.__currentNode = node
        Object.assign(this.dialog, {
          title: '编辑分类',
          visible: true,
          form: {
            name: treeItem.name,
            id: treeItem.id,
            parent_id: treeItem.parent_id
          }
        })
      },
      /* 删除 */
      treeDelete (treeItem, event, node) {
        const fetchDelOk = () => {
          // ajax
          const url = this.data.url.D
          this.fetch(url, { id: treeItem.id }, 'post').then(data => {
            // 使用实例对象的removeChild方法
            // hack
            // https://github.com/ElemeFE/element/blob/dev/packages/tree/src/model/node.js#L187
            try {
              node.parent.removeChild(node)
            } catch (err) { console.error(err) }
            // 提示结果
            this.$notify({ message: '删除成功', type: 'success' })
          })
        }
        // 询问提示
        this.$confirm('是否删除此分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(fetchDelOk).catch(e => e)
      },
      /* ajax封装 */
      fetch (url, data, type = 'GET') {
        const success = (data, resolve, reject) => {
          if (data.status === 1) {
            resolve(data.data)
          } else {
            console.error(`${data.code}: ${data.message}`)
            reject(data)
          }
        }
        return new Promise((resolve, reject) => {
          if (type.toLowerCase() === 'post') {
            this.$http.post(url, data)
                      .then(res => res.json())
                      .then(data => success(data, resolve, reject))
          } else {
            if (data) {
              const dataUrl = Object.keys(data).map(item => `${item}=${data[item]}`)
              url = url + (url.indexOf('?') > -1 ? '' : '?') + dataUrl.join('&')
            }

            this.$http.get(url)
                  .then(res => res.json())
                  .then(data => success(data, resolve, reject))
          }
        })
      },
      /* ######## */
      /* 其他 */
      cancelSubmit () {
        this.dialog.visible = false
        this.$refs.dialogForm.resetFields()
      },
      submitForm () {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) { // 验证通过
            this.fetchAddTreeNode()
          } else {
            return false
          }
        })
      },
      fetchAddTreeNode () {
        const url = this.dialog.form.id ? this.data.url.U : this.data.url.C
        this.dialog.submiting = true
        this.fetch(url, this.dialog.form, 'post')
            .then(data => {
              /* 隐藏dialog */
              Object.assign(this.dialog, {
                submiting: false,
                visible: false
              })
              this.$refs.dialogForm.resetFields()
              /* 提示结果 */
              const message = this.dialog.form.id ? '编辑成功' : '添加成功'
              this.$message({ message: message, type: 'success' })

              if (this.dialog.form.id) { // 编辑
                this.__currentNode && this.$set(this.__currentNode, 'data', data)
              } else { // 新增
                /* treeNode api */
                if (this.__currentNode) { // 子分类添加子类
                  this.__currentNode.doCreateChildren([data])
                } else if (data.parent_id === 0) { // 顶级添加子类
                  this.$refs.kzTree.root.doCreateChildren([data])
                }
              }
            })
      }
    }
  }
</script>

<style>
  .kz-tree__wrapper {
    min-width: 300px;
    text-align: left;
  }
  .kz-tree__top {
    padding: 10px;
    text-align: right;
    border-bottom: 1px solid #ddd;
  }
  .el-tree-node {
    position: relative;
  }
  .el-tree-node__content:hover .kz-tree-bar {
    display: block;
  }
  .kz-tree-bar {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 12px;
  }

  .kz-tree-bar > i {
    margin: 0 5px;
    color: #999;
  }
  .kz-tree-bar > i:hover {
    color: #20a0ff;
  }
</style>
