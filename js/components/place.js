/**
 * Created by Ban on 4/3/2017.
 */
angular.module('hello').component('place', {
    bindings: { people: '<' },

    template: '<div class="flex-h">' +
    '  <div class="people">' +
    '    <h3>Some people:</h3>' +
    '    <ul>' +
    '      <li ng-repeat="person in $ctrl.people">' +
    '        <a ui-sref-active="active" ui-sref="people.person({ personId: person.id })">' +
    '          {{person.name}}' +
    '        </a>' +
    '      </li>' +
    '    </ul>' +
    '  </div>' +
    '  <ui-view></ui-view>' +
    '</div>'
});