# Spack 使用指南

CLab服务器集群使用[Spack](https://github.com/spack/spack)管理各类不同版本的编译器和实用工具。本指南旨在帮助您理解和高效使用 Spack 来加载和管理我们为您提供的科学计算与开发软件。更深入的使用指南请参见[官方文档](https://spack.readthedocs.io/en/latest/index.html)。

## 1. Introduction

**What is Spack？**

Spack 是一个为高性能计算（HPC）集群设计的、灵活的软件包管理器。它解决了在复杂计算环境中管理众多软件包及其不同版本和依赖关系的难题。

**Why Spack？**

- **多版本共存**：Spack 允许我们安装同一软件的多个版本（例如 `gcc@14.2.0` 和 `gcc@15.1.0`），并且可以让他们与不同的编译器或库（如 MPI）编译链接。
- **环境隔离**：每个用户的 Shell 环境是独立的。您加载的软件包仅对您当前的会话有效，不会影响其他用户。
- **一致性与复现性**：Spack 确保了软件编译过程的一致性，使得科研和计算结果有更好的复现性。
- **简化环境管理**：您不再需要手动设置 `PATH`, `LD_LIBRARY_PATH` 等环境变量。只需一条 `spack load` 命令，Spack 会自动处理好一切。
- **集群共享**：Spack及其软件包安装在共享文件服务器上，安装的软件包可以被整个集群使用。



## 2. Simple Tutorial

```bash
# 1. 加载Spack
$ module load spack
# 或者使用下面的命令
# source /data-hdd/opt/spack/share/spack/setup-env.sh

# 检查Spack版本
$ spack -V 
1.0.0 (73eaea13f381e3495299284856fd02a64e1d154c)

# 2. 检查可用软件包
$ spack find -x
-- linux-ubuntu22.04-x86_64 / %c,cxx,fortran=gcc@11.4.0 ---------
gdb@14.2  gdb@15.2  mpich@4.3.0  openmpi@4.1.8  openmpi@5.0.7

-- linux-ubuntu22.04-x86_64 / %c,cxx=gcc@11.4.0 -----------------
aocc@5.0.0  btop@1.4.4  cmake@3.31.8  gcc@14.2.0  gcc@15.1.0  llvm@19.1.7  llvm@20.1.3  valgrind@3.24.0

-- linux-ubuntu22.04-x86_64 / no compilers ----------------------
cuda@11.8.0  cuda@12.8.1  intel-oneapi-compilers@2025.2.0  nvhpc@25.3
cuda@12.4.1  cuda@12.9.0  intel-oneapi-vtune@2025.4.0
==> 20 installed packages
# 使用`-x`参数获得明确安装的包列表。不使用这个参数查看所有包，包括它们的依赖。

# 查找所有与 "mpi" 相关的包
$ spack find mpi
-- linux-ubuntu22.04-x86_64 / %c,cxx,fortran=gcc@11.4.0 ---------
mpich@4.3.0  openmpi@4.1.8  openmpi@5.0.7
==> 3 installed packages

# 查找特定版本的 llvm
$ spack find llvm@19.1.7
-- linux-ubuntu22.04-x86_64 / %c,cxx=gcc@11.4.0 -----------------
llvm@19.1.7
==> 1 installed package

# 3. 加载与移除软件包
# 未加载时，使用系统安装的gcc
$ gcc --version
gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
...
$ which gcc
/usr/bin/gcc
# 加载后，使用Spack内的gcc
$ spack load gcc@15.1.0
$ gcc --version
gcc (Spack GCC) 15.1.0
...
$ which gcc
/data-hdd/opt/spack/opt/spack/linux-x86_64/gcc-15.1.0-nxpgov7hzhmy6xnkzc33acopm7ictrhg/bin/gcc
# 使用`@`符号指定对应的版本。可以一次加载多个包。

# 使用下面命令查看加载的软件包
$ spack find --loaded
-- linux-ubuntu22.04-x86_64 / %c,cxx=gcc@11.4.0 -----------------
gcc@15.1.0
==> 1 loaded package
# 移除软件包后，重新使用系统的gcc
$ spack unload gcc
$ which gcc
/usr/bin/gcc
```



## 3. Installed Packages

| 包名                     | 版本                                       | 全称                                                         | 简介                                               |
| ------------------------ | ------------------------------------------ | ------------------------------------------------------------ | -------------------------------------------------- |
| *编译器* | | |
| `gcc`                    | 11.4.0<br />12.3.0<br />14.2.0<br />15.1.0 | [GNU Compiler Collection](https://gcc.gnu.org/)              | GNU编译器，包括gcc/g++/gfortran                    |
| `llvm`                   | 19.1.7<br />20.1.3                         | [LLVM Compiler Infrastructure](https://llvm.org/)            | LLVM，包括clang/clang++等                          |
| `intel-oneapi-compilers` | 2025.2.0                                   | [Intel OneAPI Compilers](https://www.intel.com/content/www/us/en/developer/tools/oneapi/overview.html) | 为Intel CPU优化的编译器                            |
| `aocc`                   | 5.0.0                                      | [AMD Optimized C/C++ Compiler](https://www.amd.com/en/developer/zen-software-studio/applications/spack/spack-aocc.html) | 为AMD CPU优化的编译器                              |
| `mpich`                  | 4.3.0                                      | [MPICH](https://www.mpich.org/)                              | 一个高性能、广泛使用的 MPI 实现                    |
| `openmpi`                | 4.1.8<br />5.0.7                           | [OpenMPI](https://www.open-mpi.org/)                         | 另一个开源的MPI实现                                |
| *CUDA相关*                        |                                            |                                                              |                                                    |
| `cuda`                   | 11.8.0<br />12.4.1<br />12.8.1<br />12.9.0 | [CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit)    | Nvidia GPU并行计算框架，包括nvcc/ncu/nsys/nvprof等 |
| `nvhpc`                  | 25.3                                       | [Nvidia HPC SDK](https://developer.nvidia.com/hpc-sdk)       | CUDA的C/C++/Fortran编译器                          |
| *调试与分析*                         |                                            |                                                              |                                                    |
| `gdb`                    | 14.2<br />15.2                             | [GNU Debugger](https://www.gnu.org/software/gdb/gdb.html)    | GNU调试器                                          |
| `valgrind`               | 3.24.0                                     | [Valgrind](https://valgrind.org/)                            | 高级程序动态分析工具，如内存泄漏分析等             |
| `intel-oneapi-vtune`     | 2025.4.0                                   | [Intel OneAPI VTune](https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html) | Intel CPU用的高级Profile工具                       |
|  *其他实用工具*                        |                                            |                                                              |                                                    |
| `cmake`                  | 3.31.8                                     | [CMake](https://cmake.org/)                                  | C/C++最流行的跨平台构建生成器                      |
| `ninja`                  | 1.15.0                                     | [Ninja](https://github.com/ninja-build/ninja)                | 小而精悍的构建系统，通常和CMake配合使用            |
| `btop`                   | 1.4.4                                      | [btop](https://github.com/aristocratos/btop)                 | 可视化效果精美的资源监视器                         |
|                          |                                            |                                                              |                                                    |

如果上表中没有你需要的软件包或版本，请在 https://packages.spack.io/ 中查找是否被Spack支持，然后告知服务器管理员进行安装。

