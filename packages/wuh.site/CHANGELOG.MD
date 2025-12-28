## 2.1.7 (2021-12-11)



## 2.1.7 (2021-12-11)



## [2.1.7](https://git.zhlh6.cn/stack-wuh/wuh.site/compare/v2.1.6...v2.1.7) (2021-11-16)


### Bug Fixes

* **app:** :fire: 暂时修复home页进明细页状态不能保存的问题 ([7501429](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/75014298f906a71c44a2cbcff357f92679d95668))



## [2.1.6](https://git.zhlh6.cn/stack-wuh/wuh.site/compare/v2.1.5...v2.1.6) (2021-11-14)


### Bug Fixes

* **Audio:** :basecamp: 修复playlist在json文件中的引用错误 ([f9ba925](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/f9ba925138e0a5adfb774fb36916e09a87cdc4a1))
* **CM.AudioControl:** :fire: 压缩原音频文件，改为oss ([64d440b](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/64d440b6adc9b0f7ede6a8fa575b1325391de19e))
* **CM.Button.loadmore:** :fire: 新增LoadMore 防抖处理 ([0916807](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/09168078e20981ff2ad4b0bf46f81443efa2e29d))
* **hooks.useAudio:** :musical_note: 修复Audio的Provider的编译错误 ([7594e40](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/7594e407626c9f667be273ea5dae7d91f2cbdf50))
* **Page.Home:** :fire: 只是一点点优化内容 ([c078470](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/c0784702f6e9f2976f9121d7c91e2760bb54e0aa))
* **page.index:** :fire: 修复banner的查询接口调用多次的问题 ([c311668](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/c3116684998686016b7a1530ce35be37233e2f36))
* **page.post:** :fist: 修复useSWR的key为undefined时，依旧发起请求的问题 ([39d67d3](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/39d67d39cfc58105635f97d720f1c2516959f04e))


### Features

* **CM.Header.Audio:** :airplane: 重构Header右侧区域的AudioControls组件 ([f037562](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/f037562206e57e7395bfee74cd38cfb425353815))
* **CM.Header.Audio:** :musical_note: Header区域新增Music组件 ([2d18dea](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/2d18dea12a8bba5266cd6b2f09b2af4d7e3a00b0))



## [2.1.5](https://git.zhlh6.cn/stack-wuh/wuh.site/compare/v2.0.0...v2.1.5) (2021-11-07)


### Bug Fixes

* **_document:** 修复cookie转换错误的问题 ([686488f](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/686488f6e483b37d74ee58d81075c0613137cd46))
* **api.prefix:** :fire: 修复API路由的前缀错误 ([de6fcc2](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/de6fcc2012a9a688a3ab5f20b42dbb6de922a096))
* **cm.space:** :fire: 修复space组件背景色突出的问题 ([7f9e232](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/7f9e2329b4ea6027c9ffc6424c6e1128bd1d5790))
* **fetch.swr:** :fire: 修复fetch方式build报错问题 ([38b700d](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/38b700d27bc1ed6b20ccd7052dcf19e8b648d54b))
* **page.HOME.Banner:** :four: 修复首页Banner区域不能自动播放问题 ([84e702d](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/84e702dec92c0cd0a2479a28620fe31c687b3862))
* **postinfo:** 修复pagechange事件造成data为null的错误白屏 ([f467c2b](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/f467c2bcae200bdfd7d66768004718e674f47176))


### Features

