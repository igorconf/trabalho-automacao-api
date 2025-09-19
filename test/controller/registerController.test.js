const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../app');
const userService = require('../../service/userService');

describe('Register Controller', () => {
  afterEach(() => sinon.restore());

  it('Deve registrar usuário usando mock do service', async () => {
    const fakeUser = { id: 99, username: 'mockuser' };
    sinon.stub(userService, 'registerUser').returns(fakeUser);
    const resposta = await request(app)
      .post('/register')
      .send({ 
        username: 'igor', 
        password: 'senha123' 
      });
    expect(resposta.status).to.equal(201);
    expect(resposta.body).to.deep.equal(fakeUser);
  });
  it('Deve registrar um novo usuário com sucesso', async () => {
      const username = 'joao';
      const resposta = await request(app)
        .post('/register')
        .send({ 
          username, 
          password: 'senha123' 
        });
      expect(resposta.status).to.equal(201);
      expect(resposta.body).to.have.property('id');
      expect(resposta.body).to.have.property('username', username);
  });

  it('Deve retornar erro ao tentar registrar usuário já existente', async () => {
    await request(app)
      .post('/register')
      .send({ 
        username: 'joao', 
        password: 'senha123' 
      });
    const resposta = await request(app)
      .post('/register')
      .send({ 
        username: 'joao', 
        password: 'senha123' 
      });
    expect(resposta.status).to.equal(409);
    expect(resposta.body).to.have.property('error');
  });

  it('Deve retornar erro ao enviar dados incompletos', async () => {
    const resposta = await request(app)
      .post('/register')
      .send({ 
        username: 'rayla' 
      });
    expect(resposta.status).to.equal(400);
    expect(resposta.body).to.have.property('error');
  });
});
