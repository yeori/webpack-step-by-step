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

## 3. Loader 사용

### 3.1. css처리

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
      {
        test: /\.scss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
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

### 3.2. scss 처리

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

### 3.3. html 파일에 js 파일 주입

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
