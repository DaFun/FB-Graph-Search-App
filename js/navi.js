/**
 * Created by Ban on 4/3/2017.
 */
var myApp = angular.module('hello', ['ui.router']);

myApp.config(function($stateProvider) {
    // An array of state definitions
    var states = [
        { name: 'user', url: '/user', component: 'user' },
        { name: 'pages', url: '/pages', component: 'pages' },

        {
            name: 'place',
            url: '/people',
            component: 'people',
            resolve: {
                people: function(PeopleService) {
                    return PeopleService.getAllPeople();
                }
            }
        },

        {
            name: 'people.person',
            url: '/{personId}',
            component: 'person',
            resolve: {
                person: function(people, $stateParams) {
                    return people.find(function(person) {
                        return person.id === $stateParams.personId;
                    });
                }
            }
        }
    ]

    // Loop over the state definitions and register them
    states.forEach(function(state) {
        $stateProvider.state(state);
    });
});
