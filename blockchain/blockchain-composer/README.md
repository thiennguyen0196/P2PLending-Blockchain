# CẤU TRÚC SMART CONTRACT CHO MẠNG LƯỚI P2P-LENDING

Smart Contract lưu trữ thông tin về các hợp đồng phát sinh trong quá trình vay, được lưu trữ trên blockchain dưới sự đồng thuận của các ledger có trong mạng lưới

## Giới thiệu chung

### Nhóm Tác giả

1453044 - Nguyễn Hoàng Thiên
1453045 - Nguyễn Châu Thành Thiện

### Người hướng dẫn

Tiến sĩ Đinh Bá Tiến - Trưởng khoa CNTT, ĐH KHTN
Nguyễn Thanh Sơn - Trưởng phòng PayooX, VietUnion

## Giới thiệu hệ thống

### Công cụ sử dụng

* [Visual Studio Code](https://code.visualstudio.com/) - trình IDE hỗ trợ lập trình
* [Hyperledger Composer Add-on](https://github.com/hyperledger/composer-vscode-plugin) - plugin trên VSC hỗ trợ cấu trúc model, logic, permission cho hệ thống Fabric
* [Hyperledger Composer Playground](http://composer-playground.mybluemix.net/) - hỗ trợ việc kiểm thử cấu trúc các smart contract được lập trình
* [Hyperledger Composer CLI](https://github.com/hyperledger/composer) - hỗ trợ việc cài đặt, kiểm thử, triển khai, giám sát hệ thống blockchain bằng command line
* [Hyperledger Composer Node.js SDK](https://github.com/hyperledger/composer) - Thư viện hỗ trợ xây dựng với hệ thống Hyperledger Fabric với Composer

### Cấu trúc các Contract căn bản

* LoanContract - Lưu trữ thông tin khoản vay, người đi vay liên quan
* InvestingContract - Lưu trữ thông tin cam kết đầu tư khoản vay, nhà đầu tư liên quan
* SettlementContract - Lưu trữ một kỳ hạn thanh toán của khoản vay, người đi vay thực hiện
* InvestingFeeContract - Lưu trữ thông tin thu phí dịch vụ của nên tảng ứng với một kỳ hạn thanh toán của một tập cam kết đầu tư.

## Triển khai mạng lưới

### Yêu cầu

* Cài đặt Node.js phiên bản 8.10.0 trở lên
* Cài đặt npm phiên bản 5.x trở lên
* Cài đặt [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/en/release-1.0/getting_started.html) 
* Cài đặt [Hyperledger Composer](https://hyperledger.github.io/composer/latest/installing/development-tools.html)


### Hướng dẫn triển khai mạng lưới ở localhost

* Làm theo hướng dẫn của [Hyperledger Composer](https://hyperledger.github.io/composer/latest/tutorials/deploy-to-fabric-single-org)

### Hướng dẫn triển khai mạng lưới ở IBM Kubernetes IBM Service

1. Làm theo hướng dẫn trong thư mục LIB/ibm-container-service
2. Mở đường link https://your-kubernetes-public-ip:31080 hoặc http://173.193.120.168:31080 (do nhóm thực hiện sẵn)
3. Tạo mới một business netword archive với user = admin và password = password (nút Deploy new business network)
4. Mở BNA vừa tạo.
5. Upload các file model.cto, permission.acl, logic.js lên và thực hiện lệnh update
(Lưu ý: Nếu sử dụng IP mà nhóm tạo, vui lòng không thay đổi các BNA hiện có vì ảnh hưởng đến hệ thống hiện tại. Nếu không truy cập được IP thì liên hệ nhóm để cấp lại IP mới do chính sách của Kuberbetes sẽ thay đổi cluster mỗi tháng một lần)

## Bản quyền

Hệ thống này thuộc sở hữu của nhóm tác giả, được bảo hộ bởi quyền sản phẩm trí tuệ theo quy định của Đại học Khoa Học Tự Nhiên và công ty Cổ phần Dịch vụ trực tuyến (VietUnion)

