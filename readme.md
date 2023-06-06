# 知了

知了, 支持多用户的开源音乐服务.

![version](https://img.shields.io/github/v/release/mebtte/cicada?style=for-the-badge)
![release build](https://img.shields.io/github/actions/workflow/status/mebtte/cicada/build_and_release.yaml?label=release%20build&style=for-the-badge)
![docker build](https://img.shields.io/github/actions/workflow/status/mebtte/cicada/docker_build_and_push.yaml?label=docker%20build&style=for-the-badge)
![license](https://img.shields.io/github/license/mebtte/cicada?style=for-the-badge)

![](./docs/thumbnail_1.png)
![](./docs/thumbnail_2.png)
![](./docs/thumbnail_3.png)
![](./docs/thumbnail_4.png)
![](./docs/thumbnail_5.png)

## 特色

- **尊重隐私, 不进行任何数据收集**
- 支持多用户
- 支持用户间共享乐单
- 支持导入现有音乐目录/文件
- 支持 [PWA](https://developer.mozilla.org/docs/Web/Progressive_web_apps), 同时适配桌面端和移动端
- 播放列表/播放队列分离, 可定制播放队列
- 支持标注音乐创作来源(翻唱)
- 支持歌词/歌名/歌手/乐单搜索
- 支持系统媒体和系统快捷键
- 暴露 [HTTP API](./apps/pwa/src/server) 支持第三方接入或进行二次开发

## 准备

- **[邮件发送服务](https://zh.wikipedia.org/wiki/%E7%AE%80%E5%8D%95%E9%82%AE%E4%BB%B6%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE)**, 知了使用邮箱验证码进行登录以及部分功能依赖邮箱实现. 使用邮箱验证码登录可以极大地提高安全性, 相比账号密码的登录方式, 邮箱验证码登录可以避免被暴力破解. 第三方邮件发送服务可以参考 [网易邮箱](https://note.youdao.com/ynoteshare/index.html?id=f9fef46114fb922b45460f4f55d96853) / [QQ 邮箱](https://service.mail.qq.com/cgi-bin/help?subtype=1&id=28&no=1001256) / [Outlook 邮箱](https://support.microsoft.com/zh-cn/office/pop-imap-%E5%92%8C-smtp-%E8%AE%BE%E7%BD%AE-8361e398-8af4-4e97-b147-6c6c4ac95353).

## 部署

新建配置文件 `config.json`:

```json
{
  "emailHost": "smtp.example.com",
  "emailUser": "example@example.com",
  "emailPass": "example-password"
}
```

> 完整配置可以参看[配置项](./docs/config/index.md), 支持 JSON/[JSON5](https://json5.org) 语法.

在 [Releases](https://github.com/mebtte/cicada/releases) 下载并解压对应平台的二进制包, 通过下面命令指定配置文件并启动服务:

```sh
# 首次运行将会提示输入首位用户邮箱
./cicada start -c config.json
```

通过 `localhost:8000` 或者 `{{ip}}:8000` 访问知了服务. 目前只提供了几种主流平台的构建包, 其他平台可以参考[构建文档](./docs/build/index.md)自行构建.

### Docker

知了支持 Docker 部署, **启动容器之前请先参考上面准备知了的配置文件**, 需要注意的是首次运行必须配置 [firstUserEmail](./docs/config/index.md#firstUserEmail), 否则无法完成初始化.

> 通过 Docker 运行知了会忽略配置文件中的 [data](./docs/config/index.md#data) 和 [port](./docs/config/index.md#port)

```sh
docker run \
  -d \
  --restart=always \
  -p 8000:80 \
  -v $HOME/cicada/config.json:/config/cicada.json \
  -v $HOME/cicada/data:/data \
  --name cicada \
  mebtte/cicada
```

- 知了容器使用 `80` 端口提供服务, `-p 8000:80` 表示映射到宿主的 `8000` 端口
- 知了容器配置文件位于 `/config/cicada.json`, `-v $HOME/cicada/config.json:/config/cicada.json` 表示映射到宿主的 `$HOME/cicada/config.json`
- 知了容器数据保存在 `/data`, `-v $HOME/cicada/data:/data` 表示映射到宿主的 `$HOME/cicada/data`

如果不希望知了容器以 `root` 运行, 可以通过 `--user {uid}:{gid}` 指定.

### Docker compose

```yml
version: '3'
services:
  cicada:
    restart: always
    container_name: cicada

    # 默认使用 root, 也可以通过 user 指定
    # user: 1000:1000

    image: mebtte/cicada
    ports:
      - 8000:80
    volumes:
      - /path/config.json:/config/cicada.json
      - /path/data:/data
```

## 导入音乐

知了支持导入现有音乐, 通过 `cicada import` 命令可以导入音乐目录或者音乐文件, 需要注意的是音乐文件命名必须要满足以下格式(多个空格会被合并成一个):

```txt
singer1[,singer2][,singer3] - name.format
```

比如 `周杰伦 - 晴天.mp3` / `Jarryd James,BROODS - 1000x.flac` 是支持的命名, `孙燕姿 逆光.mp3` / `漠河舞厅.m4a` 是不支持的命名.

```sh
# 导入音乐目录
cicada import --data /path_to/cicada_data --recursive music_dir

# 导入音乐文件
cicada import --data /path_to/cicada_data music
```

当遇到命名不支持或者格式不支持的文件, 知了将会忽略. 可以通过 `cicada help import` 查看更多选项.

## 从 v0 升级到 v1

v0 升级到 v1 需要对数据进行升级后才能启动服务:

```bash
# 进行数据升级前请先备份
cicada data-upgrade <data>
```

也可以通过 Docker 执行:

```bash
# 默认使用 root 用户, 也可以使用 --user {uid}:{gid} 指定
docker run -it --rm -v <data>:/data mebtte/cicada cicada data-upgrade /data
```

如果不想升级到 v1, 请继续使用 [v0](https://github.com/mebtte/cicada/releases/tag/0.78.1) 版本的包或 Docker 镜像使用标签 `mebtte/cicada:v0`.

## 常见问题

<details>
  <summary>如何迁移数据 ?</summary>

知了所有数据都位于 `{{data}}` 目录下, 将 `{{data}}` 目录复制或者移动即可完成迁移.

</details>

<details>
  <summary>如何安装 PWA ?</summary>

[PWA](https://developer.mozilla.org/docs/Web/Progressive_web_apps) 仅支持 `HTTPS` 或者 `localhost`, 知了目前暂不支持配置 `HTTPS`, 请使用 `nginx` 之类的工具进行 `HTTPS` 反向代理. Chrome 下安装方法请查看[教程](https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DDesktop).

</details>

<details>
  <summary>为什么 iOS/iPadOS 上处于后台时无法自动播放下一首 ?</summary>

目前 Safari 对 PWA 支持度较低, 当页面处于后台时会暂停 JavaScript 的执行导致无法自动下一首, 需要等待 Safari 提高对 PWA 的支持才能解决相关问题.

</details>

## 后续开发

- [ ] 悬浮歌词面板(类似于网易云音乐网页版歌词)
- [ ] 电台
- [ ] 音乐分享(独立页面, 独立资源链接)

## 开源协议

[GPL](./license)

## 贡献者

<a href="https://github.com/mebtte/cicada/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mebtte/cicada" />
</a>

## 星标历史

[![Star History Chart](https://api.star-history.com/svg?repos=mebtte/cicada&type=Timeline)](https://star-history.com/#mebtte/cicada&Timeline)
