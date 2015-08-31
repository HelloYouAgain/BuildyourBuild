angular.module('BuildyourBuild').factory('Svc', function ($rootScope, $http) {
  
    var objFactory={};
    
    //--- PRIVATE ---
  
    var item={
        id: '',
        count: 1
    }

    var block={
        type: '',
        recMath: 'false',
        minSummonerLevel: -1,
        maxSummonerLevel: -1,
        showIfSummonerSpell: '',
        hideIfSummonerSpell: '',
        items:[]
    }
  
    var index = 0;
    var subString = '';

    var getChampionName = function (data) {
        index=data.search('<div id="toc-champion-header">');
        subString=data.substring(index+30,index+500);
        index=subString.search('>');
        subString=subString.substring(index+1,index+500);
        objFactory.result.champion=subString.substring(0,subString.search('<')).trim();
    }

    var getAuthor = function (data) {
        index=data.search('<div class="summoner-name">');
        subString=data.substring(index+27,index+500);
        objFactory.result.author=subString.substring(0,subString.search('</div>'));
    }

    var getItems = function (data) {
        //Auxiliary structures
        var itemsPerSubcategory={
            name: '',
            items:[]
        };
        var itemsPerCategory={
            name: '',
            subcategories:[]
        };
    
        //Variables
        var stage=0;
        var s='';
    
        while(stage<3){
            stage++;
            if(stage==1){
                s='<h4>Core Items</h4>';
                subString=data.substring(data.search('<h4>Starting Items</h4>')+23,data.length);
                itemsPerCategory.name='Starting Items';
            }
            else if(stage==2){
                s='<h4>Situational Items</h4>';
                subString=data.substring(data.search('<h4>Core Items</h4>')+19,data.length);
                itemsPerCategory.name='Core Items';
            }
            else{
                s='</ul>';
                subString=data.substring(data.search('<h4>Situational Items</h4>')+26,data.length);
                itemsPerCategory.name='Situational Items';
            }
      
            while(subString.search('<a href=\"/items/')!=-1 && subString.search('<a href=\"/items/')<subString.search(s)){

                while(subString.search('<a href=\"/items/')!=-1 && subString.search('<a href=\"/items/')<subString.search('</ul>')){
                    index=subString.search('<a href=\"/items/');
                    itemsPerSubcategory.items.push(subString.substring(index+16,index+20));
                    subString=subString.substring(index+16,subString.length);
                }
        
                index=subString.search('</span>');
                itemsPerSubcategory.name=subString.substring(subString.search('<span>')+6,index);
                subString=subString.substring(index,subString.length);
                itemsPerCategory.subcategories.push(angular.copy(itemsPerSubcategory));
                itemsPerSubcategory.items=[];
            }
      
            objFactory.result.items.push(angular.copy(itemsPerCategory));
            itemsPerCategory.subcategories=[];
        }
    }


  
    var structureJson = function () {
        objFactory.finalResult.title=objFactory.result.author.replace('&#039;','\'')+'\'s Guide on Lolking';
        for (x in objFactory.result.items){
            for (y in objFactory.result.items[x].subcategories){
                block.type=objFactory.result.items[x].name.replace('&#039;','\'')+' - '+objFactory.result.items[x].subcategories[y].name.replace('&#039;','\'');
                for (i in objFactory.result.items[x].subcategories[y].items){
                    item.id=objFactory.result.items[x].subcategories[y].items[i];
                    block.items.push(angular.copy(item));
                }
                objFactory.finalResult.blocks.push(angular.copy(block));
                block.items=[];
            }
        }
    }

    var processData = function (data) {    
        getChampionName(data);
        getAuthor(data);
        getItems(data);
        structureJson();

        $rootScope.$broadcast('json-finished');
    }
    
    
    //--- PUBLIC ---
  
    //Final processed object
    objFactory.result={
        champion:'',
        author:'',
        items:[]
    };

    objFactory.finalResult={
        title: '',
        type: 'custom',
        map: 'SR',
        mode: 'any',
        priority: 'true',
        sortrank: '0',
        blocks:[]
    };
  
  objFactory.getJson = function (url) {
      $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', function(data){
          if(data.status.http_code == 404){
              $rootScope.$broadcast('404-error');
          }
          else{
              processData(data.contents);
          }

      }).fail(function() {
        $.getJSON('http://anyorigin.com/dev/get?url=' + encodeURIComponent(url) + '&callback=?', function(data){
          if(data.contents.indexOf("<title>Page Not Found - LolKing</title>") == 404){
              $rootScope.$broadcast('404-error');
          }
          else{
              processData(data.contents);
          }
        }).fail(function() {
            alert('fail')
        });
      });
  }
  
  return objFactory;
    
});