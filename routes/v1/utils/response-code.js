module.exports = {
  2000: {
    success: true,
    message: 'success',
  },

  // 3*** 服务器错误
  // 3100 资源错误

  3101: {
    success: false,
    message: 'Resources error.',
  },

  // 4*** 客户端错误
  // 41** 权限错误
  // 42** 参数错误

  4201: {
    success: false,
    message: 'Parameter(s) required was lacked.',
  },

  4202: {
    success: false,
    message: 'Please make sure parameter(s) were correct.',
  },
};
