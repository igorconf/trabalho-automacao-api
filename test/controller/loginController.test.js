const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../app');
const userService = require('../../service/userService');

describe('Login Controller', () => {
    before(async () => {
        await request(app)
            .post('/register')
            .send({ 
                username: 'igor', 
                password: 'senha123' 
            });
    });

    afterEach(() => sinon.restore());

    it('Deve fazer login usando mock do service', async () => {
        const fakeUser = { id: 1, username: 'mocklogin', password: 'senha123' };
        sinon.stub(userService, 'authenticateUser').returns(fakeUser);
        const resposta = await request(app)
            .post('/login')
                .send({ 
                    username: 'igor', 
                    password: 'senha123' 
                });
        expect(resposta.status).to.equal(200);
        expect(resposta.body).to.have.property('token');
    });

    it('Deve fazer login com sucesso', async () => {
        const resposta = await request(app)
            .post('/login')
                .send({ username: 'igor', password: 'senha123' });
        expect(resposta.status).to.equal(200);
        expect(resposta.body).to.have.property('token');
    });

    it('Deve retornar erro para credenciais inválidas', async () => {
        const resposta = await request(app)
            .post('/login')
            .send({ 
                    username: 'joao', 
                    password: 'errada' 
                });
        expect(resposta.status).to.equal(401);
        expect(resposta.body).to.have.property('error');
    });

    it('Deve retornar erro para dados incompletos', async () => {
        const resposta = await request(app)
            .post('/login')
            .send({ 
                    username: 'rayla' 
                });
        expect(resposta.status).to.equal(400);
        expect(resposta.body).to.have.property('error');
    });
});
