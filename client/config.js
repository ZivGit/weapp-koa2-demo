/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'http://localhost:5757';
// var host = 'https://yjj4cvqp.qcloud.la';
// var host = 'https://461269699.heynpc.com';

var config = {

	// 下面的地址配合云端 Demo 工作
	service: {
		host,

		// 登录地址，用于建立会话
		loginUrl: `${host}/api/login`,

		// 测试的请求地址，用于测试会话
		requestUrl: `${host}/api/user`,

		// 测试的信道服务地址
		tunnelUrl: `${host}/api/tunnel`,

		// 上传图片接口
		uploadUrl: `${host}/api/upload`,

		// evidence
		evidenceUrl: `${host}/api/evidence`,
	},

	cos: {
        // 上传最大大小，默认 5M
        maxSize: 2
    },
};

module.exports = config;
