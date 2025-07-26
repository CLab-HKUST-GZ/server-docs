# 服务器硬件资源

| Server | IP            | CPU                                                          | Mem  | GPU                                                          | FPGA                                                         |
| ------ | ------------- | ------------------------------------------------------------ | ---- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| fpga01 | 10.92.254.204 | 2x AMD [EPYC 9654](https://www.amd.com/en/products/processors/server/epyc/4th-generation-9004-and-8004-series/amd-epyc-9654.html) | 1.5T |                                                              | 4x AMD [Alveo V80](https://www.amd.com/en/products/accelerators/alveo/v80/a-v80-p64g-pq-g.html) |
| fpga02 | 10.92.254.205 | 2x AMD [EPYC 9654](https://www.amd.com/en/products/processors/server/epyc/4th-generation-9004-and-8004-series/amd-epyc-9654.html) | 1.5T |                                                              | 4x AMD [Alveo V80](https://www.amd.com/en/products/accelerators/alveo/v80/a-v80-p64g-pq-g.html) |
| fpga03 | 10.92.254.206 | 2x Intel [Xeon 6544Y](https://www.intel.com/content/www/us/en/products/sku/237569/intel-xeon-gold-6544y-processor-45m-cache-3-60-ghz/specifications.html) | 2T   | 4x NVidia [RTX 6000 Ada](https://www.nvidia.com/en-us/design-visualization/rtx-6000/) | 2x AMD [Alveo U250](https://www.amd.com/en/products/accelerators/alveo/u250/a-u250-a64g-pq-g.html) |
| fpga04 | 10.92.254.207 | 2x Intel [Xeon 6544Y](https://www.intel.com/content/www/us/en/products/sku/237569/intel-xeon-gold-6544y-processor-45m-cache-3-60-ghz/specifications.html) | 2T   | 4x NVidia [RTX 6000 Ada](https://www.nvidia.com/en-us/design-visualization/rtx-6000/) | 4x AMD [SmartSSD](https://www.xilinx.com/publications/product-briefs/xilinx-smartssd-computational-storage-drive-product-brief.pdf) |
| fpga05 | 10.92.254.208 | 2x AMD [EPYC 9684X](https://www.amd.com/en/products/processors/server/epyc/4th-generation-9004-and-8004-series/amd-epyc-9684x.html) | 1.5T | 4x AMD [Instinct MI210](https://www.amd.com/en/products/accelerators/instinct/mi200/mi210.html) | 4x AMD [SmartSSD](https://www.xilinx.com/publications/product-briefs/xilinx-smartssd-computational-storage-drive-product-brief.pdf) |
| fpga06 | 10.92.254.209 | 2x Intel [Xeon 6554S](https://www.intel.com/content/www/us/en/products/sku/237263/intel-xeon-gold-6554s-processor-180m-cache-2-20-ghz/specifications.html) | 2T   |                                                              | 4x AMD [Alveo U55C](https://www.amd.com/en/products/accelerators/alveo/u55c/a-u55c-p00g-pq-g.html) |

内网配置

| Server | 10Gbps 对外网络 | 10Gbps 存储网络 | 200Gbps Infiniband |
| ------ | --------------- | --------------- | ------------------ |
| fpga01 | 192.168.200.204 | 192.168.6.204   | 192.168.20.1       |
| fpga02 | 192.168.200.205 | 192.168.6.205   | 192.168.20.2       |
| fpga03 | 192.168.200.206 | 192.168.6.206   | 192.168.20.3       |
| fpga04 | 192.168.200.207 | 192.168.6.207   | 192.168.20.4       |
| fpga05 | 192.168.200.208 | 192.168.6.208   | 192.168.20.5       |
| fpga06 | 192.168.200.209 | 192.168.6.209   | 192.168.20.6       |

- 系统与内核：Ubuntu 22.04.5 LTS，Linux 5.15.0-144-generic
- 集群共享存储
  - `/home/<username>`：新用户系统的个人数据和主目录
  - `/data-ssd/home/<username>`：旧用户系统的个人数据和主目录
  - `/data-hdd/opt`：公用数据和软件（Vivado, Vitis等）
  - 虽然名字一个叫`ssd`一个叫`hdd`，但都是专用的共享存储服务器，名字是历史遗留问题。
- 服务器私有存储
  - `/`：1.7T固态硬盘，安装操作系统和本地软件包等
  - `/local-ssd/<username>`：3.5T固态硬盘，可以存储不需要共享的高速数据
  - `/local-hdd/<username>`：10.9T机械硬盘，可以存储不需要共享的大量数据