const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app');

describe('External - Users', () => {
  let token;
  before(async () => {
    await request(app)
      .post('/register')
      .send({ 
        username: 'igor', 
        password: 'senha123' 
      });
    const respostaLogin = await request(app)
      .post('/login')
      .send({ 
        username: 'igor', 
        password: 'senha123' 
      });
    token = respostaLogin.body.token;
  });

  it('Deve retornar lista de usuários autenticado', async () => {
    const resposta = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.be.an('array');
    const nomes = resposta.body.map(u => u.username);
    expect(nomes).to.include('igor');
    expect(nomes).to.include('maria');
  });

  it('Deve retornar erro se não enviar token', async () => {
    const resposta = await request(app)
      .get('/users');
    expect(resposta.status).to.equal(401);
    expect(resposta.body).to.have.property('error');
  });
});
