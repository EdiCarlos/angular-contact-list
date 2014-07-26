/* globals confirm */
'use strict';

angular.module('angularContactsListApp')
  .controller('ContactsCtrl', function ($scope, $location, $routeParams, $route, $filter, AlertService, ContactsService) {

    /**
     * Initial value of form
     *
     * @type {Array}
     */
    $scope.contact = [];

    /**
     * Reset the form values
     */
    $scope.reset = function() {
      $scope.contact = [
        {
          name: '',
          address: '',
          phone: ''
        }
      ];
    };

    /**
     * Add a listContacts in $scope.listContacts
     */
    $scope.create = function(contact){
      $scope.listContacts = ContactsService.create(contact);
      AlertService.add('success', 'Contact "' + contact.name + '" created with success!', 5000);
    };

    /**
     * Editing a individual contact
     * @return {[type]}     [description]
     */
    $scope.edit = function(){
      var id = $routeParams.id;
      $scope.contact = $filter('filter')($scope.listContacts, {_id: id})[0];
      window.scrollTo(0, 0);
    };

    /**
     * Update item
     * @param  {Object} item [description]
     * @return {[type]}      [description]
     */
    $scope.update = function( item ) {
      $scope.listContacts = ContactsService.update(item);
      AlertService.add('success', 'Contact "' + item.name + '" updated with success!', 5000);
    };

    /**
     * Add/edit method abstration
     * @param  {Object} item [description]
     * @return {[type]}      [description]
     */
    $scope.save = function(item){
      if(typeof item._id !== 'undefined'){
        $scope.update(item);
      } else {
        $scope.create(item);
      }
      $scope.reset();
      $location.path('/contacts');
    };

    /**
     * [delete description]
     * @param  {Integer} index        [description]
     * @param  {Boolean} confirmation [description]
     * @return {Boolean}              [description]
     */
    $scope.delete = function( index, confirmation ){
      confirmation = (typeof confirmation !== 'undefined') ? confirmation : true;
      if (confirmDelete(confirmation)) {
        var message,
            item = ContactsService.delete(index);
        if (!!item) {
          message = 'Contact "' + item.name + '" was removed of your contact\'s list';
          AlertService.add('success', message, 5000);
          $scope.listContacts = ContactsService.getListItems();
          return true;
        }
        AlertService.add('error', 'Houston, we have a problem. This operation cannot be executed correctly.', 5000);
        return false;
      }
    };

    /**
     * Method for access "window.confirm" function
     * @param  {Boolean} confirmation [description]
     * @return {Boolean}              [description]
     */
    var confirmDelete = function(confirmation){
      return confirmation ? confirm('This action is irreversible. Do you want to delete this contact?') : true;
    };

    /**
     * Method for class initialization
     * @return {[type]} [description]
     */
    $scope.init = function(){
      $scope.listContacts = $scope.filteredData = ContactsService.getListItems();
      $scope.reset();
      //  Calling routeParam method
      if ($route.current.method !== undefined) {
        $scope[$route.current.method]();
      }
    };

    $scope.init();

  });
