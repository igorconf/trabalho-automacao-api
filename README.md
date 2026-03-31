# API REST com Estratégia Completa de Testes Automatizados

## 📌 Objetivo
Este projeto demonstra a implementação de uma API REST com uma estratégia completa de qualidade, cobrindo testes unitários, integração e performance.

O objetivo é garantir não apenas o funcionamento correto da aplicação, mas também sua confiabilidade sob carga, utilizando testes de performance com K6.

## 🧠 Estratégia de Testes

A abordagem adotada cobre diferentes níveis de validação:

- Testes unitários → validação da lógica de negócio
- Testes de integração → validação dos endpoints
- Testes de performance → validação sob carga com K6
- Testes com autenticação → fluxo completo com JWT

## 🚀 Diferenciais

- Testes de carga com K6 simulando cenários reais de uso
- Validação de SLOs com thresholds (P95 e taxa de sucesso)
- Pipeline CI/CD com execução automatizada
- Data-driven testing com múltiplos usuários
- Reaproveitamento de dados entre requisições (fluxos reais)

---

## 📋 Funcionalidades

- ✅ **Registro de usuário**: Sem duplicidade de username
- ✅ **Login com JWT**: Token de autenticação para acesso protegido
- ✅ **Consulta de usuários**: Apenas autenticados
- ✅ **Avaliação de usuários**: Endpoint `/rate` protegido
- ✅ **Banco de dados em memória**: Persistência durante execução
- ✅ **Documentação Swagger**: `/api-docs`

## 🧪 Tipos de Testes Implementados

- Testes unitários (Mocha + Sinon)
- Testes de integração (Supertest)
- Testes de performance (K6)

## 📁 Estrutura de Diretórios

```
controller/          # Lógica dos endpoints
service/             # Regras de negócio
model/               # Modelos e dados
middleware/          # Autenticação JWT
test/
  ├── controller/    # Testes unitários (Mocha + Sinon)
  ├── external/      # Testes de integração (Supertest)
  └── k6/            # Testes de performance
      ├── api.test.js
      ├── helpers.js
      └── data/users.json
scripts/
  └── k6-report.js   # Gerador de relatório HTML
.github/workflows/
  └── tests.yml      # CI/CD: Automation Tests + K6 Performance Tests
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 20+
- K6 v1.4.2+ (instalado no SO, não via npm)

### Setup

```bash
# Clone o repositório
git clone <repo-url>
cd trabalho-automacao-api

# Instale dependências
npm install

# Inicie o servidor
node server.js
```

### Endpoints

| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| POST | `/register` | ❌ | Registra novo usuário |
| POST | `/login` | ❌ | Login e retorna JWT |
| GET | `/users` | ✅ Bearer | Lista usuários |
| POST | `/rate` | ✅ Bearer | Avalia outro usuário |

## 🧪 Testes Automatizados

### Testes Unitários e de Integração (Mocha + Chai + Sinon + Supertest)

```bash
# Executar todos os testes
npm run test

# Apenas controller tests (com mocks)
npm run test:controller

