define(['services/filters/filters', 'angular-mocks'], function() {
  /* global describe, it, expect, beforeEach, afterEach, module, inject */
  'use strict';
  describe('services.filters module', function() {
    beforeEach(module('services.filters'));

    describe('percentage filter', function() {
      it('should get percentage from number', inject(function(percentageFilter) {
        expect(percentageFilter(0.59)).toEqual('59%');
      }));
    });
  });
});