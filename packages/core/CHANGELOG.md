# 变更日志

## [1.4.0](https://github.com/CandriaJS/karin-plugin-git/compare/v1.3.0...v1.4.0) (2026-01-31)


### ✨ 新功能

* **core:** 添加仓库绑定功能并重构数据库结构 ([84cbfa9](https://github.com/CandriaJS/karin-plugin-git/commit/84cbfa9dcd7fdc6bc36371b2765fddd23e3ad367))
* **models:** 实现session和bind数据模型 ([84cbfa9](https://github.com/CandriaJS/karin-plugin-git/commit/84cbfa9dcd7fdc6bc36371b2765fddd23e3ad367))
* **web:** 添加平台推送仓库列表配置界面 ([c720bf1](https://github.com/CandriaJS/karin-plugin-git/commit/c720bf169ad727f39484e1e4e3b68c7500e2582e))


### 🐛 错误修复

* **commit:** 优化提交信息查询逻辑 ([84cbfa9](https://github.com/CandriaJS/karin-plugin-git/commit/84cbfa9dcd7fdc6bc36371b2765fddd23e3ad367))


### 🔧 其他更新

* **core:** 更新 nipaw 依赖版本 ([6575fc9](https://github.com/CandriaJS/karin-plugin-git/commit/6575fc9832f56419300be40c48f704159c2f293f))


### ♻️ 代码重构

* **config:** 重构配置文件结构 ([84cbfa9](https://github.com/CandriaJS/karin-plugin-git/commit/84cbfa9dcd7fdc6bc36371b2765fddd23e3ad367))
* **core:** 重构核心实现 ([#14](https://github.com/CandriaJS/karin-plugin-git/issues/14)) ([fa15ee1](https://github.com/CandriaJS/karin-plugin-git/commit/fa15ee174127db957b7b18584daf6ac157cf370a))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @candriajs/template bumped to 1.4.0

## [1.3.0](https://github.com/CandriaJS/karin-plugin-git/compare/v1.2.0...v1.3.0) (2025-11-29)


### ✨ 新功能

* **git:** 添加议题和提交变更的日志记录功能 ([cb7622b](https://github.com/CandriaJS/karin-plugin-git/commit/cb7622b875d7074137eb9ac52cf0a7ee18fd5121))


### 🐛 错误修复

* **admin:** 修正仓库订阅事件处理逻辑 ([3fd76bf](https://github.com/CandriaJS/karin-plugin-git/commit/3fd76bfdcfd52ceb231d829328679b3e33b2e92a))

## [1.2.0](https://github.com/CandriaJS/karin-plugin-git/compare/v1.1.1...v1.2.0) (2025-11-12)


### ✨ 新功能

* **github:** 添加反向代理配置支持 ([e986b98](https://github.com/CandriaJS/karin-plugin-git/commit/e986b98c108c878f49643c981f6029ae678e1077))
* **git:** 支持订阅仓库议题变更推送 ([83718de](https://github.com/CandriaJS/karin-plugin-git/commit/83718dec328349a39670503680352a6b91582ea5))


### ⚡️ 性能优化

* **issue:** 优化问题和推送信息渲染逻辑 ([92dfacc](https://github.com/CandriaJS/karin-plugin-git/commit/92dfacca0af955941a9da61e4189eef29a6e74fb))

## [1.1.1](https://github.com/CandriaJS/karin-plugin-git/compare/v1.1.0...v1.1.1) (2025-11-09)

### 🎡 持续集成

- 修正发版 ([35e5a1d](https://github.com/CandriaJS/karin-plugin-git/commit/35e5a1dcc1b4ec7851d6d307d49d8095add13e9f))

## [1.1.0](https://github.com/CandriaJS/karin-plugin-git/compare/v1.0.0...v1.1.0) (2025-11-09)

### ✨ 新功能

- **admin:** 添加删除订阅仓库功能 ([76302e5](https://github.com/CandriaJS/karin-plugin-git/commit/76302e5b76c6991e2ddd2859f2fe7da4f77150f3))
- **admin:** 添加设置访问令牌命令 ([624313c](https://github.com/CandriaJS/karin-plugin-git/commit/624313c8693e09a80fb32b0c969d951355b5afdc))
- **platform:** 支持多平台仓库订阅与推送 ([0b07a08](https://github.com/CandriaJS/karin-plugin-git/commit/0b07a08a9217c76039ece11437355bb0c3db0c96))
- **push:** 优化GitHub客户端配置与代理支持 ([8388872](https://github.com/CandriaJS/karin-plugin-git/commit/838887284005661cf37efaca5c46986bedbcd028))
- **push:** 实现订阅仓库推送功能 ([6791730](https://github.com/CandriaJS/karin-plugin-git/commit/6791730cbfb8829a3636fd29e30ffd358ec95530))
- **push:** 支持渲染 Markdown 格式的推送消息 ([dce90a7](https://github.com/CandriaJS/karin-plugin-git/commit/dce90a776ff055ab2dfb23137580ba59b486f2e9))
- 增加github 仓库推送订阅功能 ([30bd417](https://github.com/CandriaJS/karin-plugin-git/commit/30bd41732f554c0723a735b1db4ab383cb99d982))

### 🐛 错误修复

- **admin:** 限制添加仓库命令的权限为管理员 ([ee4fbfb](https://github.com/CandriaJS/karin-plugin-git/commit/ee4fbfb9fde8efa839e758ac875f129f2be450cc))
- **commit:** 修复作者头像参数错误 ([a07509b](https://github.com/CandriaJS/karin-plugin-git/commit/a07509b987f3420d7a09d7727e318edd9065e371))
- **commit:** 修复提交日期显示问题 ([734e76e](https://github.com/CandriaJS/karin-plugin-git/commit/734e76ede05d0246ede6e69bedcf4c36edc472ff))
- **date:** 修复 dayjs 插件和语言包的导入路径 ([bd4b9df](https://github.com/CandriaJS/karin-plugin-git/commit/bd4b9df4684fbca7751ae5a868e345cbbc8dcbc6))
- version ([3c24b09](https://github.com/CandriaJS/karin-plugin-git/commit/3c24b099b1e05d8f1829bfe8989baa7c68b3b32c))

### 🔧 其他更新

- **package:** 移除未使用的 @biomejs/biome 依赖 ([bd4b9df](https://github.com/CandriaJS/karin-plugin-git/commit/bd4b9df4684fbca7751ae5a868e345cbbc8dcbc6))
- 初始化仓库 ([cdd4336](https://github.com/CandriaJS/karin-plugin-git/commit/cdd433659521ae8bddc4dc6c788c0423c269333f))

### ♻️ 代码重构

- **db:** 重构数据库结构以支持多平台推送 ([51dc6f5](https://github.com/CandriaJS/karin-plugin-git/commit/51dc6f5738dc47a419457316399d5f27bc57d500))
- **help:** 重构帮助页面为静态资源渲染 ([f0e6b11](https://github.com/CandriaJS/karin-plugin-git/commit/f0e6b1197203927d7b5f88d7b5df2660e9338088))
- **plugin:** 重构 Markdown 渲染逻辑 ([0980b71](https://github.com/CandriaJS/karin-plugin-git/commit/0980b71666d3845791a8a88eeca7c47de7a2af4f))
- **project:** 重构项目结构并优化样式 ([ef3c54e](https://github.com/CandriaJS/karin-plugin-git/commit/ef3c54e37f35125a41a0ab6f7bf2647e7c3d95a0))
- **push:** 重构仓库推送逻辑 ([4d8b521](https://github.com/CandriaJS/karin-plugin-git/commit/4d8b5215fdccdea1dff19b2a9507db1d28e7b71e))