# Apenas external tests (integração real)
npm run test:external
```

**Controller Tests** (`test/controller/`): Utilizam **Sinon** para fazer mocks dos serviços, testando apenas a lógica do controller isoladamente.

```javascript
// Exemplo: test/controller/registerController.test.js
describe('RegisterController', () => {
  it('Deve registrar um novo usuário', async () => {
    const fakeUser = { id: 1, username: 'newuser', password: 'pass123' };
    sinon.stub(userService, 'registerUser').returns(fakeUser);
    
    const result = await registerController.register({ 
      body: { username: 'newuser', password: 'pass123' }
    });
    
    expect(result).to.deep.equal(fakeUser);
  });
});
```

**External Tests** (`test/external/`): Testam a API completa usando **Supertest**, simulando requisições HTTP reais.

```javascript
// Exemplo: test/external/integration.test.js
describe('API Integration Tests', () => {
  it('POST /register - Deve registrar novo usuário', async () => {
    const res = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'pass123' });
    
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('token');
  });

  it('GET /users - Deve listar usuários com autenticação', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${validToken}`);
    
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});
```

**Status dos Testes**:
- ✅ Controller Tests: 16 testes passando
- ✅ External Tests: 12 testes passando
- ✅ Total: 28 testes automatizados

## 🔥 Testes de Performance com K6

### Execução Local

```bash
# Terminal 1: Inicie o servidor
node server.js

# Terminal 2: Execute o K6
BASE_URL=http://localhost:3000 k6 run test/k6/api.test.js --out json=results.json

# Terminal 3: Gere o relatório
npm run k6:report

# Abra report.html no navegador
```

### Via GitHub Actions (CI/CD)

O projeto inclui um workflow automático que executa os testes K6 a cada push:

```yaml
# .github/workflows/k6-performance.yml
```

Acesse a aba **Actions** no GitHub para ver os resultados dos testes.

---

## 📊 Conceitos K6 Implementados

### 1️⃣ **Groups** - Organização de Testes

**O que é**: Agrupa testes logicamente para melhor organização e relatórios.

**Onde está**: `test/k6/api.test.js` (linhas 39-77)

```javascript
group('Auth - Register/Login/Reuse Token', function () {
  // Testes de autenticação
  const registerRes = http.post(`${BASE_URL}/register`, ...);
  const loginRes = http.post(`${BASE_URL}/login`, ...);
  token = loginRes.json('token');
});

group('Get Users', function () {
  // Teste de leitura com autenticação
  const usersRes = http.get(`${BASE_URL}/users`, { 
    headers: { Authorization: `Bearer ${token}` } 
  });
});

group('Rate User Data Driven', function () {
  // Teste com dados dinâmicos
  const rateRes = http.post(`${BASE_URL}/rate`, payload);
});
```

**Benefício**: Melhor organização dos resultados, facilitando identificar qual grupo falhou.

---

### 2️⃣ **Checks** - Validações Inline

**O que é**: Assertions executadas durante o teste, similar a `expect()` no Mocha.

**Onde está**: `test/k6/api.test.js` (linhas 47-52, 68-71, 82-84)

```javascript
const loginCheck = check(loginRes, {
  'login status 200': (r) => r.status === 200,
  'login has token': (r) => r.json('token') !== undefined,
});

check(usersRes, {
  'get users status 200': (r) => r.status === 200,
  'response is array': (r) => Array.isArray(r.json())
});

check(rateRes, {
  'rate status 201 or 404 or 400': (r) => [201, 404, 400].includes(r.status),
});
```

**Benefício**: Conta automaticamente passa/falha; valor agregado em `checks.rate` no relatório final.

---

### 3️⃣ **Thresholds** - Limites de Sucesso

**O que é**: Define critérios mínimos que o teste deve atender; falha o teste se não atingir.

**Onde está**: `test/k6/api.test.js` (linhas 24-28)

```javascript
export const options = {
  thresholds: {
    'checks': ['rate>0.95'],              // 95% dos checks devem passar
    'http_req_duration': ['p(95)<1000'],  // P95 da latência < 1s
  },
};
```

**Resultado Real**:
```
✅ checks rate=100% (passou: >95%)
✅ http_req_duration p(95)=18.1ms (passou: <1000ms)
```

---

### 4️⃣ **Trends** - Métricas Customizadas

**O que é**: Rastreia latência de operações específicas (min, max, avg, p95, p99).

**Onde está**: `test/k6/api.test.js` (linhas 13-15, 44-45, 78-79)

```javascript
const loginTrend = new Trend('login_duration');
const rateTrend = new Trend('rate_duration');
const successfulLogins = new Counter('successful_logins');

// Dentro do teste:
const loginStart = Date.now();
const loginRes = http.post(`${BASE_URL}/login`, ...);
loginTrend.add(Date.now() - loginStart);  // Registra tempo

successfulLogins.add(1);  // Incrementa contador
```

**Resultado Real**:
```
login_duration: avg=17.57ms, p95=19.1ms, max=24ms
rate_duration: avg=1.25ms, p95=2ms
successful_logins: 219
```

---

### 5️⃣ **Stages** - Simulação de Carga Progressiva

**O que é**: Define fases do teste (ramp-up, steady-state, ramp-down) com crescimento gradual de usuários.

**Onde está**: `test/k6/api.test.js` (linhas 17-21)

```javascript
stages: [
  { duration: '10s', target: 5 },   // Ramp-up: 0 → 5 VUs em 10s
  { duration: '20s', target: 10 },  // Aumento: 5 → 10 VUs em 20s
  { duration: '10s', target: 0 },   // Ramp-down: 10 → 0 VUs em 10s
],
```

**Benefício**: Simula padrão realista de acesso (usuários chegando e saindo).

---

### 6️⃣ **Data-Driven Testing** - SharedArray + Fixtures

**O que é**: Carrega dados de um arquivo para cada iteração, permitindo testes com múltiplos cenários.

**Onde está**: `test/k6/api.test.js` (linhas 8-11, 36-37)

```javascript
// Carrega fixture uma única vez (eficiência)
const users = new SharedArray('users', function () {
  return JSON.parse(open('./data/users.json'));
});

// Usa em cada iteração
const fixture = users[Math.floor(Math.random() * users.length)];
const payload = { 
  username: fixture.username, 
  password: fixture.password 
};
```

**Arquivo Fixture** (`test/k6/data/users.json`):
```json
[
  { "username": "igor", "password": "senha123" },
  { "username": "maria", "password": "senha123" },
  { "username": "joao", "password": "senha123" }
]
```

**Benefício**: Testa com dados realistas sem hardcoding; reutiliza dados entre VUs.

---

### 7️⃣ **Token de Autenticação** - JWT Bearer

**O que é**: Simula fluxo de autenticação real, obtendo token e usando em requisições protegidas.

**Onde está**: `test/k6/api.test.js` (linhas 46-54, 65-70)

```javascript
// Obter token
const loginRes = http.post(`${BASE_URL}/login`, 
  JSON.stringify({ username: fixture.username, password: fixture.password }),
  { headers: { 'Content-Type': 'application/json' } }
);
const token = loginRes.json('token');

// Usar token em request protegido
const usersRes = http.get(`${BASE_URL}/users`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**Implementação na API** (`middleware/authMiddleware.js`):
```javascript
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];
  req.user = jwt.verify(token, JWT_SECRET);
  next();
}
```

---

### 8️⃣ **Reaproveitamento de Resposta** - Response Reuse

**O que é**: Extrai dados de uma resposta e reutiliza em próximas requisições.

**Onde está**: `test/k6/api.test.js` (linhas 54, 67)

```javascript
// Resposta do login
const loginRes = http.post(`${BASE_URL}/login`, ...);
const token = loginRes.json('token');  // ← Extrai campo

