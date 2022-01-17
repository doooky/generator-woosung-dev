import should from 'should';
import request from 'supertest';
import server from '../../index';
import <%= model %>Service from '../service/<%= model %>';

describe('route', () => {
  describe('<%= route %>', () => {

    describe('GET <%= route %>', () => {
      test('should return a list wtesth <%= model %>s', async () => {
        expect(response.status).toEqual(200);
      });
    });

    describe('POST <%= route %>', () => {
      test('should create a <%= model %>', async () => {
        expect(response.status).toEqual(200);
      })
    });

    describe('GET <%= route %>/:id', () => {
      test('should return the correct <%= model %>', async () => {
        expect(response.status).toEqual(200);
      });
    });

    describe('PUT <%= route %>/:id', () => {
      test('should update a <%= model %>', async () => {
        expect(response.status).toEqual(200);
      });
    });

    describe('DELETE <%= route %>/:id', () => {
      test('should delete a <%= model %>', async () => {
        expect(response.status).toEqual(200);
      });
    });
  });
});
