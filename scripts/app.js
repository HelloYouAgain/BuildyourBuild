
    angular.module('BuildyourBuild', ['br.fullpage']);

    angular.module('BuildyourBuild').controller('MainCtrl', function ($scope, Svc){
        
        
        $scope.started = false;
        $scope.start = function(){
            $scope.started = true;
        }
        
        $scope.editing = false;
        $scope.editTitle = function(){
            $scope.editing = !$scope.editing;
        }
        
        $scope.go = function(url){
            Svc.getJson(url);
        }
        
        $scope.saveTextAsFile = function(){
            var str = JSON.stringify($scope.json)
            var filename = $scope.json.title.replace(/'/g, "");
            var textToWrite = str;
            var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
            var fileNameToSaveAs = filename.replace(/ /g, "")+'.json';

            var downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";
            if (window.webkitURL != null)
            {
                // Chrome allows the link to be clicked
                // without actually adding it to the DOM.
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            }
            else
            {
                // Firefox requires the link to be added to the DOM
                // before it can be clicked.
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.onclick = destroyClickedElement;
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }

            downloadLink.click();
        }

        function destroyClickedElement(event)
        {
            document.body.removeChild(event.target);
        }
        
        //Modificar json?
        $scope.json = {};
        
          $scope.$on('json-finished', function(){
            $scope.$apply(function(){$scope.json=Svc.finalResult; $scope.champName=Svc.result.champion;});
          });
    });

    