# installation

## 1. init project

`package.json` 생성

```
npm init -y
```

private project 설정

```javascript
{
  ...
  "private": true,
  ...
}
```

`.gitignore` 준비

```
.DS_Store
node_modules
/dist

# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# lib
/semantic
semantic.json
```

## 2. webpack 설치

```
npm install --save-dev webpack webpack-cli
```

webpack 설치후 `package.json`에 컴파일 명령어를 추가함

```javascript
{
  ...,
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ...,
}
```

이제 터미널에서 아래와 같이 컴파일을 할 수 있다

```
npm run build
```



## 3. Webpack 설정 과정(Loader, Plugin)

### 3.1. css처리(Loader)

css를 처리하는 loader 추가함

```
npm install --save-dev style-loader css-loader
```

`webpack.config.js`에 아래와 같이 설정 추가

```javascript
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  }
  ...
}
```

- [https://webpack.js.org/loaders/css-loader/](https://webpack.js.org/loaders/css-loader/)

loader 순서가 중요하다(뒤에서 앞으로 실행됨)

- **css-loader** - css파일을 javascript 모듈로 변환
- **style-loader** - css모듈(js 모듈)을 본문에 `<style>..</style>` 태그로 삽입함

### 3.2. scss 처리(Loader)

`sass-loader`를 추가함

```
npm install --save-dev sass-loader node-sass
```

`webpack.config.js`에서 `scss`파일을 `sass-loader`와 연결함

```javascript
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  }
  ...
}
```

- `sass-loader`를 맨뒤에 넣어서 먼저 실행되게 함

### 3.3. html 파일에 js 파일 주입(Plugin)

현재는 index.html 파일에 직접 js 파일을 import하고 있음

```html
-- /public/index.html

<html lang="en">
  <head>
    ...
  </head>
  <body>
    ...
  <body>
  <script src="/dist/main.js"></script><!--템플릿 파일에 js파일을 import한 상태 -->
</html>
```

최종적으로 산출되는 js 파일을 템플릿 파일에 자동으로 주입하는 플러그인을 사용함

템플릿 파일에서는 js 파일을 임포트하는 코드를 제거함

```html
-- /public/index.html

<html lang="en">
  <head>
    ...
  </head>
  <body>
    ...
  <body>
  <!--<script src="/dist/main.js"></script> js파일을 import하지 않음 -->
</html>
```

webpack으로 빌드한 js 를 템플릿 파일에 자동 삽입해주는 플러그인을 설치함

```
npm install --save-dev html-webpack-plugin
```

그리고 `webpack.config.js`에서 플러그인 설치 코드를 추가함

```javascript
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: { ... },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  module: {
    rules: [...],
  },
};
```

- **template** - html파일을 생성할 때 사용할 템플릿 경로를 지정함. 지금까지 `/public/index.html` 을 사용해왔으므로 이제 이 파일을 템플릿으로 사용합니다.

### 3.4. 설정 분리

개발환경과 제품배포환경을 분리해서 관리하려 함

- development - 개발중에만 따로 배포 설정을 적용함
- production - 실서버에 반영할 최종 산출물용 설정을 따로 분리함

두가지 환경에서 공통으로 사용되는 Loader와 Plugin 등을 모아서 `webpack.config.js` 파일로 뽑아내고, 개발 환경별 설정파일(`webpack.dev.js`, `webpack.prod.js`)에서 별도의 설정을 추가해서 운영함

이를 위해서 두개의 설정 파일을 추가함

- webpack.dev.js
- webpack.prod.js
- webpack.config.js(기존 설정, 공유해서 사용하고 싶음)

#### webpack.config.js

공통 설정 모음

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
```

- 기존 설정에서 `mode`와 `output` property를 삭제함. 이 properties 들은 환경별 설정 파일에서 선언합니다.

#### webpack.dev.js

```javascript
const path = require("path");
module.exports = {
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "main.js",
  },
};
```

- **filename: "main.js"** - 개발 환경에서는 빌드된 js 파일 이름에 hash값을 붙이지 않고 싶음

#### webpack.prod.js

```javascript
const path = require("path");
module.exports = {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "main.[contenthash].js",
  },
};
```

- **filename: "main.[contenthash].js"** - 배포 환경에서는 빌드된 js 파일 이름에 hash값을 붙여서 생성하고 싶음

#### merge plugin 설치

이렇게 설정파일을 쪼갰다고해서 자동으로 `webpack.config.js`를 읽어들이지 않습니다.

공통 설정 파일을 병합해주는 라이브러리를 설치해서 사용해야 함(뭐 좀 하려면 죄다 플러그인..)

```
npm install --save-dev webpack-merge
```

- 여러개의 설정 파일을 합쳐주는 라이브러리

설치 후 `webpack.config.js`를 불러들여서 합쳐야하는 두개의 설정 파일에서(`webpack.dev.js`, `webpack.prod.js`) 사용함

```javascript
// 1. webpack.dev.js
const path = require("path");

const commonConfig = require("./webpack.config");
const merge = require("webpack-merge");

module.exports = merge(commonConfig, {
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/main.js",
  },
});
```

```javascript
// 2. webpack.prod.js
const path = require("path");

const commonConfig = require("./webpack.config");
const merge = require("webpack-merge");

module.exports = merge(commonConfig, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/main.[contenthash].js",
  },
});
```

이렇게 개발환경, 배포환경이 공통 설정을 읽어들인 후 각자의 환경 설정을 병합해서 빌드를 하게 됨.

#### npm run 명령어 분리

그리고 빌드 명령어도 지금까지는 `npm run build`였지만, 두가지 환경에 따라 빌드하는 명령어로 변경하고 싶음

- 개발 환경에서는 - `npm run serve`
- 배포 환경에서는 - `npm run build`

`package.json`에서 `scripts` property는 아래와 같은데

```javascript
{
  ...,
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ...
}
```

아래와 같이 명령어를 분리함

```javascript
{
  ...,
  "scripts": {
    "build": "webpack --config webpack.prod.js",
    "serve": "webpack --config webpack.dev.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ...
}
```

`npm run build` 로 실행하면 배포 파일을 생성하고, `npm run serve`를 실행하면 개발 환경으로 파일을 생성함

