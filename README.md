# Session-Based Token Renewal with Refresh Tokens

Este projeto demonstra como implementar a renovação de tokens de acesso utilizando **Refresh Tokens** com cookies, aplicando o padrão **Session-Based Token Renewal**.

## Tecnologias

- **Node.js** e **Express**
- **JWT** (JSON Web Tokens)
- **Cookies HTTPOnly**
- **dotenv** para variáveis de ambiente

## Funcionalidades

- **Autenticação de Clientes**: Gera Access Tokens e Refresh Tokens.
- **Refresh Tokens**: Renovação do Access Token utilizando o Refresh Token após expiração.
- **Proteção de Rotas**: Validação do token de acesso e verificação de permissões (scopes).

## Endpoints

### 1. **Autenticação**
- **POST `/auth`**  
  Recebe `clientId` e `clientSecret`, gera os tokens e os armazena em cookies.

### 2. **Rotas Protegidas**
- **GET `/users`** (requer `read:user`)
- **GET `/admins`** (requer `read:admin`)

## Como Rodar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/oauth2-refresh-token-example.git
   cd oauth2-refresh-token-example
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` com:
   ```env
   JWT_SECRET=12345678
   JWT_REFRESH_SECRET=123123
   NODE_ENV=production
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

O servidor estará em `http://localhost:3000`.

## Fluxo

1. O cliente autentica com `clientId` e `clientSecret` e recebe os tokens.
2. O access token é usado para acessar rotas protegidas.
3. Se o access token expirar, o refresh token é utilizado para obter um novo access token.

## Conclusão

Esse projeto implementa a renovação de tokens de acesso utilizando refresh tokens armazenados em cookies, oferecendo um método seguro e eficiente de autenticação e autorização.
