const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../app');
const userService = require('../../service/userService');

describe('Rate Controller', () => {
  const { users } = require('../../model/userModel');
  afterEach(() => sinon.restore());

  it('Deve dar nota usando mock do service', async () => {
    await request(app)
      .post('/register')
      .send({ 
        username: 'mockrate', 
        password: 'senha123' 
      });
      await request(app)
        .post('/register')
        .send({ username: 'maria', password: 'senha123' });
    const respostaLogin = await request(app)
      .post('/login')
      .send({ username: 'mockrate', password: 'senha123' });
    const token = respostaLogin.body.token;
    const fakeResult = { fromUsername: 'igor', toUsername: 'maria', score: 10 };
    sinon.stub(userService, 'rateUser').returns(fakeResult);
    const resposta = await request(app)
      .post('/rate')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        fromUsername: 'igor', 
        toUsername: 'maria', 
        score: 10 
      });
    expect(resposta.status).to.equal(201);
    expect(resposta.body).to.deep.equal(fakeResult);
  });
  let token;
  beforeEach(async () => {
  users.length = 0;
    await request(app)
      .post('/register')
      .send({ username: 'igor', password: '123456' });
    await request(app)
      .post('/register')
      .send({ username: 'maria', password: '123456' });
    const respostaLogin = await request(app)
      .post('/login')
      .send({ username: 'igor', password: '123456' });
    token = respostaLogin.body.token;
  });

  it('Deve dar nota com sucesso', async () => {
    const resposta = await request(app)
      .post('/rate')
      .set('Authorization', `Bearer ${token}`)
        .send({ fromUsername: 'igor', toUsername: 'maria', score: 5 });
    expect(resposta.status).to.equal(201);
      expect(resposta.body).to.have.property('fromUsername', 'igor');
      expect(resposta.body).to.have.property('toUsername', 'maria');
    expect(resposta.body).to.have.property('score', 5);
  });

  it('Deve retornar erro se usuário não existe', async () => {
    const resposta = await request(app)
      .post('/rate')
      .set('Authorization', `Bearer ${token}`)
        .send({ fromUsername: 'igor', toUsername: 'rayla', score: 5 });
    expect(resposta.status).to.equal(404);
    expect(resposta.body).to.have.property('error');
  });

  it('Deve retornar erro se faltar dados', async () => {
    const resposta = await request(app)
      .post('/rate')
      .set('Authorization', `Bearer ${token}`)
        .send({ toUsername: 'maria' });
    expect(resposta.status).to.equal(400);
    expect(resposta.body).to.have.property('error');
  });

  it('Deve retornar erro se não enviar token', async () => {
    const resposta = await request(app)
        .post('/rate')
        .send({ fromUsername: 'igor', toUsername: 'maria', score: 5 });
    expect(resposta.status).to.equal(401);
    expect(resposta.body).to.have.property('error');
  });
});
