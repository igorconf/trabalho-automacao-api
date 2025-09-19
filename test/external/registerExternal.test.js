const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app');

describe('External - Register', () => {
  const { users } = require('../../model/userModel');
  it('Deve registrar um novo usuário com sucesso', async () => {
  users.length = 0;
    const resposta = await request(app)
      .post('/register')
      .send({ 
        username: 'igor', 
        password: 'senha123' 
      });
    expect(resposta.status).to.equal(201);
    expect(resposta.body).to.have.property('id');
  expect(resposta.body).to.have.property('username', 'igor');
  });

  it('Deve retornar erro ao tentar registrar usuário já existente', async () => {
    await request(app)
      .post('/register')
      .send({ 
        username: 'maria', 
        password: 'senha123' 
      });
    const resposta = await request(app)
      .post('/register')
      .send({ 
        username: 'maria', 
        password: 'senha123' 
      });
    expect(resposta.status).to.equal(409);
    expect(resposta.body).to.have.property('error');
  });

  it('Deve retornar erro ao enviar dados incompletos', async () => {
    const resposta = await request(app)
      .post('/register')
      .send({ 
        username: 'joao' 
      });
    expect(resposta.status).to.equal(400);
    expect(resposta.body).to.have.property('error');
  });
});
