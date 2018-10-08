<img src="logo.png" align="right" />

# P2P Lending Blockchain
> Final thesis at Ho Chi Minh City University of Science - Faculty of Information Technology - Excellence Program (Academic year: 2014 to 2018)

Researching how to use blockchain technology (Hyperledger) in order to improve P2P Lending platform by storing transactions into smart contracts. We also built a simple React Native mobile application to demonstrate the business model. Follow [documentation](P2P_LENDING_BLOCKCHAIN.pdf) for more details.

This readme file describes **client - mobile application** only. For more information about the **server - blockchain system**, please contact us.

## Table of contents
* [Installation](#installation)
    * [Requirements](#requirements)
    * [Instruction to install](#instruction-to-install)
        * [iOS simulator](#iOS-simulator)
        * [Android device](#android-device)
    * [List of available user - for demo](#list-of-available-user-for-demo)
        * [Borrower](#borrower)
        * [Lender](#lender)
* [Features](#features)
* [Libraries](#libraries)
* [Authors](#authors)
* [License](#license)

## Installation
> These installation steps are used to build mobile application demo only

### Requirements
* OS X or Linux
* [Node.js](https://nodejs.org/) version 8.10.0 and up
* [npm](https://www.npmjs.com/) version 5.x and up
* [React Native](https://facebook.github.io/react-native/) version 0.55.3 and up
* [React](https://reactjs.org/) version 16.3.0-alpha.2 and up

### Instruction to install
#### iOS simulator
Open terminal on primary folder and navigate to client folder:
```sh
$ cd client
```

Install all necessary libraries and packages:
```sh
$ npm install
```

Start iOS simulator and install application:
```sh
$ react-native run-ios
```

#### Android device
Download and copy [P2PLending.apk](P2PLending.apk) into your Android device, then install application and provide all required permissions.

### List of available user for demo
#### Borrower
* Account: 0973667901, 0973667902, 0973667903
* Password: 1

#### Lender
* Account: 01697634705, 01697634706
* Password: 1

## Features
A few of things P2P Lending Blockchain application can do:
* Sign In/Sign Up/Sign Out
* Declare personal information
* Create loan - borrower
* Watch history of loan - borrower
* Pay term loan - borrower
* Manage monthly income - lender
* Manage invested loan - lender
* Invest loan - lender
* Link payment gateway
* ...

<img src="https://user-images.githubusercontent.com/25218255/46635755-a687c180-cb7f-11e8-8c17-032111391359.png" align="center" />

<img src="https://user-images.githubusercontent.com/25218255/46635756-a687c180-cb7f-11e8-8184-2cb70a8625f1.png" align="center" />

<img src="https://user-images.githubusercontent.com/25218255/46635757-a7205800-cb7f-11e8-8c82-27a1fb7475cf.png" align="center" />


## Libraries
This mobile application used following open source libraries:
* [Moment.js](https://momentjs.com/) version 2.21.0
* [React Native Bcrypt](https://www.npmjs.com/package/react-native-bcrypt) version 2.4.0
* [React Native Blur](https://github.com/react-native-community/react-native-blur) version 3.2.2
* [react-native-datepicker](https://github.com/xgfe/react-native-datepicker) version 1.6.0
* [React Native Elements](https://github.com/react-native-training/react-native-elements) version 0.19.0
* [React Native Firebase](https://github.com/invertase/react-native-firebase) version 4.3.8
* [React Native Image Picker](https://github.com/react-community/react-native-image-picker) version 0.26.7
* [react-native-linear-gradient](https://github.com/react-native-community/react-native-linear-gradient) version 2.4.0
* [react-native-snap-carousel](https://github.com/archriss/react-native-snap-carousel) version 3.7.0
* [react-native-svg](https://github.com/react-native-community/react-native-svg) version 6.3.1
* [React Native Timeline Listview](https://github.com/thegamenicorus/react-native-timeline-listview) version 0.2.3
* [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons) version 4.5.0
* [React Navigation](https://reactnavigation.org/) version 3.2.0
* [Victory Native](https://github.com/FormidableLabs/victory-native) version 0.17.4

## Authors
[![25218255](https://user-images.githubusercontent.com/25218255/46636287-b0122900-cb81-11e8-8223-996a952029c8.png)](https://github.com/thiennguyen0196)  | [![25218822](https://user-images.githubusercontent.com/25218255/46636288-b0aabf80-cb81-11e8-855b-3b9b8750838e.jpeg)](https://github.com/thiennguyen2428)
---|---
Client mobile developer | Back-end blockchain developer

## License
Check [LICENSE.md](LICENSE.md) for more details.