(function() {
    'use strict';

    angular
        .module('hackathonApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('member', {
            parent: 'entity',
            url: '/member',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'hackathonApp.member.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/member/members.html',
                    controller: 'MemberController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('member');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('member-detail', {
            parent: 'entity',
            url: '/member/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'hackathonApp.member.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/member/member-detail.html',
                    controller: 'MemberDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('member');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Member', function($stateParams, Member) {
                    return Member.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'member',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('member-detail.edit', {
            parent: 'member-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/member/member-dialog.html',
                    controller: 'MemberDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Member', function(Member) {
                            return Member.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('member.new', {
            parent: 'member',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/member/member-dialog.html',
                    controller: 'MemberDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                major: null,
                                dateBirth: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('member', null, { reload: 'member' });
                }, function() {
                    $state.go('member');
                });
            }]
        })
        .state('member.edit', {
            parent: 'member',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/member/member-dialog.html',
                    controller: 'MemberDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Member', function(Member) {
                            return Member.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('member', null, { reload: 'member' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('member.delete', {
            parent: 'member',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/member/member-delete-dialog.html',
                    controller: 'MemberDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Member', function(Member) {
                            return Member.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('member', null, { reload: 'member' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
