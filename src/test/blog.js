/* eslint-disable no-undef */
/* eslint-disable max-len */
const request = require('supertest');
const chai = require('chai');
const server = require('../server');
// const should = chai.should();
// const assert = chai.assert;

const expect = chai.expect;

describe('Blog', () => {
  describe('Create Blog', () => {
    it('It should create blog', (done) => {
      request(server)
        .post('/api/v1/blog/create')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(
          'Authorization',
          'Bearer ' +
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNmQ2MDMwNzE3NTYwZTAyMGNlYWZmMiIsImVtYWlsIjoiZXhhbXBsZTFAZ21haWwuY29tIiwidXNlcm5hbWUiOiJyYXRob2QwMDciLCJpYXQiOjE2NTIyNTI3NjEsImV4cCI6MTY1MjI1OTk2MX0.B51SkC-D-qaghNQHkVR5ek6IRShX5NpMtQk0gWKVn9E'
        )
        .send({
          title: 'test',
          content: '<p>test</p>',
          tag: [{ id: 'test', text: 'test' }],
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).to.be.an('object');
        })
        .end(done);
    });
  });

  describe('Get Blogs', () => {
    it('It should get blogs', (done) => {
      request(server)
        .get('/api/v1/blog/all-blog')
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
        })
        .end(done);
    });
  });
});
