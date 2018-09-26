/// <reference path="../../Scripts/angular.min.js" />
/// <reference path="../../Scripts/angular-mocks.js" />

function initDirective(directiveModule, directiveTemplateName,
    directiveTemplateUrl, directiveCall, onScopeCreated, onInit) {

    var $scope, target;

    module(directiveModule);

    inject(function ($rootScope, $templateCache, $compile) {
        $scope = $rootScope.$new();

        if (onScopeCreated) onScopeCreated($scope);

        var view = $templateCache.get(directiveTemplateName);
        if (!view) {
            $.ajax({
                type: "GET",
                async: false,
                cache: false,
                url: directiveTemplateUrl
            })
            .done(function (data) {
                view = data;
            });
            $templateCache.put(directiveTemplateName, view);
        }

        target = $compile(directiveCall)($scope);
        $scope.$digest();

        if (onInit) onInit(target);
    });
}
