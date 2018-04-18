angular.module("summary")
    .constant("textranksummaryUrl", "http://localhost:5800/textrank/summary")
    .constant("textranksummaryhistoryUrl", "http://localhost:5800/textrank/history")
    .controller("textrankCtrl", function($scope, $compile,$http, textranksummaryUrl, textranksummaryhistoryUrl){

        $http.get(textranksummaryhistoryUrl, { withCredentials: true })
            .then(function(data){
                
                $scope.history = data.data.data.history;
                $scope.split_document_history = [];
                $scope.split_summary_history = [];
                for(let i=0;i <$scope.history.length; i++){
                    document_text = $scope.history[i].document;
                    summary_text = $scope.history[i].summary;
                    // console.log(document_text);
                    var split_document = document_text.split(/[,，。!?]/);
                    var split_summary = summary_text.split(/[,，。!?]/);
                    $scope.split_document_history.push(split_summary);
                    $scope.split_summary_history.push(split_summary);

                    modify_document = "";
                    for (let j=0; j< split_document.length; j++){
                        if (j < split_document.length-1){
                            modify_each_sentence = "<span class=\"document" + i + "-" + j + "\" ng-mouseenter=\"documentSelect('" + i + "-" + j + "');\">" + split_document[j] + ",</span>";
                        }else{
                            modify_each_sentence = "<span class=\"document" + i + j + "\" ng-mouseenter=\"documentSelect('" + i + j + "');\">" + split_document[j] + "。</span>";
                        }
                        modify_document += modify_each_sentence;
                    }
                    

                    $scope.history[i].document = modify_document; 

                    modify_summary = "";
                    for (let j=0; j< split_summary.length; j++){
                        if (j < split_summary.length-1){
                            modify_each_sentence = "<span class=\"summary" + i + "-" + j + "\" ng-mouseenter=\"documentSelect('" + i + "-" + j + "');\">" + split_summary[j] + ",</span>";
                        }else{
                            modify_each_sentence = "<span class=\"summary" + i + j + "\">" + split_summary[j] + "。</span>";
                        }
                        modify_summary += modify_each_sentence;
                    }
                    $scope.history[i].summary = modify_summary; 
                }
                


            }).catch(function(error){
                $scope.historyError = error;
            });

        
        $scope.documentSelect = function(num){
            let historyNumber_number = num.split("-");
            let documentS = document.getElementsByClassName("document" + num);
            angular.element(documentS).addClass("hoveryellow");
            historyNumber = Number(historyNumber_number[0]);
            number = Number(historyNumber_number[1])
            let documentText = $scope.split_document_history[historyNumber][number];
            for(var j=0;j <$scope.split_summary_history[historyNumber].length; j++){
                console.log($scope.split_summary_history[historyNumber][j]);
                if($scope.split_summary_history[historyNumber][j] == documentText){
                    let summaryNumber = "summary" + historyNumber[0] + "-" + j;
                    let summaryS = document.getElementsByClassName("summary" + historyNumber_number[0] + "-" + j);
                    angular.element(summaryS).addClass("hoveryellow");
                }
            }
            console.log(j);
            
        }
        
        $scope.myalert = function(iets){
            var dit = this;
            console.log(dit);
            var par = document.getElementsByClassName("document01")
            console.log(par);
            angular.element(par).addClass("hoveryellow");
        }

        $scope.load = function(){
           $scope.$emit("dl","");
        };
        $scope.$on("dlans", function(event, msg){
            $scope.user = msg;
        });

        $scope.getSummary = function(document){
            
            $scope.user.document = document;
            $http.post(textranksummaryUrl,{
                data:{
                    data: $scope.user
                }
            },{
                withCredentials:true
            }).then(function(data){
                // TODO THINGS
            
                $scope.res = data.data.data;
                $scope.summary = data.data.data.summary;
                let record = {
                    "document": document,
                    "summary": $scope.summary
                }
                $scope.history.push(record);

            }).catch(function(error){
                $scope.textrankError = error;
            })
        }

    })