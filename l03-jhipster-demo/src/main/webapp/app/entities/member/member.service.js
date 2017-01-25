(function() {
    'use strict';
    angular
        .module('hackathonApp')
        .factory('Member', Member);

    Member.$inject = ['$resource', 'DateUtils'];

    function Member ($resource, DateUtils) {
        var resourceUrl =  'api/members/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.dateBirth = DateUtils.convertDateTimeFromServer(data.dateBirth);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
