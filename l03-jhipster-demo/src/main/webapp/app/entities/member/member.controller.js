(function() {
    'use strict';

    angular
        .module('hackathonApp')
        .controller('MemberController', MemberController);

    MemberController.$inject = ['$scope', '$state', 'Member'];

    function MemberController ($scope, $state, Member) {
        var vm = this;

        vm.members = [];

        loadAll();

        function loadAll() {
            Member.query(function(result) {
                vm.members = result;
                vm.searchQuery = null;
            });
        }
    }
})();
