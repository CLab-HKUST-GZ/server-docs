# Docker/Podman 使用指南

## 容器化简介

我们**强烈推荐**各位使用容器引擎管理自己的开发环境，如果可以的话。使用容器（Container）有以下几个好处：

1. **完整权限**：在容器内有完整的root权限，可以任意安装配置任何想要的软件包。
2. **数据分离**：容器内的文件和数据是与外部隔离的，容器之间互不影响，独立运行。
3. **快速部署**：容器镜像（Image）封装了一系列常用的软件，可以享受一键启动完整PyTorch+CUDA或者其他技术栈的快感，而不需要手动再安装配置各类环境。
4. **环境一致**：无论宿主机是什么系统、什么架构，容器镜像能尽可能的保证环境的一致性，防止可移植性问题。

Docker是目前最流行的容器引擎，然而给予Docker的访问权限等同于给予宿主机完整的Root权限，这显然是十分危险的。因此，我们使用Podman来作为Docker的替代品，他们的命令使用几乎完全相同，并且不需要任何额外权限。另外还有一点额外好处，Docker依赖于系统服务，因此在进行系统维护时（如apt upgrade)，容易误重启Docker服务，导致任务中断，而Podman不会有这个问题。

## 简单使用方法

*下面的所有命令，Docker和Podman可以互换。你甚至可以直接在`.bashrc`中加入`alias docker=podman`将Podman直接当作Docker使用。*

**注意：** 如果你在运行Podman时出现`cannot find UID/GID for user ...`等类似错误，请先运行`podman system migrate`之后再重试。如果还是不行请联系管理员。

