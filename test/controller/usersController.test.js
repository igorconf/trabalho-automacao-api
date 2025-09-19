const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../app');
const userService = require('../../service/userService');

describe('Users Controller', () => {
  const { users } = require('../../model/userModel');
  afterEach(() => sinon.restore());

  it('Deve retornar lista de usuários usando mock do service', async () => {
    const fakeList = [{ id: 1, username: 'mock1' }, { id: 2, username: 'mock2' }];
    sinon.stub(userService, 'getAllUsers').returns(fakeList);
    await request(app)
      .post('/register')
      .send({ username: 'mock1', password: 'senha123' });
    const respostaLogin = await request(app)
      .post('/login')
      .send({ username: 'mock1', password: 'senha123' });
    const token = respostaLogin.body.token;
    const resposta = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.deep.equal(fakeList);
  });
  let token;
  beforeEach(async () => {
  users.length = 0;
    await request(app)
      .post('/register')
      .send({ username: 'igor', password: 'senha123' });
    await request(app)
      .post('/register')
      .send({ username: 'maria', password: 'senha123' });
    const respostaLogin = await request(app)
      .post('/login')
      .send({ username: 'maria', password: 'senha123' });
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
