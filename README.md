# API de Usuários - Automação API

Esta API permite registrar usuários, realizar login e consultar usuários cadastrados. O objetivo é servir como base para estudos de testes e automação de APIs.

## Funcionalidades
- **Registro de usuário**: Não permite duplicidade de username. Cadastro apenas com login e senha.
- **Login**: Usuário e senha obrigatórios. Retorna um token JWT.
- **Consulta de usuários**: Apenas usuários autenticados podem consultar.
- **Banco de dados em memória**: Dados armazenados em variáveis.
- **Documentação Swagger**: Disponível em `/api-docs`.

## Estrutura de diretórios
```
controller/   # Lógica dos endpoints
service/      # Regras de negócio
model/        # Modelos e dados em memória
app.js        # Configuração dos middlewares e rotas
server.js     # Inicialização do servidor
swagger.json  # Documentação da API
```

## Instalação

1. Clone o repositório:
   ```bash
   git clone <repo-url>
   cd trabalho-automacao-api
   ```
2. Instale as dependências:
   ```bash
   npm install express swagger-ui-express bcryptjs jsonwebtoken
   ```

## Como executar

- Para iniciar o servidor:
  ```bash
  node server.js
  ```
- Acesse a documentação Swagger em [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Endpoints

- `POST /register` - Cadastro de usuário (login e senha)
- `POST /login` - Login e obtenção de token
- `GET /users` - Consulta de usuários (requer token JWT)

## Testes

Para testar a API com Supertest, importe o `app.js` em seus testes sem executar o método `listen()`.

## Observações
- O banco de dados é volátil e será perdido ao reiniciar o servidor.
- O token JWT deve ser enviado no header `Authorization` como `Bearer <token>` para acessar `/users`.
# trabalho-automacao-api


## Testes

O projeto possui testes automatizados para todas as rotas principais, divididos em dois níveis:

- **Controller:** Testa o comportamento dos controllers, incluindo uso de mocks com sinon para simular respostas dos serviços.
- **External:** Testa as rotas de forma integrada, sem mocks, simulando o uso real da API.

Para rodar os testes:

- `npm run test:controller` — executa apenas os testes de controller
- `npm run test:external` — executa apenas os testes external
- `npm run test` — executa todos os testes

Os testes cobrem os cenários de sucesso, erro de dados obrigatórios, autenticação e casos de negócio para cada rota (`/register`, `/login`, `/users`, `/rate`).