* **about:** :aries: About页的交互动画 ([ac3eaca](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/ac3eacaefd4f943bf1ddd79713cb699b862c1231))
* **bubble:** :aries: 不再重复新增bubble的样式文件，改为复用标签 ([70ea5a8](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/70ea5a8b4f3cc171984021bd743f0e953e015034))
* **CM.Banner:** :helicopter:  首页新增Banner区间 ([9358dc5](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/9358dc59a1df628abd114eae3a133bfbe8d9eeb6))
* **CM.Button.Gallery:** :aquarius: 新增故乡山川.Gallery模块 ([1875dc2](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/1875dc2e405aacc2653a184a56666e1af9a9fde8))
* **CM.Gallery.Modal:** :bow: 新增故乡山川模块的预览 ([9b5acdf](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/9b5acdfed8a105663e952f456b36d5f57b0034f7))
* **CM.Modal:** :top: 新增Modal对话框组件 ([3355f86](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/3355f86e02b07061a209fd6daa606e13906a2534))
* **cookie:** :libra: 利用cookie的状态持久化 ([8acfcbe](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/8acfcbeea55711645b19f2cd92b6d13a5cc39248))
* **JS.bubble:** :sheep: bubble泡泡改为使用js脚本 ([10242a3](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/10242a325798c86150d75d90572a3cc823c13d0e))
* **js.highlight:**  兼容了ts版本的hljs代码格式化 ([027ecc4](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/027ecc449789d21184e8eb10a6df58d98d8904a2))
* **js.highlight:** :speaker: 兼容了ts版本的hljs代码格式化 ([8d5b071](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/8d5b0712e0a39de81836bc1d924f446f0f782c4c))
* **popup:** :clap: 新增快速点击的一点点交互 ([d8a95ff](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/d8a95ff4a4f77f4aa23ee268a10d79b9f2f13766))
* **seo.title:** 更换首页title，优化seo配置 ([307a091](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/307a091323cb6bac12b2397dcdce4da48bebd1a2))
* **styles:**  修改scss模块的前缀 ([7d75074](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/7d7507448e0495392885f357aac5e3f3967db623))
* **styles:** :speak_no_evil: 修改scss模块的前缀 ([3ff603f](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/3ff603fbbe504a1debd4a77d111f6fccf2c1e004))
* **WebWorkerTheme:** :alarm_clock: 新增webworker任务，根据时间切换web主题 ([b5c6fda](https://git.zhlh6.cn/stack-wuh/wuh.site/commits/b5c6fda20fbb8664b00d7c2a71a83d66b9356491))



# [2.0.0](https://github.com/stack-wuh/wuh.site/compare/v1.6.3...v2.0.0) (2021-10-17)


### Features

* **app.dynamic:** 引入next的动态组件功能 ([e3f3ea1](https://github.com/stack-wuh/wuh.site/commit/e3f3ea1c49f786f6217fc3c8626bf51f99b9d493))
* **CM.Alert:** :postal_horn: 仿写Andt.Alert组件 ([3c90e13](https://github.com/stack-wuh/wuh.site/commit/3c90e1341f7d0afe1c803a76939c326aa7f332b6))
* **CM.Button:** :bulb: 发光发亮 ([93517be](https://github.com/stack-wuh/wuh.site/commit/93517beadae1f48320479afd7a66671dd1811b3e))
* **cm.button:** :busstop: 仿写antd.Button组件 ([c710d1e](https://github.com/stack-wuh/wuh.site/commit/c710d1e673df7530e910eb970c65e843c69ebd87))
* **CM.Button:** :moon: 简单的加入一些滚动事件 ([78baa92](https://github.com/stack-wuh/wuh.site/commit/78baa923fdc4ff5198cc7ed3f812afa48c69f212))
* **CM.Button.behavior:** Button组件加入ref引用 ([696994e](https://github.com/stack-wuh/wuh.site/commit/696994e7dd57a7f556cc20de0b196777f1919745))
* **CM.Button.Group.Behavior:** :station: 迁移行为相关的按钮组 ([bc14835](https://github.com/stack-wuh/wuh.site/commit/bc14835633014753d4779daee9fc42731e874417))
* **CM.Button.Link:** :link: link组来啦 ([29a3b56](https://github.com/stack-wuh/wuh.site/commit/29a3b56ec121b0080554ad1c33d536c95edca04b))
* **CM.Button.Share:**  share组件的提示信息修改 ([acf8dff](https://github.com/stack-wuh/wuh.site/commit/acf8dff073a997ed855949fdd4b2cba69fdc024a))
* **Cm.Button.Share:** :smiley: 给复制按钮来一个简单的交互 ([2c36fdd](https://github.com/stack-wuh/wuh.site/commit/2c36fddb14d523e468fc2cf1d01d909866cd88b4))
* **CM.Button.State:** :smile:  状态持久化 ([0450794](https://github.com/stack-wuh/wuh.site/commit/04507947a747e191746a264f8d4d8d09dbde7998))
* **CM.ButtonGroup:** :smiley: 呦吼~~状态切换按钮组 ([bd706ca](https://github.com/stack-wuh/wuh.site/commit/bd706cab77b1178e29e10c99106a45beec168271))
* **CM.Divider:** :moon: Divider样式调整 ([06714f7](https://github.com/stack-wuh/wuh.site/commit/06714f7342521b6d57c311dd9bc7cdc6800c5271))
* **CM.Divider:** :waning_gibbous_moon: 呦吼给divider加一下动画渐变 ([da08c35](https://github.com/stack-wuh/wuh.site/commit/da08c3504242f2cf9abc626a7d3ca881119565b9))
* **CM.Empty:** :smirk: Empty空状态 ([8f9594e](https://github.com/stack-wuh/wuh.site/commit/8f9594e7476fd4d815f7f9bf99c2011c2e124191))
* **CM.Header:** :smiley: 改一下borderRadius的渐变交互 ([384b2cf](https://github.com/stack-wuh/wuh.site/commit/384b2cf5e37bf8059d039d214685da5195563e6d))
* **CM.Loadmore:** :bulb: loadmore按钮的样式调整 ([a29a1b4](https://github.com/stack-wuh/wuh.site/commit/a29a1b4f5dccdecdf0db229adbe6fc4eb0652317))
* **CM.Space:** :smile: space组件新加入背景色 ([42948e8](https://github.com/stack-wuh/wuh.site/commit/42948e8d7549f282c219cab5a43a4d8567b37d08))
* **CM.Tag:** :crystal_ball: 来自于sass的函数改写一下 ([62d4277](https://github.com/stack-wuh/wuh.site/commit/62d42771474aa7cdde7d1cbd93f3710559b9bcc9))
* **CM.Tag:** :star2: 呦吼，仿写antd.Tag组件 ([e5f8c19](https://github.com/stack-wuh/wuh.site/commit/e5f8c19f40abba125f17d952e4efb64ab6c2d5e0))
* **config.SEO:** :+1: 引入next-seo库 ([4257883](https://github.com/stack-wuh/wuh.site/commit/42578831b06a48e40d3f2335297568d6e12dd99e))
* **docker:** :100: 修复一下docker的配置项目 ([c418358](https://github.com/stack-wuh/wuh.site/commit/c418358a25139e3897df74bac8d59aae751c2f4b))
* **Docker:** :traffic_light: docker config ([e07f1cd](https://github.com/stack-wuh/wuh.site/commit/e07f1cd9ff816ac9a48407b99ed66793aded2234))
* **hooks:** :smiley: 改掉hooks名的前缀 ([fbe0137](https://github.com/stack-wuh/wuh.site/commit/fbe01378eeba04597d9f6d462b8e7ed485ba1ac6))
* **next-api:** :+1: 更换之前的静态文件，使用next的api动态返回 ([8ef561b](https://github.com/stack-wuh/wuh.site/commit/8ef561bf5b3ac497d8837fd6ea7186612dbaa777))
* **Page.About:** :pager: 新增About关于页面 ([a6ea841](https://github.com/stack-wuh/wuh.site/commit/a6ea841728b2f8d2a597c366bc05cd2153ad35ae))
* **Page.transition:** :+1: 页面动画过渡 ([014bc7f](https://github.com/stack-wuh/wuh.site/commit/014bc7f23e775590875d8b1285ad4fabb4bbe881))
* **Perfamance:** :hash: 生成一份网站报告 ([7bf5b87](https://github.com/stack-wuh/wuh.site/commit/7bf5b870cb88b681657f06fbbce4ea1bb194a614))
* **PostInfo:** :page_facing_up: 文章详情页加入版权说明 ([dfdb209](https://github.com/stack-wuh/wuh.site/commit/dfdb209f2fcd4361d2104c67bb685380c23ae3a4))
* **SEO:** 修改一下SEO配置的文章地址 ([b806da1](https://github.com/stack-wuh/wuh.site/commit/b806da1c53d42051670d6f6cbca59a1a5f5cb81f))
* **style.space:** :moon: 🌝space组件的样式兼容 ([b691a4c](https://github.com/stack-wuh/wuh.site/commit/b691a4cbb3b7bfbb92f4c48f99042ca882e86600))
* **style.theme.nav:** :star: 暗黑模式下导航栏的色彩 ([41c11b2](https://github.com/stack-wuh/wuh.site/commit/41c11b2baaf33f5fe11c0a44fb425404fe840d9e))
* **styles:** :star:  更换css文件未scss文件 ([e31cab3](https://github.com/stack-wuh/wuh.site/commit/e31cab3f39b13ca108224642503a1606550dbd57))
* **styles.Home:** :crescent_moon: 调整首页相关的样式 ([7998ca1](https://github.com/stack-wuh/wuh.site/commit/7998ca10976ecab6dd5fca336987c089646ab7cf))
* **styles:** 更新menu部分的样式表 ([d7f1268](https://github.com/stack-wuh/wuh.site/commit/d7f12680698f3c2a8f2a8d89109fbfc878844f89))



