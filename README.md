# JWT Login & Register API

API de autenticação desenvolvida com Node.js, Express, Mongoose e MongoDB utilizando JWT para autenticação de usuários.

## Funcionalidades

- Registro de usuários
- Login com autenticação JWT
- Rotas públicas e privadas
- Criptografia de senha com bcrypt
- Middleware para validação de token
- Integração com MongoDB usando Mongoose

---

## Tecnologias utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- nodemon

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/jwt-login-register.git
```

Entre na pasta do projeto:

```bash
cd jwt-login-register
```

Instale as dependências:

```bash
npm install
```

---

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto seguindo o exemplo do `.env.example`:

```env
MONGO_URI=sua_string_de_conexao_mongodb
SECRET=sua_chave_secreta_jwt
```

---

## Executando o projeto

```bash
npm run dev
```

O servidor será iniciado em:

```bash
http://localhost:3000
```

---

## Rotas da API

### Rota pública

#### GET /

Retorna uma mensagem de boas-vindas.

---

### Registro de usuário

#### POST /auth/register

Body:

```json
{
  "name": "Rafael",
  "email": "rafael@email.com",
  "password": "123456",
  "confirmpassword": "123456"
}
```

---

### Login

#### POST /auth/login

Body:

```json
{
  "email": "rafael@email.com",
  "password": "123456"
}
```

Retorna um token JWT.

---

### Rota privada

#### GET /users/:id

Necessário enviar o token no header:

```bash
Authorization: Bearer SEU_TOKEN
```

---

## Estrutura do projeto

```bash
├── models
│   └── User.js
├── .env
├── .env.example
├── app.js
├── package.json
```

---

## Aprendizados

Esse projeto foi desenvolvido com foco em praticar:

- Autenticação JWT
- Criação de APIs REST
- Middleware no Express
- Segurança com hash de senha
- Integração com MongoDB

---

## Autor

Desenvolvido por Rafael Tavares
