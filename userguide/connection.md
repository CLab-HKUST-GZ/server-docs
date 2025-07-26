# 连接指南

本文档旨在引导您安全、高效地远程连接到服务器集群进行开发和计算工作。

## 1\. 通过 SSH 连接服务器 (推荐)

SSH (Secure Shell) 是连接到远程服务器最常用、最安全的方式。我们**强烈推荐**使用密钥对认证，而不是密码认证，因为它更安全、更便捷。

### 1.1. 生成 SSH 密钥对

首先，您需要在**您自己的本地电脑**上生成一个 SSH 密钥对（一个私钥，一个公钥）。

打开您本地电脑的终端 (Terminal) 或 PowerShell，运行以下命令：

```bash
# -t 指定加密算法为 ed25519 (更现代、更安全)
# -C "your_email@example.com" 是一个注释，方便您识别密钥
ssh-keygen -t ed25519 -C "your_email@example.com"
```

程序会提示您：

  * **输入文件保存位置**：直接按回车键 (Enter) 使用默认位置即可。通常是 `~/.ssh/id_ed25519` (私钥) 和 `~/.ssh/id_ed25519.pub` (公钥)。
  * **输入密码 (passphrase)**：强烈建议您为私钥设置一个高强度的密码。这样即使您的私钥文件被盗，没有密码也无法使用。输入时密码不会显示。

### 1.2. 上传公钥到服务器

接下来，需要将您的**公钥** (`id_ed25519.pub`) 的内容添加到服务器上一个名为 `~/.ssh/authorized_keys` 的文件中。`ssh-copy-id` 命令可以自动完成这个过程。

在您**本地电脑**的终端中运行以下命令（将 `username` 和 `your_server_hostname` 替换为您的实际用户名和服务器地址）：

```bash
ssh-copy-id username@your_server_hostname
```

系统会要求您输入一次服务器的登录密码。成功后，您的公钥就被自动添加到了服务器的信任列表里。

> **备选方案**：如果您的本地电脑没有 `ssh-copy-id` 命令 (例如某些 Windows 版本)，可以手动复制：
>
> 1.  在本地电脑上，查看并复制公钥文件的内容 (`cat ~/.ssh/id_ed25519.pub`)。
> 2.  通过密码登录到远程服务器 (`ssh username@your_server_hostname`)。
> 3.  在服务器上，将您复制的公钥内容追加到 `~/.ssh/authorized_keys` 文件中 (`echo "公钥内容粘贴到这里" >> ~/.ssh/authorized_keys`)。请确保 `~/.ssh` 目录和 `authorized_keys` 文件的权限正确 (`chmod 700 ~/.ssh` 和 `chmod 600 ~/.ssh/authorized_keys`)。

### 1.3. 使用私钥连接服务器

现在，您可以无需密码，直接通过私钥登录服务器了。

```bash
ssh username@your_server_hostname
```

如果您为私钥设置了密码 (passphrase)，系统会提示您输入该密码。

> #### 💡 **最佳实践 (Best Practice)**
>
>   * **禁用密码登录**：为了达到最高安全性，管理员可以在服务器上完全禁用密码登录，只允许密钥登录。
>
>   * **使用 SSH 配置文件**：为了简化连接，可以在本地电脑的 `~/.ssh/config` 文件中为服务器创建一个别名。
>
>     ```text
>     # ~/.ssh/config 文件内容示例
>     Host my-cluster
>         HostName your_server_hostname
>         User username
>         IdentityFile ~/.ssh/id_ed25519
>     ```
>
>     配置后，您只需运行 `ssh my-cluster` 即可登录。

-----

## 2\. 配置 VS Code 进行远程开发

VS Code 的 Remote - SSH 插件可以让您直接在本地 VS Code 编辑器中打开服务器上的文件夹，并获得完整的开发体验（终端、调试、Git等）。

### 2.1. 安装插件

在 VS Code 的插件市场中搜索并安装 **Remote - SSH** 插件。

### 2.2. 连接到服务器

