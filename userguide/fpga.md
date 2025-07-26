# FPGA与XRT使用指南

CLab服务器集群有丰富的Xilinx FPGA加速卡，它们大多使用[XRT (Xilinx Runtime)](https://github.com/Xilinx/XRT)检查和控制。本指南简要介绍如何使用XRT和相关工具检查FPGA加速卡的状态。

## 加载XRT

```bash
$ module load xrt
# 或者使用
# source /opt/xilinx/xrt/setup.sh
```

注意，01/02没有安装XRT。

### 验证AMD Alveo U250和U55C

03上有2块U250，06上有4块U55C。它们的使用方法非常类似。

运行`xbmgmt examine`检查FPGA基础Shell是否工作：

```
$ xbmgmt examine
System Configuration
  OS Name              : Linux
  Release              : 5.15.0-138-generic
  Machine              : x86_64
  CPU Cores            : 144
  Memory               : 2063929 MB
  Distribution         : Ubuntu 22.04.5 LTS
  GLIBC                : 2.35
  Model                : ESC8000-E11
  BIOS Vendor          : American Megatrends Inc.
  BIOS Version         : 2201

XRT
  Version              : 2.18.179
  Branch               : 2024.2
  Hash                 : 3ade2e671e5ab463400813fc2846c57edf82bb10
  Hash Date            : 2024-11-05 13:57:47
  xocl                 : 2.18.179, 3ade2e671e5ab463400813fc2846c57edf82bb10
  xclmgmt              : 2.18.179, 3ade2e671e5ab463400813fc2846c57edf82bb10
  Firmware Version     : N/A

Device(s) Present
|BDF             ||Shell                            ||Logic UUID                            ||Device ID         ||Device Ready*  |
|----------------||---------------------------------||--------------------------------------||------------------||---------------|
|[0000:16:00.0]  ||xilinx_u55c_gen3x16_xdma_base_3  ||97088961-FEAE-DA91-52A2-1D9DFD63CCEF  ||mgmt(inst=5632)   ||Yes            |
|[0000:38:00.0]  ||xilinx_u55c_gen3x16_xdma_base_3  ||97088961-FEAE-DA91-52A2-1D9DFD63CCEF  ||mgmt(inst=14336)  ||Yes            |
|[0000:49:00.0]  ||xilinx_u55c_gen3x16_xdma_base_3  ||97088961-FEAE-DA91-52A2-1D9DFD63CCEF  ||mgmt(inst=18688)  ||Yes            |
|[0000:5a:00.0]  ||xilinx_u55c_gen3x16_xdma_base_3  ||97088961-FEAE-DA91-52A2-1D9DFD63CCEF  ||mgmt(inst=23040)  ||Yes            |
```

运行`xrt-smi examine`检查FPGA的OpenCL支持是否工作~~（`xrt-smi`就是原来的`xbutil`，我也不知道AMD出于什么心理改的名字）~~：

```
$ xrt-smi examine
System Configuration
  OS Name              : Linux
  Release              : 5.15.0-138-generic
  Machine              : x86_64
  CPU Cores            : 144
  Memory               : 2063929 MB
  Distribution         : Ubuntu 22.04.5 LTS
  GLIBC                : 2.35
  Model                : ESC8000-E11
  BIOS Vendor          : American Megatrends Inc.
  BIOS Version         : 2201

XRT
  Version              : 2.18.179
  Branch               : 2024.2
  Hash                 : 3ade2e671e5ab463400813fc2846c57edf82bb10
  Hash Date            : 2024-11-05 13:57:47
  xocl                 : 2.18.179, 3ade2e671e5ab463400813fc2846c57edf82bb10
  xclmgmt              : 2.18.179, 3ade2e671e5ab463400813fc2846c57edf82bb10
  Firmware Version     : N/A

Device(s) Present
|BDF             ||Shell                            ||Logic UUID                            ||Device ID       ||Device Ready*  |
|----------------||---------------------------------||--------------------------------------||----------------||---------------|
|[0000:16:00.1]  ||xilinx_u55c_gen3x16_xdma_base_3  ||97088961-FEAE-DA91-52A2-1D9DFD63CCEF  ||user(inst=128)  ||Yes            |
|[0000:38:00.1]  ||xilinx_u55c_gen3x16_xdma_base_3  ||97088961-FEAE-DA91-52A2-1D9DFD63CCEF  ||user(inst=129)  ||Yes            |
|[0000:49:00.1]  ||xilinx_u55c_gen3x16_xdma_base_3  ||97088961-FEAE-DA91-52A2-1D9DFD63CCEF  ||user(inst=130)  ||Yes            |
|[0000:5a:00.1]  ||xilinx_u55c_gen3x16_xdma_base_3  ||97088961-FEAE-DA91-52A2-1D9DFD63CCEF  ||user(inst=131)  ||Yes            |
```

使用`xrt-smi validate -d <device BDF>`测试FPGA的各项功能：

```
$ xrt-smi validate -d 16:00
Validate Device           : [0000:16:00.1]
    Platform              : xilinx_u55c_gen3x16_xdma_base_3
    SC Version            : 7.1.23
    Platform ID           : 97088961-FEAE-DA91-52A2-1D9DFD63CCEF
-------------------------------------------------------------------------------
Test 1 [0000:16:00.1]     : pcie-link
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 2 [0000:16:00.1]     : sc-version
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 3 [0000:16:00.1]     : verify
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 4 [0000:16:00.1]     : dma
    Details               : Buffer size - '16 MB' Memory Tag - 'HBM[0]'
                            Host -> PCIe -> FPGA write bandwidth = 10939.2 MB/s
                            Host <- PCIe <- FPGA read bandwidth = 11910.9 MB/s
                            Buffer size - '16 MB' Memory Tag - 'HBM[1]'
                            Host -> PCIe -> FPGA write bandwidth = 10835.7 MB/s
                            Host <- PCIe <- FPGA read bandwidth = 10864.5 MB/s
                            ...
                            Buffer size - '16 MB' Memory Tag - 'HBM[30]'
                            Host -> PCIe -> FPGA write bandwidth = 10735.8 MB/s
                            Host <- PCIe <- FPGA read bandwidth = 10919.6 MB/s
                            Buffer size - '16 MB' Memory Tag - 'HBM[31]'
                            Host -> PCIe -> FPGA write bandwidth = 10814.5 MB/s
                            Host <- PCIe <- FPGA read bandwidth = 10859.4 MB/s
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 5 [0000:16:00.1]     : iops
    Details               : Overall Commands: 50000, IOPS: 218834 (verify)
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 6 [0000:16:00.1]     : mem-bw
    Details               : Throughput (Type: HBM) (Bank count: 1) : 12100.5 MB/s
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Validation completed. Please run the command '--verbose' option for more details
```

对于fpga03的U250，因为使用了DFX-2RP部署，所以重启后它只会保留基础shell。如果发现`xrt-smi examine`显示的shell为`xilinx_u250_gen3x16_base_4`，请联系管理员进行重编程，或者你已经有sudo权限的话：

```
sudo xbmgmt program -d <device BDF> --shell /opt/xilinx/firmware/u250/gen3x16/xdma-shell/partition.xsabin
```

如果显示的shell为`xilinx_u250_gen3x16_xdma_shell_4_1`，那么可以使用`xrt-smi validate`进行测试：

```
$ xrt-smi validate -d 99:00
Validate Device           : [0000:99:00.1]
    Platform              : xilinx_u250_gen3x16_xdma_shell_4_1
    SC Version            : 4.6.21
    Platform ID           : 12C8FAFB-0632-499D-B1C0-C6676271B8A6
-------------------------------------------------------------------------------
Test 1 [0000:99:00.1]     : aux-connection
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 2 [0000:99:00.1]     : pcie-link
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 3 [0000:99:00.1]     : sc-version
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 4 [0000:99:00.1]     : verify
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 5 [0000:99:00.1]     : dma
    Details               : Buffer size - '16 MB' Memory Tag - 'bank0'
                            Host -> PCIe -> FPGA write bandwidth = 9046.9 MB/s
                            Host <- PCIe <- FPGA read bandwidth = 13330.1 MB/s
                            Buffer size - '16 MB' Memory Tag - 'bank1'
                            Host -> PCIe -> FPGA write bandwidth = 8966.7 MB/s
                            Host <- PCIe <- FPGA read bandwidth = 12748.8 MB/s
                            Buffer size - '16 MB' Memory Tag - 'bank2'
                            Host -> PCIe -> FPGA write bandwidth = 8905.8 MB/s
                            Host <- PCIe <- FPGA read bandwidth = 13324.1 MB/s
                            Buffer size - '16 MB' Memory Tag - 'bank3'
                            Host -> PCIe -> FPGA write bandwidth = 8710.8 MB/s
                            Host <- PCIe <- FPGA read bandwidth = 13140.8 MB/s
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 6 [0000:99:00.1]     : iops
    Details               : Overall Commands: 50000, IOPS: 313324 (verify)
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 7 [0000:99:00.1]     : mem-bw
    Details               : Throughput (Type: DDR) (Bank count: 4) : 67895.8 MB/s
                            Throughput of Memory Tag: DDR[0] : 16973.9 MB/s
                            Throughput of Memory Tag: DDR[1] : 16974.0 MB/s
                            Throughput of Memory Tag: DDR[2] : 16974.0 MB/s
                            Throughput of Memory Tag: DDR[3] : 16974.0 MB/s
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 8 [0000:99:00.1]     : m2m
    Details               : bank0 -> bank1 M2M bandwidth: 11791.90 MB/s
                            bank0 -> bank2 M2M bandwidth: 11714.75 MB/s
                            bank0 -> bank3 M2M bandwidth: 11735.22 MB/s
                            bank1 -> bank2 M2M bandwidth: 11358.28 MB/s
                            bank1 -> bank3 M2M bandwidth: 11709.47 MB/s
                            bank2 -> bank3 M2M bandwidth: 11685.86 MB/s
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Validation completed. Please run the command '--verbose' option for more details
```

## 验证SmartSSD

在04/05机器上分别部署了四块SmartSSD，它们的验证方式略有不同，还需要额外检查其附带的SSD硬盘是否正常工作。

检查PCIe设备和NVMe硬盘是否在线

```bash
$ lspci | grep -i xilinx
d5:00.0 PCI bridge: Xilinx Corporation SmartSSD
d6:00.0 PCI bridge: Xilinx Corporation SmartSSD
d6:01.0 PCI bridge: Xilinx Corporation SmartSSD
d8:00.0 Processing accelerators: Xilinx Corporation SmartSSD
d8:00.1 Processing accelerators: Xilinx Corporation SmartSSD
d9:00.0 PCI bridge: Xilinx Corporation SmartSSD
da:00.0 PCI bridge: Xilinx Corporation SmartSSD
da:01.0 PCI bridge: Xilinx Corporation SmartSSD
dc:00.0 Processing accelerators: Xilinx Corporation SmartSSD
dc:00.1 Processing accelerators: Xilinx Corporation SmartSSD
dd:00.0 PCI bridge: Xilinx Corporation SmartSSD
de:00.0 PCI bridge: Xilinx Corporation SmartSSD
de:01.0 PCI bridge: Xilinx Corporation SmartSSD
e0:00.0 Processing accelerators: Xilinx Corporation SmartSSD
e0:00.1 Processing accelerators: Xilinx Corporation SmartSSD
e1:00.0 PCI bridge: Xilinx Corporation SmartSSD
e2:00.0 PCI bridge: Xilinx Corporation SmartSSD
e2:01.0 PCI bridge: Xilinx Corporation SmartSSD
e4:00.0 Processing accelerators: Xilinx Corporation SmartSSD
e4:00.1 Processing accelerators: Xilinx Corporation SmartSSD

$ lspci | grep -i samsung
d7:00.0 Non-Volatile memory controller: Samsung Electronics Co Ltd NVMe SSD Controller PM173Xa
db:00.0 Non-Volatile memory controller: Samsung Electronics Co Ltd NVMe SSD Controller PM173Xa
df:00.0 Non-Volatile memory controller: Samsung Electronics Co Ltd NVMe SSD Controller PM173Xa
e3:00.0 Non-Volatile memory controller: Samsung Electronics Co Ltd NVMe SSD Controller PM173Xa

$ lsblk
...
nvme4n1     259:8    0  3.5T  0 disk 
nvme5n1     259:10   0  3.5T  0 disk 
nvme6n1     259:12   0  3.5T  0 disk 
nvme7n1     259:14   0  3.5T  0 disk 
```

测试磁盘性能

```bash
$ fio --name=seq-write --ioengine=libaio --iodepth=64 --rw=write --bs=1024k --direct=1 --size=100% --numjobs=12 --runtime=60 --filename=/dev/nvme4n1 --group_reporting=1
seq-write: (g=0): rw=write, bs=(R) 1024KiB-1024KiB, (W) 1024KiB-1024KiB, (T) 1024KiB-1024KiB, ioengine=libaio, iodepth=64
...
fio-3.28
Starting 12 processes
Jobs: 12 (f=12): [W(12)][100.0%][w=3087MiB/s][w=3087 IOPS][eta 00m:00s]
seq-write: (groupid=0, jobs=12): err= 0: pid=8531: Mon Jun  9 20:44:19 2025
  write: IOPS=3131, BW=3131MiB/s (3283MB/s)(184GiB/60273msec); 0 zone resets
    slat (usec): min=40, max=14042, avg=160.86, stdev=413.20
    clat (msec): min=6, max=662, avg=244.99, stdev=74.88
     lat (msec): min=6, max=662, avg=245.15, stdev=74.98
    clat percentiles (msec):
     |  1.00th=[  197],  5.00th=[  199], 10.00th=[  199], 20.00th=[  199],
     | 30.00th=[  211], 40.00th=[  218], 50.00th=[  218], 60.00th=[  218],
     | 70.00th=[  226], 80.00th=[  257], 90.00th=[  397], 95.00th=[  435],
     | 99.00th=[  477], 99.50th=[  477], 99.90th=[  485], 99.95th=[  535],
     | 99.99th=[  634]
   bw (  MiB/s): min= 2518, max= 3982, per=100.00%, avg=3132.97, stdev=35.42, samples=1440
   iops        : min= 2518, max= 3982, avg=3132.97, stdev=35.42, samples=1440
  lat (msec)   : 10=0.01%, 20=0.03%, 50=0.09%, 100=0.17%, 250=78.52%
  lat (msec)   : 500=21.09%, 750=0.08%
  cpu          : usr=0.95%, sys=2.93%, ctx=190086, majf=0, minf=170
  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=0.1%, 16=0.1%, 32=0.2%, >=64=99.6%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.1%, >=64=0.0%
     issued rwts: total=0,188734,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=64

Run status group 0 (all jobs):
  WRITE: bw=3131MiB/s (3283MB/s), 3131MiB/s-3131MiB/s (3283MB/s-3283MB/s), io=184GiB (198GB), run=60273-60273msec

Disk stats (read/write):
  nvme4n1: ios=0/0, merge=0/0, ticks=0/0, in_queue=0, util=0.00%
```

```bash
$ fio --name=seq-read --ioengine=libaio --iodepth=64 --rw=read --bs=1024k -direct=1 --size=100% --numjobs=12 --runtime=60 --filename=/dev/nvme4n1 -group_reporting=1
seq-read: (g=0): rw=read, bs=(R) 1024KiB-1024KiB, (W) 1024KiB-1024KiB, (T) 1024KiB-1024KiB, ioengine=libaio, iodepth=64
...
fio-3.28
Starting 12 processes
Jobs: 12 (f=12): [R(12)][100.0%][r=2034MiB/s][r=2034 IOPS][eta 00m:00s]
seq-read: (groupid=0, jobs=12): err= 0: pid=8947: Mon Jun  9 20:46:12 2025
  read: IOPS=3352, BW=3353MiB/s (3516MB/s)(198GiB/60326msec)
    slat (usec): min=39, max=32893, avg=712.31, stdev=2361.75
    clat (msec): min=23, max=1273, avg=228.24, stdev=105.58
     lat (msec): min=23, max=1291, avg=228.95, stdev=107.55
    clat percentiles (msec):
     |  1.00th=[  178],  5.00th=[  180], 10.00th=[  180], 20.00th=[  182],
     | 30.00th=[  182], 40.00th=[  184], 50.00th=[  186], 60.00th=[  199],
     | 70.00th=[  201], 80.00th=[  207], 90.00th=[  363], 95.00th=[  531],
     | 99.00th=[  567], 99.50th=[  768], 99.90th=[  919], 99.95th=[  936],
     | 99.99th=[ 1150]
   bw (  MiB/s): min= 1898, max= 4153, per=100.00%, avg=3361.25, stdev=51.27, samples=1440
   iops        : min= 1896, max= 4150, avg=3358.48, stdev=51.22, samples=1440
  lat (msec)   : 50=0.13%, 100=0.17%, 250=81.08%, 500=12.38%, 750=5.47%
  lat (msec)   : 1000=0.74%, 2000=0.02%
  cpu          : usr=0.14%, sys=3.93%, ctx=198981, majf=0, minf=196802
  IO depths    : 1=0.1%, 2=0.1%, 4=0.1%, 8=0.1%, 16=0.1%, 32=0.2%, >=64=99.6%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.1%, >=64=0.0%
     issued rwts: total=202267,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=64

Run status group 0 (all jobs):
   READ: bw=3353MiB/s (3516MB/s), 3353MiB/s-3353MiB/s (3516MB/s-3516MB/s), io=198GiB (212GB), run=60326-60326msec

Disk stats (read/write):
  nvme4n1: ios=0/0, merge=0/0, ticks=0/0, in_queue=0, util=0.00%
```

FPGA部分可以使用XRT正常检测。

```bash
$ xbmgmt examine
System Configuration
  OS Name              : Linux
  Release              : 5.15.0-141-generic
  Machine              : x86_64
  CPU Cores            : 384
  Memory               : 1547755 MB
  Distribution         : Ubuntu 22.04.5 LTS
  GLIBC                : 2.35
  Model                : ESC8000A-E12P
  BIOS Vendor          : American Megatrends Inc.
  BIOS Version         : 2001

XRT
  Version              : 2.18.179
  Branch               : 2024.2
  Hash                 : 3ade2e671e5ab463400813fc2846c57edf82bb10
  Hash Date            : 2024-11-05 13:57:47
  xocl                 : 2.18.179, 3ade2e671e5ab463400813fc2846c57edf82bb10
  xclmgmt              : 2.18.179, 3ade2e671e5ab463400813fc2846c57edf82bb10
  Firmware Version     : N/A

Device(s) Present
|BDF             ||Shell                            ||Logic UUID                            ||Device ID         ||Device Ready*  |
|----------------||---------------------------------||--------------------------------------||------------------||---------------|
|[0000:d8:00.0]  ||xilinx_u2_gen3x4_xdma_gc_base_2  ||625B99FA-75B5-6D83-53FF-2A7A999C8BBB  ||mgmt(inst=55296)  ||Yes            |
|[0000:dc:00.0]  ||xilinx_u2_gen3x4_xdma_gc_base_2  ||625B99FA-75B5-6D83-53FF-2A7A999C8BBB  ||mgmt(inst=56320)  ||Yes            |
|[0000:e0:00.0]  ||xilinx_u2_gen3x4_xdma_gc_base_2  ||625B99FA-75B5-6D83-53FF-2A7A999C8BBB  ||mgmt(inst=57344)  ||Yes            |
|[0000:e4:00.0]  ||xilinx_u2_gen3x4_xdma_gc_base_2  ||625B99FA-75B5-6D83-53FF-2A7A999C8BBB  ||mgmt(inst=58368)  ||Yes            |

* Devices that are not ready will have reduced functionality when using XRT tools

$ xrt-smi examine
System Configuration
  OS Name              : Linux
  Release              : 5.15.0-141-generic
  Machine              : x86_64
  CPU Cores            : 384
  Memory               : 1547755 MB
  Distribution         : Ubuntu 22.04.5 LTS
  GLIBC                : 2.35
  Model                : ESC8000A-E12P
  BIOS Vendor          : American Megatrends Inc.
  BIOS Version         : 2001

XRT
  Version              : 2.18.179
  Branch               : 2024.2
  Hash                 : 3ade2e671e5ab463400813fc2846c57edf82bb10
  Hash Date            : 2024-11-05 13:57:47
  xocl                 : 2.18.179, 3ade2e671e5ab463400813fc2846c57edf82bb10
  xclmgmt              : 2.18.179, 3ade2e671e5ab463400813fc2846c57edf82bb10
  Firmware Version     : N/A

Device(s) Present
|BDF             ||Shell                            ||Logic UUID                            ||Device ID       ||Device Ready*  |
|----------------||---------------------------------||--------------------------------------||----------------||---------------|
|[0000:d8:00.1]  ||xilinx_u2_gen3x4_xdma_gc_base_2  ||625B99FA-75B5-6D83-53FF-2A7A999C8BBB  ||user(inst=132)  ||Yes            |
|[0000:dc:00.1]  ||xilinx_u2_gen3x4_xdma_gc_base_2  ||625B99FA-75B5-6D83-53FF-2A7A999C8BBB  ||user(inst=133)  ||Yes            |
|[0000:e0:00.1]  ||xilinx_u2_gen3x4_xdma_gc_base_2  ||625B99FA-75B5-6D83-53FF-2A7A999C8BBB  ||user(inst=134)  ||Yes            |
|[0000:e4:00.1]  ||xilinx_u2_gen3x4_xdma_gc_base_2  ||625B99FA-75B5-6D83-53FF-2A7A999C8BBB  ||user(inst=135)  ||Yes            |

* Devices that are not ready will have reduced functionality when using XRT tools

$ xrt-smi validate --device d8:00.1
Validate Device           : [0000:d8:00.1]
    Platform              : xilinx_u2_gen3x4_xdma_gc_base_2
    SC Version            : 0.0.0
    Platform ID           : 625B99FA-75B5-6D83-53FF-2A7A999C8BBB
-------------------------------------------------------------------------------
Test 1 [0000:d8:00.1]     : pcie-link                                           
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 2 [0000:d8:00.1]     : sc-version                                          
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 3 [0000:d8:00.1]     : verify                                              
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 4 [0000:d8:00.1]     : dma                                                 
    Details               : Buffer size - '16 MB' Memory Tag - 'bank0'
                            Host -> PCIe -> FPGA write bandwidth = 3371.5 MB/s
                            Host <- PCIe <- FPGA read bandwidth = 3378.8 MB/s
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 5 [0000:d8:00.1]     : iops                                                
    Details               : Overall Commands: 50000, IOPS: 141547 (hello)
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 6 [0000:d8:00.1]     : mem-bw                                              
    Details               : Maximum throughput: 15417 MB/s
    Test Status           : [PASSED]
-------------------------------------------------------------------------------
Test 7 [0000:d8:00.1]     : p2p                                                 
    Error(s)              : P2P failed at offset 0x0, on memory index 0
    Test Status           : [FAILED]
-------------------------------------------------------------------------------
Validation failed. Please run the command '--verbose' option for more details
```