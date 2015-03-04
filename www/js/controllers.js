angular.module('app.controllers', [])

.controller('BarsCtrl', function($scope, Bars) {
  Bars.all().then(function(bars){
    $scope.bars = bars;
  });
})

.controller('BarDetailCtrl', function($scope, $stateParams, Bars, bar) {
  $scope.Bars = Bars;
  $scope.bar = bar; //in state.resolve, required for view title
})

.controller('InviteFriendsCtrl', function($scope, ContactsService, $ionicModal, $window){
  $scope.data = {
    selectedContacts : []
  };

  $scope.pickContact = function() {
    ContactsService.pickContact().then(
      function(contact) {
        $scope.data.selectedContacts.push(contact);
        console.log("Selected contacts=");
        console.log($scope.data.selectedContacts);
      },
      function(failure) {
        //$scope.data.selectedContacts.push({phones:[{type:'work', value:'805-975-5236'}], displayName: "Contacts not available (sample user)", emails:[{type:'sample',value:'sample@user.com'}]});
        console.log("Bummer.  Failed to pick a contact");
      }
    );
  }

  $scope.sendSMS = function(contacts, bar){
    var nums = _.transform(contacts, function(m,v){
      if (v.phones[0]) m.push(v.phones[0].value);
    }, []);
    var options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: 'INTENT'  // send SMS with the native android SMS messaging
        //intent: '' // send SMS without open any other app
      }
    };
    var message = "Come to the bar with me tonight! Deets at https://flashdrink.firebaseapp.com/#/tab/bars/"+bar.id;
    console.log(message);
    $window.sms.send(nums, message, options, function(){
      console.log('message sent successfully');
      $scope.data.selectedContacts = [];
      $scope.modal.hide();
    }, function(err){
      console.log(err);
    });
  }

  // ---- MODAL ----
  $ionicModal.fromTemplateUrl('templates/invite-friends.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
})

.controller('FriendsCtrl', function($scope, Friends) {
  //$scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
  $scope.favorite = Friends.favorite;

})

.controller('AccountCtrl', function($scope, Auth) {
  $scope.user.$bindTo($scope, "fbUser");
  $scope.Auth = Auth;
})