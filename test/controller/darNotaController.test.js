const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const app = require('../../app');
const userService = require('../../service/userService');
const { from } = require('form-data');

before(async () => {
    await request(app)
        .post('/register')
        .send({
            username: 'igor',
            password: '123456'
        });
    
        await request(app)
            .post('/register')
            .send({
            username: 'maria',
            password: '123456'
        });
    
        const respostaLogin = await request(app)
        .post('/login')
        .send({
            username: 'igor',
            password: '123456'
        });
    
    token = respostaLogin.body.token;
});

describe('Rate Controller', () => {
    describe('POST /rate', () => {
        it('Quando informo usuários registrados e nota válida eu tenho sucesso 201', async () => {
            const resposta = await request(app)
                .post('/rate')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fromUsername: 'igor',
                    toUsername: 'maria',
                    score: 5
             });
            expect(resposta.status).to.equal(201);

            const respostaEsperada = require('../fixture/respostas/quandoInformoUsuariosRegistradosENotaValidaEuTenhoSucesso201.json');
            expect(resposta.body).to.deep.equal(respostaEsperada);
        });
    });
});