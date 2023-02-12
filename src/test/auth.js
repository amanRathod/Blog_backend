/* eslint-disable no-unused-vars */
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const chai = require('chai');
const mocha = require('mocha');

const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const assert = chai.assert;

chai.use(chaiHttp);

describe('Authentication', () => {

  // regiser user
  describe('Register', () => {
    const user = {
      username: 'test3',
      email: 'test3@gmail.com',
      password: 'dummyUser@1',
      fullName: 'test3',
    };

    it('It should check if email already exists', (done) => {
      const user = {
        username: 'test1',
        email: 'test1@gmail.com',
        password: 'dummyUser@1',
        fullName: 'test1',
      };
      chai
        .request(server)
        .post('/api/v1/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(203);
          res.body.should.be.a('object');
          res.body.should.have.property('type');
          res.body.should.have.property('message');
          done();
        });
    });

    it('It should register new user successfully', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('type');
          res.body.should.have.property('message');
          done();
        });
    });
  });

  // login user
  describe('Login', () => {
    const user = {
      email: 'test1@gmail.com',
      password: 'dummyUser@1',
    };
    it('It should check if email or password is wrong', (done) => {
      const user = {
        email: 'test100@gmail.com',
        password: 'dummyUser@1',
      };
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('type');
          res.body.should.have.property('message');
        });
    });

    it('it should login user successfully', (done) => {

      chai
        .request(server)
        .post('/api/v1/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('type');
          res.body.should.have.property('message');
          res.body.should.have.property('token');
          done();
        });
    });
  });
});
