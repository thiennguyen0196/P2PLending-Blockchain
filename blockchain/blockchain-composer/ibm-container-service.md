# SCRIPT TRIỂN KHAI MẠNG LƯỚI FABRIC LÊN IBM KUBERNETES SERVICE

Các script này được viết bởi [IBM BLOCKCHAIN CONATINER SERVICE](https://github.com/IBM-Blockchain/ibm-container-service)

## Yêu cầu trước khi triển khai

* Cài đặt IBM Cloud CLI phiên bản 0.6.6
* Cài đặt Kubectl CLI phiên bản 1.9.3
* Cài đặt [Docker Compose](https://docs.docker.com/compose/install/)
* Cài đặt [composer-cli](https://www.npmjs.com/package/composer-cli)
* Đăng ký tài khoản [IBM Bluemix Cloud](https://console.bluemix.net/registration/)

## Các bước triển khai mạng lưới fabric

1. Mở Docker Composer
2. Đăng nhập IBM Cloud: bx login
3. Thực hiện: bx cs cluster-create --name p2plending
4. Thực hiện: bx cs workers p2plending ;chờ khoảng 35 phút cho đến khi thông báo trạng thái normal và ready
5. Thực hiện: bx cs cluster-config p2plending 
6. Thực hiện: EXPORT link trong đó link là chuổi sinh ra ở bước 5
7. Ở thư mục ibm-container-service/cs-offering/scripts thực hiện: ./create_all.sh
8. Chờ thông báo "deploy successfully"
9. Tiếp tục thực hiện hướng dẫn trong phần SOURCE/blockchain-composer

## Liên kết mạng lưới fabric với hệ thống back-end

1. Tải các file BNA cần import từ trình Composer Playground (admin@p2plending)
2. Ở thư mục ibm-container-service/cs-offering/scripts/connection-profile thực hiện: ./update_card.sh -c admin.card -a <EXTERNAL_PUBLIC_IP>
3. Thực hiện  composer card import -f admin.card
4. Mở thư mục $HOME/.composer
5. Copy thư mục client-data vào thư mục server/.composer/client-data
6. Copy thư mục cards vào thư mục server/data/storage/cardstores
(Mã nguồn hiện tại của server nhóm đã thực hiện sẵn các bước này)

## Mạng lưới nhóm tác giả triển khai sẳn

1. Trình phát triển chaincode Hyperledger Composer Playground, địa chỉ URL: http://173.193.122.71:31080 
2. Thành phần thực hiện chức năng Fabric Certificate Authority (FCA), địa chỉ URL là: http://173.193.122.71:30054 
3. Thành phần endoserer 1: http://173.193.122.71:30110 
4. Thành phần endoserer 2:  http://173.193.122.71:30210 
5. Thành phần orderer: http://173.193.122.71:31010 
6. Thành phần committing peer 1: http://173.193.122.71:300111 
7. Thành phần committing peer 2: http://173.193.122.71:30211 
8. Hệ thống back-end của nhóm: https://p2p-lending-14clc.herokuapp.com/
(Lưu ý: vui lòng không chỉnh sửa các file bna trong Composer Playground vì ảnh hưởng đến hệ thống hiện tại)

## Bản quyền

Mã nguồn của bộ script này thuộc sỡ hữu của [IBM BLOCKCHAIN CONATINER SERVICE](https://github.com/IBM-Blockchain/ibm-container-service)




