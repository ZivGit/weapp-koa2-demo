const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wxa8caf93c9ba8e4ab',

    // 微信小程序 App Secret
    appSecret: 'e1f21bef66a0d233b7b933520a4ccc71',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'ZivSQL@2018',
        char: 'utf8mb4'
    },

    timeout: 1000,

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-shanghai',
        // Bucket 名称
        fileBucket: 'heynpc-bucket',
        // 文件夹
        uploadFolder: 'public',
        // 上传最大大小，默认 5M
        maxSize: 5
    },

    // 当前服务器的 hostname
    serverHost: '461269699.heynpc.com',

    // 信道服务器地址
    tunnelServerUrl: 'https://tunnel.ws.qcloud.la',
    // 信道服务签名密钥
    tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',

    // 腾讯云相关配置
    qcloudAppId: '1256085835',
    qcloudSecretId: 'AKIDhGconY5Xmna8SaH9ampeFcmiPsBG2iHf',
    qcloudSecretKey: 'JPOFrFNG8oIZdUDj281lJepnZ8UdYFj0',

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'weixinmsgtoken'
}

module.exports = CONF
