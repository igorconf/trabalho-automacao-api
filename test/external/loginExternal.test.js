const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app');

describe('External - Login', () => {
  before(async () => {
    await request(app)
      .post('/register')
      .send({ 
        username: 'igor', 
        password: 'senha123' 
      });
  });

  it('Deve fazer login com sucesso', async () => {
    const resposta = await request(app)
      .post('/login')
      .send({ 
        username: 'igor', 
        password: 'senha123' 
      });
    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property('token');
  });

  it('Deve retornar erro para credenciais inválidas', async () => {
    const resposta = await request(app)
      .post('/login')
      .send({ 
        username: 'igor', 
        password: 'errada' 
      });
    expect(resposta.status).to.equal(401);
    expect(resposta.body).to.have.property('error');
  });

  it('Deve retornar erro para dados incompletos', async () => {
    const resposta = await request(app)
      .post('/login')
      .send({ 
        username: 'joao' 
      });
    expect(resposta.status).to.equal(400);
    expect(resposta.body).to.have.property('error');
  });
});
