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
