# llq-student-h5
##1.环境搭建

###1.1安装Nginx

	brew install nginx
	
启动关闭Nginx的命令如下（如果想要监听80端口，必须以管理员身份运行）

	#打开 nginx
	sudo nginx
	#重新加载配置|重启|停止|退出 nginx
	nginx -s reload|reopen|stop|quit
	#测试配置是否有语法错误
	nginx -t
	
配置Nginx

	cd /usr/local/etc/nginx/
	mkdir conf.d
	
修改Nginx配置文件

	vim nginx.conf
	
主要修改位置是最后的include

```
worker_processes  1;  

error_log       /usr/local/var/log/nginx/error.log warn;

pid        /usr/local/var/run/nginx.pid;

events {
    worker_connections  256;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log      /usr/local/var/log/nginx/access.log main;
    port_in_redirect off;
    sendfile        on; 
    keepalive_timeout  65; 

    include /usr/local/etc/nginx/conf.d/*.conf;
}

```

在conf.d下面创建一个静态文件的配置文件

	xxx
	
### 1.2安装node.js

安装node.js [官方文档](https://nodejs.org)

【ubuntu】
sudo apt-get remove node
sudo apt-get install nodejs

Store it in your .bashrc if you want the alias to hang around.
alias node=nodejs

run npm command gives error "/usr/bin/env: node: No such file or directory"
ln -s /usr/bin/nodejs /usr/bin/node

【Mac】
brew install node


设置使用taobao的源

	vim ~/.npmrc
	registry=https://registry.npm.taobao.org
	
安装需要的工具

	sudo npm install -g gulp
	sudo npm install -g bower
	
安装好sass的环境，（[ruby安装Sass的方法](http://www.w3cplus.com/sassguide/install.html)，gem需要切换到淘宝源）

ruby需要大于2.0.0版本，如果版本过低，需要先卸载再按照新版本
yun -y remove ruby


gem update --system



【mac】如果安装出现权限问题，如下尝试
 sudo gem install -n /usr/local/bin sass

安装好之后，就可以按照下面的命令把工程依赖通过npm和bower安装好，然后运行起来

	sudo npm install
	bower install
	gulp watch



在线压缩工具：
http://tool.lu/js/


短连接生成
http://dwz.wailian.work/

https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb8ddd7af44031487&redirect_uri=http%3A%2F%2Fm.007fenqi.com%2Fapp%2Ffamily%2Fweixin%2Flogin.html&response_type=code&scope=snsapi_base&state=RfRGW6u#wechat_redirect

