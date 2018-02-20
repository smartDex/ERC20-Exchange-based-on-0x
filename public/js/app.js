var routerApp = angular.module('myApp', [
    'ui.router'
]);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
    // HOME STATES AND NESTED VIEWS ========================================
        .state('/', { url: '/', templateUrl: 'home.html' })
        // EXCHANGE STATES AND NESTED VIEWS ========================================
        .state('market', { url: '/market', templateUrl: 'exchange.html' });
});