1.  安装插件后，VS Code 左侧活动栏会出现一个新的“远程资源管理器”图标。
2.  点击该图标，在下拉菜单中选择 "SSH"。
3.  如果您在[上一节](https://www.google.com/search?q=%2313-%E4%BD%BF%E7%94%A8%E7%A7%81%E9%92%A5%E8%BF%9E%E6%8E%A5%E6%9C%8D%E5%8A%A1%E5%99%A8)已经配置了 `~/.ssh/config` 文件，您将直接看到 `my-cluster` 这个别名。将鼠标悬停在它上面，然后点击右侧出现的“连接到主机”图标（一个带加号的文件夹）。
4.  如果没有配置 `config` 文件，可以点击顶部的输入框，然后输入 `ssh username@your_server_hostname` 并按回车。
5.  一个新的 VS Code 窗口将打开，并开始连接到您的服务器。连接成功后，左下角会显示服务器地址，例如 `SSH: your_server_hostname`。
6.  现在，您可以通过 `文件 > 打开文件夹...` 来直接浏览和打开服务器上的项目目录。

> #### 💡 **最佳实践 (Best Practice)**
>
>   * **利用配置文件**：强烈建议使用 SSH `config` 文件。它不仅简化了登录，也让 VS Code 的管理变得井井有条。
>   * **保持插件更新**：定期更新 Remote - SSH 插件以获得最佳性能和安全性。

-----

## 3\. 使用 VNC 连接远程桌面

如果您需要图形用户界面 (GUI)，可以使用 VNC (Virtual Network Computing)。

### 3.1. 在服务器上启动 VNC 服务

首先，通过 SSH 登录到您的服务器，然后运行以下命令来启动一个新的 VNC 会话：

```bash
# 第一次运行时，它会要求您设置一个专门用于 VNC 连接的密码
vncserver
```

该命令会创建一个新的桌面会话，并告诉您会话的编号，通常是 `:1` 或 `:2`。记下这个编号。这个编号对应的网络端口是 `5900 + 编号` (例如，`:1` 对应端口 `5901`)。

### 3.2. 安全地连接到 VNC

**重要提示**：标准的 VNC 流量是**未加密**的，直接在公网上暴露 VNC 端口非常危险。我们必须使用 SSH 隧道来加密连接。

1.  **保持 SSH 连接不要断开**。在**您的本地电脑**上，打开一个新的终端窗口，运行以下命令来建立 SSH 隧道：

    ```bash
    # 将本地的 5901 端口流量，通过加密的 SSH 隧道转发到服务器的 5901 端口
    # -L [本地端口]:[目标地址]:[目标端口] [SSH连接]
    ssh -L 5901:localhost:5901 username@your_server_hostname
    ```

      * 第一个 `5901` 是您本地电脑上的端口，您可以改成其他未被占用的端口。
      * `localhost:5901` 指的是服务器自己（`localhost`）上的 `5901` 端口（对应 VNC 会话 `:1`）。
      * 此命令会建立一个 SSH 连接，请让这个终端窗口保持运行状态。

2.  在**您的本地电脑**上，打开 VNC 客户端（如 [RealVNC Viewer](https://www.realvnc.com/en/connect/download/viewer/) 或 [TigerVNC](https://tigervnc.org/)）。

3.  在 VNC 客户端的地址栏中，输入 `localhost:1` 或者 `localhost:5901` 并连接。

4.  VNC 客户端会提示您输入密码，这里输入您在服务器上运行 `vncserver` 命令时设置的**VNC 专用密码**。

5.  连接成功后，您将看到服务器的远程桌面。

### 3.3. 关闭 VNC 会话

当您使用完毕后，为了节省服务器资源，请通过 SSH 登录服务器并关闭 VNC 会话：

```bash
# -kill 后面跟上会话编号
vncserver -kill :1
```

> #### 💡 **最佳实践 (Best Practice)**
>
>   * **永远使用 SSH 隧道**：绝对不要将 VNC 端口直接暴露在防火墙之外。始终通过 SSH 隧道进行连接。
>   * **按需使用**：仅在确实需要图形界面时才开启 VNC 服务，用完后及时关闭。大部分工作应优先在命令行中完成。

-----

## 4\. 在 VS Code 中连接到容器进行开发

如果您已经在服务器上使用 Docker 或 Podman 运行开发环境容器，VS Code 可以直接连接到容器内部，提供无缝的开发体验。

这个过程需要两步连接：`本地电脑 -> SSH -> 服务器 -> 容器`。

### 4.1. 前提条件

1.  您已经按照[第 2 节](https://www.google.com/search?q=%232-%E9%85%8D%E7%BD%AE-vs-code-%E8%BF%9B%E8%A1%8C%E8%BF%9C%E7%A8%8B%E5%BC%80%E5%8F%91)的方法，通过 VS Code 的 SSH 功能连接到了远程服务器。
2.  服务器上已经安装并运行了 Docker 或 Podman，并且您想连接的容器正在运行中。

### 4.2. 安装 Dev Containers 插件

在已经连接到远程服务器的 VS Code 窗口中，打开插件市场，搜索并安装 **Dev Containers** 插件。

> **注意**：您需要在远程服务器上安装此插件。VS Code 会自动提示您“在 SSH: your\_server\_hostname 上安装”。

### 4.3. 连接到正在运行的容器

1.  按下 `F1` 或 `Ctrl+Shift+P` 打开命令面板。
2.  输入并选择 **"Dev Containers: Attach to Running Container..."**。
3.  VS Code 会列出服务器上所有正在运行的容器。选择您想要连接的目标容器。
4.  VS Code 将会重新加载，并将工作环境切换到容器内部。左下角的状态栏会变为 `Dev Container: [容器名]`。

现在，您的 VS Code 编辑器、终端、文件系统都完全在容器内部。您可以像在本地一样安装语言工具、运行调试器，而所有这一切都隔离在服务器的容器环境中。

> #### 💡 **最佳实践 (Best Practice)**
>
>   * **环境隔离**：使用容器来封装项目的依赖环境，可以确保开发、测试和生产环境的一致性，避免“在我机器上能跑”的问题。
>   * **使用 `.devcontainer` 配置**：对于项目，可以在代码仓库中添加一个 `.devcontainer` 目录，并编写 `devcontainer.json` 文件来定义开发容器的环境。这样，团队中的任何人都可以一键在容器中启动标准化的开发环境。