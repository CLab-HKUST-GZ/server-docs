---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "MICS FPGA Cluster"
  text: "微电子学域 异构计算服务器集群 用户使用手册"
---

欢迎使用 HKUST(GZ) FPGA 服务器集群！

## 基本信息

- 检查服务器的当前状态和在线时间，请参见：[服务器状态](./02.server-status.md)
- 了解服务器IP、硬件资源、网络与存储配置等，请参见：[服务器硬件资源](./01.hardware-resources.md)

## 使用指南

- 了解如何使用SSH、VS Code或VNC连接到服务器或服务器上的开发容器，请参见：[连接指南](./userguide/connection.md)
- 了解如何使用Docker/Podman管理开发容器，请参见：[Docker/Podman使用指南](./userguide/docker.md)
- 了解如何使用XRT和Xilinx FPGA加速卡，请参见：[FPGA与XRT使用指南](./userguide/fpga.md)

## 迁移指南

近期服务器用户系统升级为学校统一认证，可能会遇到一些问题：

- 迁移后安装的Miniforge/Conda可能存在路径问题，请参见：[Conda迁移指南](./migration/conda.md)
- 迁移后默认都没有Docker权限，请使用Podman代替，开发容器也需要迁移，请参见：[Docker迁移指南](./migration/docker.md)

## 依赖与软件管理

我们**强烈建议**各位使用Docker容器来管理依赖和环境。Docker容器可以提供隔离性好、一致性优秀的开发环境，并且用户在容器内有完整root权限，可以安装任何软件包。

我们**强烈不建议**用户再在服务器上使用或请求管理员用`apt`安装软件包，这会让服务器变得不稳定且难以维护。

另一个推荐的工具是Conda，它不仅是Python环境的管理工具，更能管理编译器等其他软件包。如果遇到没有的软件包，请前往[Anaconda Repos](https://anaconda.org/anaconda/repo)搜索是否存在。

服务器预先安装了一些软件包和工具，用户可以直接使用：

- 我们使用[Lmod](https://lmod.readthedocs.io/en/latest/)管理Vivado、Vitis、XRT等公有软件。请参见：[Lmod使用指南](./userguide/lmod.md)
- 我们使用[Spack](https://github.com/spack/spack)管理各类不同版本的编译器、CUDA等工具。请参见：[Spack使用指南](./userguide/spack.md)