```bash
# `pull` 拉取镜像
> podman pull httpd
Trying to pull docker.io/library/httpd:latest...
Getting image source signatures
Copying blob fc61fad0f540 skipped: already exists  
Copying blob 4f4fb700ef54 skipped: already exists  
Copying blob c02ce4e0ebb3 skipped: already exists  
Copying blob 644bfd3d7e68 skipped: already exists  
Copying blob e7b83145b209 skipped: already exists  
Copying blob 59e22667830b skipped: already exists  
Copying config 5bdbc621ec done   | 
Writing manifest to image destination
5bdbc621ec089f8137cf0fdd49caa16748854c8c72739e794d1c2c9ab88dfed7

# `image ls` 检查当前存在的镜像
> podman image ls
REPOSITORY                 TAG         IMAGE ID      CREATED        SIZE
docker.io/library/httpd    latest      5bdbc621ec08  37 hours ago   152 MB
docker.io/library/alpine   latest      9234e8fb04c4  9 days ago     8.61 MB
docker.io/library/ubuntu   latest      65ae7a6f3544  10 days ago    80.6 MB
docker.io/library/ubuntu   24.04       65ae7a6f3544  10 days ago    80.6 MB
nvcr.io/nvidia/pytorch     25.06-py3   06aa7e7a6f5a  6 weeks ago    27 GB
docker.io/library/busybox  latest      6d3e4188a38a  10 months ago  4.53 MB

# `run` 使用指定的镜像启动容器
# `-it` 表示提供交互式终端（可以输入命令）
# `--rm` 表示在容器结束之后直接删除，通常用于测试
# `ubuntu` 指定镜像。使用`:`指定对应版本或标签（TAG）
# `bash` 为执行的命令。当这个命令结束后，容器视为运行结束。
> podman run -it --rm ubuntu bash
root@a1f68d4dfe76:/# uname -a 
Linux a1f68d4dfe76 5.15.0-144-generic #157-Ubuntu SMP Mon Jun 16 07:33:10 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux
root@a1f68d4dfe76:/# cat /etc/os-release
PRETTY_NAME="Ubuntu 24.04.2 LTS"
NAME="Ubuntu"
VERSION_ID="24.04"
VERSION="24.04.2 LTS (Noble Numbat)"
VERSION_CODENAME=noble
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=noble
LOGO=ubuntu-logo
root@a1f68d4dfe76:/# exit
exit

# 后台运行
# `--name` 指定名字，方便管理。不指定会随机生成。
# `-d` 后台运行，分离当前终端
# 返回一串容器ID
> podman run -it -d --name ubuntu-test ubuntu bash
310cbe9a447ec8e09cc040b5d5f330dde77b7c835fa7ad8fd940aaf23c246b8f

# `ps` 查看现在运行的容器
# 使用`ps -a`查看所有容器，包括不在运行中的
> podman ps
CONTAINER ID  IMAGE                            COMMAND     CREATED             STATUS             PORTS       NAMES
310cbe9a447e  docker.io/library/ubuntu:latest  bash        About a minute ago  Up About a minute              ubuntu-test

# `exec` 在容器上运行指定命令。可以使用名字，也可以使用ID来指定容器。
# 这会创建新的进程，这个进程执行结束不会影响“主进程”
> podman exec -it ubuntu-test bash
root@310cbe9a447e:/# uname -a
Linux 310cbe9a447e 5.15.0-144-generic #157-Ubuntu SMP Mon Jun 16 07:33:10 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux
root@310cbe9a447e:/# exit
exit

# `attach` 将当前终端附加在容器上
# 这时再退出就会终止容器
> podman attach ubuntu-test 
root@310cbe9a447e:/# exit
exit
> podman ps -a
CONTAINER ID  IMAGE                            COMMAND     CREATED        STATUS                      PORTS       NAMES
310cbe9a447e  docker.io/library/ubuntu:latest  bash        3 minutes ago  Exited (0) 18 seconds ago               ubuntu-test

# `start` `restart` `stop` `kill` 顾名思义的控制命令
> podman start ubuntu-test
ubuntu-test
> podman ps
CONTAINER ID  IMAGE                            COMMAND     CREATED        STATUS        PORTS       NAMES
310cbe9a447e  docker.io/library/ubuntu:latest  bash        5 minutes ago  Up 3 seconds              ubuntu-test

# 使用`-v`将宿主目录挂载到容器路径上实现数据同步
# `-v <path in host>:<path in container>`
> mkdir data && echo "Data on Host" 

# 使用NVIDIA GPU
# `--gpus all` 指定要使用的GPU
# `nvcr.io/nvidia/pytorch:25.06-py3` 为NVidia官方的PyTorch镜像，已经预先安装配置好
# Python, CUDA, PyTorch, DALI, RAPIDS, cuDNN, NCCL, TensorRT等一系列深度学习需要的包。
> podman run -it --rm --gpus all nvcr.io/nvidia/pytorch:25.06-py3 bash

=============
== PyTorch ==
=============

NVIDIA Release 25.06 (build 177567386)
PyTorch Version 2.8.0a0+5228986
Container image Copyright (c) 2025, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
Copyright (c) 2014-2024 Facebook Inc.
Copyright (c) 2011-2014 Idiap Research Institute (Ronan Collobert)
Copyright (c) 2012-2014 Deepmind Technologies    (Koray Kavukcuoglu)
Copyright (c) 2011-2012 NEC Laboratories America (Koray Kavukcuoglu)
Copyright (c) 2011-2013 NYU                      (Clement Farabet)
Copyright (c) 2006-2010 NEC Laboratories America (Ronan Collobert, Leon Bottou, Iain Melvin, Jason Weston)
Copyright (c) 2006      Idiap Research Institute (Samy Bengio)
Copyright (c) 2001-2004 Idiap Research Institute (Ronan Collobert, Samy Bengio, Johnny Mariethoz)
Copyright (c) 2015      Google Inc.
Copyright (c) 2015      Yangqing Jia
Copyright (c) 2013-2016 The Caffe contributors
All rights reserved.

Various files include modifications (c) NVIDIA CORPORATION & AFFILIATES.  All rights reserved.

GOVERNING TERMS: The software and materials are governed by the NVIDIA Software License Agreement
(found at https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-software-license-agreement/)
and the Product-Specific Terms for NVIDIA AI Products
(found at https://www.nvidia.com/en-us/agreements/enterprise-software/product-specific-terms-for-ai-products/).

NOTE: CUDA Forward Compatibility mode ENABLED.
  Using CUDA 12.9 driver version 575.57.08 with kernel driver version 570.124.06.
  See https://docs.nvidia.com/deploy/cuda-compatibility/ for details.

NOTE: Mellanox network driver detected, but NVIDIA peer memory driver not
      detected.  Multi-node communication performance may be reduced.

root@0e925562174a:/workspace# nvidia-smi
Fri Jul 25 06:23:20 2025       
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 570.124.06             Driver Version: 570.124.06     CUDA Version: 12.9     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA RTX 6000 Ada Gene...    Off |   00000000:17:00.0 Off |                  Off |
| 30%   29C    P8              8W /  300W |    9628MiB /  49140MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
|   1  NVIDIA RTX 6000 Ada Gene...    Off |   00000000:3D:00.0 Off |                  Off |
| 30%   53C    P2             63W /  300W |    4562MiB /  49140MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
|   2  NVIDIA RTX 6000 Ada Gene...    Off |   00000000:50:00.0 Off |                  Off |
| 30%   27C    P8             11W /  300W |     122MiB /  49140MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
|   3  NVIDIA RTX 6000 Ada Gene...    Off |   00000000:63:00.0 Off |                  Off |
| 30%   24C    P8              9W /  300W |      88MiB /  49140MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
                                                                                         
+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|  No running processes found                                                             |
+-----------------------------------------------------------------------------------------+
root@0e925562174a:/workspace# python
Python 3.12.3 (main, Feb  4 2025, 14:48:35) [GCC 13.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import torch
>>> torch.cuda.is_available()
True
>>> 
root@0e925562174a:/workspace# exit
exit
```

## 寻找自己想要的镜像

[DockerHub](https://hub.docker.com/)是官方Docker镜像源，你可以找到几乎所有需要的环境，包括：[Ubuntu](https://hub.docker.com/_/ubuntu), [Python](https://hub.docker.com/_/python), [Miniforge3/Conda](https://hub.docker.com/r/condaforge/miniforge3)等。

[NGC Catalog](https://catalog.ngc.nvidia.com/containers)是Nvidia的官方镜像源，常用的有：[CUDA](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/cuda), [PyTorch](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/pytorch), [NVIDIA HPC SDK](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/nvhpc)等。

这些镜像源都有较好的搜索功能。

## 其他注意事项

1. 服务器为Podman配置了内网的Registry镜像来加速镜像拉取，参见[[..内网镜像]]
2. Podman的Rootless容器虽然保持了绝大部分的兼容性，但是仍然存在一定的区别，尤其是网络配置。参见[官方文档](https://github.com/containers/podman/blob/main/rootless.md?plain=1#L11)获得更多信息。
3. 如果你实在需要完整权限的Docker或遇到了兼容性问题，请及时联系管理员。