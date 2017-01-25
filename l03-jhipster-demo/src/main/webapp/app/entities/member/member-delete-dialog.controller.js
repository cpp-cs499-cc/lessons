(function() {
    'use strict';

    angular
        .module('hackathonApp')
        .controller('MemberDeleteController',MemberDeleteController);

    MemberDeleteController.$inject = ['$uibModalInstance', 'entity', 'Member'];

    function MemberDeleteController($uibModalInstance, entity, Member) {
        var vm = this;

        vm.member = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Member.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
