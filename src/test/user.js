/* eslint-disable max-len */
/* eslint-disable no-undef */
const request = require('supertest');
const chai = require('chai');
const server = require('../server');
// const should = chai.should();
// const assert = chai.assert;

const expect = chai.expect;

// let user;
describe('User', () => {

  describe('Get User Data', () => {
    it('It should get logged-In User data', (done) => {
      request(server)
        .get('/api/v1/user/user-data')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(
          'Authorization',
          'Bearer ' +
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNmQ2MDMwNzE3NTYwZTAyMGNlYWZmMiIsImVtYWlsIjoiZXhhbXBsZTFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJyYXRob2QwMDciLCJpYXQiOjE2NTIyNTI3NjEsImV4cCI6MTY1MjI1OTk2MX0.B51SkC-D-qaghNQHkVR5ek6IRShX5NpMtQk0gWKVn9E'
        )
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(res.body).to.have.property('allBlog');
        })
        .end(done);
    });
  });

  describe('Update User Profile', () => {
    it('It should update user profile', (done) => {
      request(server)
        .post('/api/v1/user/update-profile')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(
          'Authorization',
          'Bearer ' +
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNmQ2MDMwNzE3NTYwZTAyMGNlYWZmMiIsImVtYWlsIjoiZXhhbXBsZTFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJyYXRob2QwMDciLCJpYXQiOjE2NTIyNTI3NjEsImV4cCI6MTY1MjI1OTk2MX0.B51SkC-D-qaghNQHkVR5ek6IRShX5NpMtQk0gWKVn9E'
        )
        .send({
          fullName: 'test',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
        })
        .end(done);
    });
  });

  describe('Add followers', () => {
    it('It should add followers', (done) => {
      request(server)
        .post('/api/v1/user/add-follower')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(
          'Authorization',
          'Bearer ' +
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNmQ2MDMwNzE3NTYwZTAyMGNlYWZmMiIsImVtYWlsIjoiZXhhbXBsZTFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJyYXRob2QwMDciLCJpYXQiOjE2NTIyNTI3NjEsImV4cCI6MTY1MjI1OTk2MX0.B51SkC-D-qaghNQHkVR5ek6IRShX5NpMtQk0gWKVn9E'
        )
        .send({
          profileId: ('61dc6a3e14ef540023201b24'),
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('followers');
        })
        .end(done);
    });
  });
});
