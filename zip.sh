##############################################################
## Author dongjiu 2015-3-12
## Used for zip lixianbao for student
##############################################################
#/bin/bash

## version is can not be null!!
if [ $# != 1 ] ; then 
	echo "USAGE: sh $0 VERSION" 
	echo " e.g.: sh $0 1.2.6" 
	exit 1; 
fi

if [ ! -d "g.tbcdn.cn/dt/sycm-c-phone" ]; then
	mkdir -r g.tbcdn.cn/dt/sycm-c-phone
fi

cd g.tbcdn.cn/dt/sycm-c-phone/

rm -r *
mkdir $1
cp -rf ../../../build/* $1
cd ../../../
if [ -f "g.tbcdn.cn.zip" ]; then
	mv g.tbcdn.cn.zip g.tbcdn.cn.zip.autobak
fi
zip -r g.tbcdn.cn.zip g.tbcdn.cn/

if [ -f "g.tbcdn.cn.zip" ]; then
	echo "\033[32m Congratulations!! Zip lixianbao successfully!! \033[0m"
	exit 0
else
	echo "\033[31m Sorry!! Zip lixianbao failed!! Pls check the reason!! \033[0m"
        exit 1
fi

