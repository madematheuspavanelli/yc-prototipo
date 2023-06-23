# youcheck.in frontend

## Tech Stacks

- [Vue.js (2)](https://v2.vuejs.org/)
- [Vue Router (3)](https://v3.router.vuejs.org/)
- [Vuex (3)](https://v3.vuex.vuejs.org/)

## Requisitos

- [Node.js](https://nodejs.org/en/download/) na **versão 14**

## 🚀 Desenvolvendo

### Instale as dependências

```sh
  npm install
```

### Rode o projeto

```sh
  npm run serve
```

Abra o servidor em: `http://locahost:8080

## 🌐 Links úteis

- [Layout Figma](https://www.figma.com/file/JfnI4OtUh3sfDVRzS8Oap2/Youcheckin_Site_Layout?type=design&node-id=910-590&t=wUvWtg1ExjrxPW49-0)

## Docker

Criar imagem local:
docker build -t youcheckin-front-homol:homol .

Executar o docker local:
docker run --rm -it -p 8080:8080/tcp -front-homol:homol
