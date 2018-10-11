# SERVER BACK-END CỦA HỆ THỐNG CHO VAY NGANG HÀNG

Hệ thống back-end của nền tảng cho vay ngang hàng hỗ xử lý yêu cầu dữ liệu (API) từ client

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
* [Mongoose](http://mongoosejs.com/) - Thư viện hỗ trợ tổ chức các Schema, Model trên CSDL MongoDB
* [Twillio](https://www.twilio.com/) - Thư viện hỗ trợ xác thực số điện thoại người dùng
* [Hyperledger Composer Node.js SDK](https://github.com/hyperledger/composer) - Thư viện hỗ trợ tương tác với hệ thống Hyperledger Fabric
* [JSONWebToken](https://github.com/auth0/node-jsonwebtoken) - Thư viện hỗ trợ tạo token bảo mật giữa client và server

### Các API cơ bản

* POST auth/signin - Đăng nhập vào hệ thống
* GET loan/current - Xem khoản vay hiện tại
* POST loan/create - Tạo khoản vay
* POST invest/create - Cam kết đầu tư khoản vay
* POST settle/loan  - Trả kỳ hạn khoản vay
* .....

## Triển khai

### Yêu cầu

* Cài đặt Node.js phiên bản 8.10.0 trở lên
* Cài đặt npm phiên bản 5.x trở lên
* Cài đặt MongoDB phiên bản 4.0 trở lên
* Cài đặt Heroku phiên bản 7.0.26 trở lên
* Cài đặt git 2.9.x trở lên

### Hướng dẫn chạy trên nền localhost

1. Chạy server MongoDB ở cổng 27017
2. Ở thư mục gốc, chạy lệnh npm install
3. Chạy lệnh npm start
4. Server start ở cổng 8080
5. Thực hiện các API tương ứng

### Hướng dẫn chạy trên môi trường heroku

1. Đăng nhập vào heroku - heroku login
2. Chạy lệnh heroku create
3. Cài đặt addon heroku MongoDB mLab trên web heroku
4. Cài đặt biến môi trường trong file config/data.json trên web heroku
4. Chạy lệnh git add . 
5. Chạy lệnh git commit -am "Deploy server p2p"
6. Chạy lệnh git push heroku master
7. Heroku thông báo trạng thái triển khai
(API Endpoint nhóm đã triển khai: https://p2p-lending-14clc.herokuapp.com/)

## Bản quyền

Hệ thống này thuộc sở hữu của nhóm tác giả, được bảo hộ bởi quyền sản phẩm trí tuệ theo quy định của Đại học Khoa Học Tự Nhiên và công ty Cổ phần Dịch vụ trực tuyến (VietUnion)






