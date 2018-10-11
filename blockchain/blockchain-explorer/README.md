# ỨNG DỤNG WEB THEO DÕI HỆ THỐNG HYPERLEDGER FABRIC

Ứng dụng web explorer này nhằm giúp giám sát các transaction, block xảy ra trên mạng lưới Hyperledger Fabric đã triển khai.
Ứng dụng web explorer này được fork từ [Hyperledger Explorer](https://github.com/hyperledger/blockchain-explorer/tree/release-3.2) và được điều chỉnh cho phù hợp với quy trình nghiệp vụ của hệ thống.

## Giới thiệu chung

### Nhóm Tác giả

1453044 - Nguyễn Hoàng Thiên
1453045 - Nguyễn Châu Thành Thiện

### Người hướng dẫn

Tiến sĩ Đinh Bá Tiến - Trưởng khoa CNTT, ĐH KHTN
Nguyễn Thanh Sơn - Trưởng phòng PayooX, VietUnion

## Giới thiệu hệ thống

### Thư viện sử dụng

* [Node.js](https://nodejs.org/en/) - Nền tảng xây dựng back-end
* [Express.js](https://expressjs.com/) - Thư viện hỗ trợ xây dựng các API của server
* [PostgreSQL](https://www.postgresql.org/) - CSDL quan hệ PostgreSQL
* [ReactJS](https://reactjs.org/) - Nền tảng xây dựng giao diện web

### Các chức năng cơ bản

* Dashboard - Xem thông tin tổng quan của mạng lưới hiện tại (Số block, transaction, node, chaincode, timeline)
* Block - Xem thông tin tổng quan của một block dữ liệu
* Transaction - Xem thông tin chi tiết của một transaction
* Góc nhìn người dùng (mở bằng ứng dụng di động) - Xem thông tin chi tiết transaction mà người dùng đó tạo ra

## Triển khai

### Yêu cầu

* Cài đặt Node.js phiên bản 8.10.0 trở lên
* Cài đặt npm phiên bản 5.x trở lên
* Cài đặt PosrgreSQL phiên bản 10
* Cài đặt Heroku phiên bản 7.0.26 trở lên
* Cài đặt git 2.9.x trở lên

### Hướng dẫn chạy trên nền localhost

1. Chạy server PostgreSQL ở cổng 5432
2. Điều chỉnh file appconfig.json phù hợp với mạng lưới blockchain triển khai, nếu sử dụng lại hệ thống do nhóm triển khai thì bỏ qua bước này
3. Ở thư mục app/db, chạy command psql và thực hiện 2 file explorerpg.sql và update.sql để tạo các bảng lưu trữ dữ liệu
4. Ở thư mục client, chạy lệnh npm run build
5. Ở thư mục gốc, chạy lệnh npm install
6. Truy cập đường dẫn https://localhost:8080

### Hướng dẫn chạy trên môi trường heroku

1. Đăng nhập vào heroku - heroku login
2. Chạy lệnh heroku create
3. Cài đặt addon heroku Postgres trên web heroku
4. Chạy command psql và thực hiện 2 file explorerpg.sql và update.sql cho addon database vừa tạo
4. Chạy lệnh git add . 
5. Chạy lệnh git commit -am "Deploy Hyperledger Explorer"
6. Chạy lệnh git push heroku master
7. Heroku thông báo trạng thái triển khai
(API Endpoint nhóm đã triển khai: https://aqueous-hollows-61580.herokuapp.com/)

## Bản quyền

Hệ thống này thuộc sở hữu của nhóm tác giả, được bảo hộ bởi quyền sản phẩm trí tuệ theo quy định của Đại học Khoa Học Tự Nhiên và công ty Cổ phần Dịch vụ trực tuyến (VietUnion)
