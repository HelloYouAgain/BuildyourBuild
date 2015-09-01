
    angular.module('BuildyourBuild', ['br.fullpage','ui.bootstrap']);

    angular.module('BuildyourBuild').controller('MainCtrl', function ($scope, $timeout, Svc){
        
        $scope.pageloaded = false;
        $timeout(function() { $scope.pageloaded = true; }, 500);
        
        $scope.json = {};
        $scope.started = false;
        $scope.editing = false;
        $scope.wrongurl= false;
        $scope.alertmsg="";
        $scope.dataloaded = true;
        
        $scope.start = function(){
            $scope.started = true;
        }
        
        $scope.editTitle = function(){
            $scope.editing = !$scope.editing;
        }
        
        $scope.validate = function(url){
            var validated=false;
            if( url && url.indexOf("www.lolking.net/guides/")>-1){
                if((url.indexOf("http://")>-1 && url.substring(0, 30) == "http://www.lolking.net/guides/") 
                || (url.indexOf("https://")>-1 && url.substring(0, 31) == "https://www.lolking.net/guides/")){
                    validated=true;
                }
                else if(url.substring(0, 23) == "www.lolking.net/guides/"){
                    url="http://"+url;
                    validated=true;
                }
            }
            if(validated){
                $scope.dataloaded = false;
                $scope.wrongurl=false;
                Svc.getData(url);
                $scope.validationhref="page3";
            }
            else{
                $scope.wrongurl=true;
                $scope.alertmsg="URL not valid (URL example: www.lolking.net/guides/355215)"; 
                $scope.validationhref="";
            }
        }
        
        /*
            --- File download ---
        */        
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
        
        /*
            --- Events ---
        */
        $scope.$on('404-error', function(){
            $scope.wrongurl=true;
            $scope.alertmsg="Page not found - URL not valid (URL example: www.lolking.net/guides/355215)"; 
            $scope.dataloaded = true;
        });
        
        $scope.$on('json-finished', function(){
            $scope.$apply(function(){$scope.json=Svc.finalResult; $scope.champName=Svc.result.champion; $scope.dataloaded = true;});
        });
    });

    