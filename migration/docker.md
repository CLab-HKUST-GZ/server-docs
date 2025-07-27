# 迁移Docker镜像/容器

通常来说，我们推荐使用绑定挂载（bind mount）来存储数据，而保证容器镜像的可移植性。比如：

```bash
docker run -d --name my_dev_container -v $(pwd)/mycode:/workspace nvcr.io/nvidia/pytorch
```

将自己的代码保存在当前目录的`mycode`下，然后在容器内的`/workspace`目录中访问。这样在任何服务器上，只需要复制`mycode`目录，就可以一直使用标准镜像在容器内继续开发。

然而这始终是过于理想的，如果我们使用`apt`在容器内安装了软件包，或者修改了conda环境，那么在迁移时就必须要持久化容器内的数据。

我们先提交容器为新的镜像，然后将镜像导出为tar文件，最后在新服务器上导入镜像。

```bash
# 将容器的更改提交为新的镜像
> docker commit my_dev_container my_dev_image:v2
# 将容器导出为 tar 文件
> docker save my_dev_image:v2 -o my_dev_image.tar
# 将 tar 文件复制到新服务器
> scp my_dev_image.tar username@new_server:/path/to/destination
# 在新服务器上导入镜像
> podman load -i my_dev_image.tar
# 运行新镜像
> podman run -d --name my_new_dev_container my_dev_image:v2
```