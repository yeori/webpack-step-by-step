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
    ],
  }
  ...
}
```

- [https://webpack.js.org/loaders/css-loader/](https://webpack.js.org/loaders/css-loader/)

loader 순서가 중요하다(뒤에서 앞으로 실행됨)

- **css-loader** - css파일을 javascript 모듈로 변환
- **style-loader** - css모듈(js 모듈)을 본문에 `<style>..</style>` 태그로 삽입함
