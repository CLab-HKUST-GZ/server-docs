# LMod 使用指南

CLab集群使用Lmod管理如Vivado等大型共有软件的各类版本。本指南提供了简要的介绍，详细的使用指南参见[官方文档](https://lmod.readthedocs.io/en/latest/010_user.html)。

## 1. Introduction

**What is Lmod**

LMod 是一个现代化的、功能强大的环境模块系统（Environment Module System）。在高性能计算（HPC）集群、服务器或个人工作站上，通常会安装许多不同版本、不同编译选项的软件和库。如果将这些软件的路径全部直接添加到用户的环境变量（如 `$PATH`, `$LD_LIBRARY_PATH`）中，很容易引发冲突和混乱。

LMod 通过动态修改当前 Shell 会话的环境变量，解决了这个问题。它允许用户按需、干净地加载（load）和卸载（unload）软件包，确保你使用的正是你所需要的软件版本，而不会与其他软件产生冲突。

**Why Lmod?**

- 避免冲突：轻松管理同一软件的多个版本
- 环境整洁：只加载当前任务所需的软件，保持 $PATH 等环境变量的简洁和可控
- 可复现性：通过保存加载的模块列表，可以轻松复现之前的工作环境
- 简化管理：对于系统管理员来说，LMod 提供了一种标准化的方式来组织和提供软件

## 2. Usage

```bash
$ module --version
Modules based on Lua: Version 6.6  2016-10-13 13:28 -05:00
    by Robert McLay mclay@tacc.utexas.edu

# 查看可用的软件
$ module avail

-------------------------------------------------- /data-hdd/opt/lmod --------------------------------------------------
   spack           vitis/2024.1     (D)    vitis_hls/2023.2        vivado/2021.2        xrt
   vitis/2021.2    vitis_hls/2020.2        vitis_hls/2024.1 (D)    vivado/2023.2
   vitis/2023.2    vitis_hls/2021.2        vivado/2020.2           vivado/2024.1 (D)

# 以Vivado为例，初始没有加载
$ vivado -version
vivado: command not found

# 使用module load加载软件
$ module load vivado
$ which vivado
/data-hdd/opt/Xilinx/Vivado/2024.1/bin/vivado
# Vivado可以正常使用
$ vivado -version
vivado v2024.1 (64-bit)
Tool Version Limit: 2024.05
SW Build 5076996 on Wed May 22 18:36:09 MDT 2024
IP Build 5075265 on Wed May 22 21:45:21 MDT 2024
SharedData Build 5076995 on Wed May 22 18:29:18 MDT 2024
Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
Copyright 2022-2024 Advanced Micro Devices, Inc. All Rights Reserved.

# 使用module list查看已加载的软件
$ module list

Currently Loaded Modules:
  1) vivado/2024.1

# 使用module unload取消加载
$ module unload vivado
$ vivado -version
vivado: command not found

# 使用`/`标记需要的版本
$ module load vivado/2023.2
$ vivado -version
vivado v2023.2 (64-bit)
Tool Version Limit: 2023.10
SW Build 4029153 on Fri Oct 13 20:13:54 MDT 2023
IP Build 4028589 on Sat Oct 14 00:45:43 MDT 2023
SharedData Build 4025554 on Tue Oct 10 17:18:54 MDT 2023
Copyright 1986-2022 Xilinx, Inc. All Rights Reserved.
Copyright 2022-2023 Advanced Micro Devices, Inc. All Rights Reserved.
```

## 3. Installed Software

| 软件        | 版本                                       | 名称                                                         | 简介                                                         |
| ----------- | ------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `vivado`    | 2020.2<br />2021.2<br />2023.2<br />2024.1 | [Vivado](https://www.amd.com/en/products/software/adaptive-socs-and-fpgas/vivado.html) | 面向硬件工程师，是进行传统硬件描述语言 (HDL) 设计、实现和验证的底层工具，是构建 FPGA 硬件基础的基石。 |
| `vitis`     | 2021.2<br />2023.2<br />2024.1             | [Vitis](https://www.amd.com/en/products/software/adaptive-socs-and-fpgas/vitis.html) | 面向软件和系统工程师，是一个高层次的统一软件平台，用于在异构硬件平台（包括 FPGA、SoC 上的 ARM 处理器等）上开发、调试和部署加速应用。它将 Vivado 构建的硬件和 Vitis HLS 生成的加速核整合在一起，并提供软件开发的完整流程。 |
| `vitis_hls` | 2020.2<br />2021.2<br />2023.2<br />2024.1 | [Vitis HLS](https://www.amd.com/en/products/software/adaptive-socs-and-fpgas/vitis/vitis-hls.html) | 作为桥梁，将高层次的 C/C++ 或 OpenCL C 代码转换为底层的硬件描述语言 (RTL)，使得不熟悉硬件设计的软件工程师也能开发硬件加速内核。 |
| `xrt`       |                                            | [Xilinx Runtime](https://github.com/Xilinx/XRT)              | Xilinx FPGA加速卡相关的实用工具。                            |
| `spack`     |                                            | [Spack Package Manager](https://github.com/spack/spack)      | 用于管理各类不同版本编译器、CUDA等的管理工具，参见[[Spack使用指南]]。               |

