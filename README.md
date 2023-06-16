# 简介

[![pnpm](https://img.shields.io/badge/pnpm-%23F24E1E.svg?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Vue.js 3](https://img.shields.io/badge/vue.js%203-%234FC08D.svg?style=for-the-badge&logo=vue.js&logoColor=white)](https://v3.vuejs.org/)
[![Nuxt 3](https://img.shields.io/badge/nuxt.js%203-%2300C58E.svg?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://v3.nuxtjs.org/)
[![DaisyUI](https://img.shields.io/badge/daisyui-%231AB1D6.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://daisyui.com/)
[![Pinia](https://img.shields.io/badge/pinia-%2362af43.svg?style=for-the-badge&logo=pinia&logoColor=white)](https://pinia.vuejs.org/)
[![UnoCSS](https://img.shields.io/badge/unocss-%2300C58E.svg?style=for-the-badge&logo=unocss&logoColor=white)](https://unocss.antfu.me/)
[![Nuxt i18n](https://img.shields.io/badge/nuxt_i18n-%2300C58E.svg?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://i18n.nuxtjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Collie是一个基于ChatGPT语言模型的在线聊天网站，旨在为用户提供智能有趣的对话体验

### PC端

![chat](./public/1686895177725.jpg)
![setup](./public/1686895167628.jpg)

### 移动端

![chat](./public/1686895248927.jpg)

## 使用

1.安装依赖

```bash
# pnpm
pnpm install
```
2.在根目录中创建一个 .env 文件并粘贴以下内容：
 ```
NUXT_PUBLIC_API_BASE=
NUXT_PUBLIC_SOCKET_URL=
 ```
  - **`NUXT_PUBLIC_API_BASE`** 服务器API地址
  - **`NUXT_PUBLIC_SOCKET_URL`** 服务器SOCKET地址

## Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```



Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
