const ctrl = 'HomeController';
angular.module('jm', []);

angular.module('jm').controller(ctrl, function ($scope) {
    const prover = require('/library/prover');

    $scope.maxDepth = 8;

    $scope.contents = `a aa
#goal a aaaaa`

    $scope.prove = () => {
        $scope.result = prover($scope.contents, $scope.maxDepth)
    }
});