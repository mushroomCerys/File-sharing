
## 部署说明

复制链接：https://github.com/mushroomCerys/File-sharing.git 打开浏览器粘贴浏览  

点击绿色的Code->Download ZIP 下载压缩包保存至桌面并解压  

打开微信开发者工具->文件->导入项目  
 
填写项目名称、选择目录（下载的该项目文件夹）、填写AppID(自己的)之后点击导入  

点击cloudfunctions文件夹->右键getOpenId->创建并部署：云端安装依赖  

上传成功之后点击云开发->数据库，创建三个集合，分别命名为：File-Info、Qes-Info、User-Info  

分别修改三个集合的权限：点击权限设置，修改自定义安全规则（如果没有该选项请下载最新的微信开发者工具），  
将read和write都改为true  

到此部署完毕（其他调试如有错误请自行百度或者加微信：wxr-O_O-  ）