// Reutiliza em próxima requisição
const usersRes = http.get(`${BASE_URL}/users`, {
  headers: { Authorization: `Bearer ${token}` }  // ← Usa aqui
});
```

**Benefício**: Testa fluxos realistas (login → acesso a recursos).

---

### 9️⃣ **Helpers / Faker** - Geração de Dados

**O que é**: Funções para gerar dados aleatórios, simulando biblioteca Faker.

**Onde está**: `test/k6/helpers.js` (linhas 1-15)

```javascript
export function randomUsername(prefix = 'user') {
  const id = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${id}`;  // Ex: "user_abc123"
}

export function randomPassword() {
  return Math.random().toString(36).substring(2, 10);  // Ex: "xyz12345"
}

export function fakerName() {
  const names = ['igor', 'maria', 'joao', 'rayla', 'ana', 'carlos'];
  return names[Math.floor(Math.random() * names.length)];
}
```

**Uso no Teste**:
```javascript
const toUser = fakerName();  // Seleciona nome aleatório
const payload = { fromUsername: fixture.username, toUsername: toUser, score: 5 };
```

---

### 🔟 **Variáveis de Ambiente** - Configuração Dinâmica

**O que é**: Permite passar valores do terminal ao script K6 via `__ENV`.

**Onde está**: `test/k6/api.test.js` (linha 31)

```javascript
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
```

**Execução com variável**:
```bash
BASE_URL=http://staging-api.com k6 run test/k6/api.test.js
```

**Benefício**: Mesmo teste para múltiplos ambientes (local, staging, prod).

---

### 1️⃣1️⃣ **Thresholds (continuação)** - Validação de SLOs

**Implementação Avançada**: Os thresholds são validados ao final da execução.

```javascript
export const options = {
  thresholds: {
    'checks': ['rate>0.95'],              // SLO: 95% de sucesso
    'http_req_duration': ['p(95)<1000'],  // SLO: P95 < 1s
  },
};
```

**Resultado do Teste Real**:
```
✅ THRESHOLDS PASSED:
  checks rate=100.00% (alvo: >0.95) ✓
  http_req_duration p(95)=18.1ms (alvo: <1000ms) ✓
```

---

## 📈 Resultados do Teste Real

Execução em: `10/12/2025 18:51:36`

| Métrica | Valor | Status |
|---------|-------|--------|
| Checks Pass Rate | **100%** | ✅ PASS |
| P95 Duration | **18.1ms** | ✅ PASS |
| Avg Duration | 5.4ms | ✓ |
| Max VUs | 10 | ✓ |
| Total Requisições | 876 | ✓ |
| Total Checks | 1.095 | 100% sucesso |
| Iterações Completas | 219 | ✓ |
| Duração Total | 41s | ✓ |

**Relatório HTML**: Execute `npm run k6:report` para gerar.

---

## 🔧 Testes Unitários (Mocha + Chai + Sinon)

```bash
npm run test:controller    # Testa controllers com mocks
npm run test:external      # Testa API real sem mocks
npm run test              # Todos os testes
```

**Exemplo de teste com mock** (`test/controller/loginController.test.js`):
```javascript
it('Deve fazer login usando mock do service', async () => {
  const fakeUser = { id: 1, username: 'mocklogin' };
  sinon.stub(userService, 'authenticateUser').returns(fakeUser);
  // ...
});
```

---

## 📦 GitHub Actions - CI/CD Automático

O projeto inclui **workflow automático** em `.github/workflows/tests.yml` que executa:

### 1. **Automation Tests** (Mocha + Chai)
- Controller Tests (com mocks via Sinon): 16 testes
- External Tests (integração com Supertest): 12 testes
- Valida lógica de controllers e integração da API

### 2. **Performance Tests** (K6)
- Executa teste de carga completo
- Gera relatório HTML com métricas
- Valida thresholds (95% checks, p95 < 1s)
- Faz upload dos resultados como artifacts

**Workflow Ativado em:**
- ✅ Push para `main` ou `develop`
- ✅ Pull Requests para `main` ou `develop`

**Resultados Disponíveis em:**
1. Aba **Actions** do repositório (logs de execução)
2. Seção **Artifacts** (report.html e results.json)
3. Comentário automático no PR (se aplicável)

**Exemplo de Execução:**
```
✅ automation-tests: 28 testes passando (controller + external)
✅ performance-tests: K6 executado, thresholds validados
📊 Artifacts disponíveis por 30 dias
```

**Para visualizar localmente o que o CI executa:**
```bash
# Terminal 1: Start server
node server.js

# Terminal 2: Run automation tests
npm run test

# Terminal 3: Run performance tests
BASE_URL=http://localhost:3000 k6 run test/k6/api.test.js --out json=results.json
npm run k6:report
```

---

## 📝 Observações

- Banco de dados em memória: perdido ao reiniciar o servidor
- JWT expira em 1 hora (`expiresIn: '1h'`)
- K6 deve ser instalado no SO (não via npm)
- Relatório HTML gerado via `scripts/k6-report.js`

---

## 📚 Documentação

- Swagger: `http://localhost:3000/api-docs`
- K6 Docs: https://k6.io/docs
- Guia Prático: `K6_GUIDE.md`
- Quick Start: `K6_QUICK_START.md`
   'login has token': (r) => r.json('token') !== undefined,
});
```

- Thresholds: definido em `options` do script para garantir SLOs:

```js
thresholds: {
   'checks': ['rate>0.95'],
   'http_req_duration': ['p(95)<1000'],
}
```

- Trends: métricas custom para medir latência de login/ratings:

```js
const loginTrend = new Trend('login_duration');
loginTrend.add(durationMs);
```

- Variável de Ambiente: `BASE_URL` usada para apontar o alvo:

```bash
BASE_URL=http://localhost:3000 k6 run test/k6/api.test.js
```

Observação: para reproduzir o HTML final localmente, execute k6 com saída JSON e converta usando um conversor (como `k6-reporter`). O script criado cobre os conceitos solicitados: Groups, Helpers, Checks, Trends, Thresholds, Stages, Reuse de resposta, Token Auth, Data-Driven Testing e um helper tipo Faker.

Os testes cobrem os cenários de sucesso, erro de dados obrigatórios, autenticação e casos de negócio para cada rota (`/register`, `/login`, `/users`, `/rate`).
