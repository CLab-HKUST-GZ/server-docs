# 解决迁移后Conda路径问题

## 替换conda的路径配置

如果你在自己的主目录安装了anaconda或者miniforge，那么在迁移用户系统之后，需要修复一些路径问题。下面假设你的miniforge安装在`~/miniforge3`下：

```bash
cd ~
grep -rlIZ "/data-ssd/home/chenxi" . | xargs -0 sed -i 's#/data-ssd/home/chenxi#/home/CONNECT/cxu930#g'

cd ~/miniforge3/bin
grep -rlIZ "/data-ssd/home/chenxi" . | xargs -0 sed -i 's#/data-ssd/home/chenxi#/home/CONNECT/cxu930#g'
```

注意替换成自己的路径！！不要直接复制这个命令把路径都给成别人的。这里替换了用户主目录（包括`.bashrc`等文件）和`conda/bin`内的文件中的路径。替换成功后重新进入终端即可。

## 重新安装环境内的所有包

虽然直接替换字符串能解决80%的问题，但是conda有可能还会有一些动态连接库文件还保留原来的路径信息，这些问题无法简单替换解决。如果你遇到了更多Premission Denied的问题，一劳永逸的方法是重新安装所有的包。别担心，conda的包缓存应该也一起移动了过来，不需要再联网下载99%的内容，只需要执行安装步骤即可。对于你需要重新安装的环境，执行：

```
conda list --export > package-list.txt
conda install --force-reinstall --file package-list.txt
```

如果你安装的时候遇到了无法找到`pyyaml==6.0.2=pypi_0`等类似包的问题，说明他们是`pip`安装的，你只需要把`package-list.txt`里面遇到问题的包删掉再重新执行即可。