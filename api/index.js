/**
 * mock 模拟数据
 * by tommyshao <tomieric@gmial.com>
 */
const Api = function (app) {
  /* Create */
  app.post('/api/tree/add', function (req, res) {
    let startNum = 1
    const createUUid = function () {
      return req.body.parent_id ? ++startNum + req.body.parent_id * 1e2 : ++startNum
    }

    res.json({
      status: 1,
      code: 0,
      msg: 'ok',
      data: {
        name: req.body.name,
        id: createUUid(),
        parent_id: req.body.parent_id
      }
    })
  })

  /* Update */
  app.post('/api/tree/update', function (req, res) {
    res.json({
      status: 1,
      code: 0,
      msg: 'ok',
      data: req.body
    })
  })

  /* Read */
  app.get('/api/tree/list', function (req, res) {
    const parentId = req.query.parent_id || ''
    let startNum = 1
    const createUUid = function () {
      return parentId ? ++startNum + parentId * 1e2 : ++startNum
    }
    res.json({
      status: 1,
      code: 0,
      msg: 'ok',
      data: [
        {name: `JavaScript${parentId > 0 ? parentId : ''}`, id: createUUid(), parent_id: parentId},
        {name: `React${parentId > 0 ? parentId : ''}`, id: createUUid(), parent_id: parentId},
        {name: `Vue${parentId > 0 ? parentId : ''}`, id: createUUid(), parent_id: parentId},
        {name: `Element-UI${parentId > 0 ? parentId : ''}`, id: createUUid(), parent_id: parentId},
        {name: `Ant.Design${parentId > 0 ? parentId : ''}`, id: createUUid(), parent_id: parentId}
      ]
    })
  })

  /* Delete */
  app.post('/api/tree/delete', function (req, res) {
    res.json({
      status: 1,
      code: 0,
      msg: 'ok',
      data: req.body.id
    })
  })
}

module.exports = Api
