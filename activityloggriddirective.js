app.directive("activityloggrid", function(){
	return {
		restrict: 'E',
		replace: false,
		scope : {
			gridData: "="
		},
		link: function($scope,ele, attr) {},
		controller: ('Controller', ['$scope','$sce', function($scope,$sce) {		
			$scope.$watch('gridData', function(gridData){
				if(gridData && gridData.length > 0){
					$scope.gridOptions.api.setRowData(gridData);
					$scope.gridOptions.api.refreshView();
		            $scope.gridOptions.api.ensureIndexVisible(0); // Scroll to top
				}
		    });
			$scope.gridOptions = {								
						    enableSorting: true,						    
							columnDefs : [
												{
													field : "activityTimeStamp", 
													headerName : "Date | Time",						   					
													enableSorting: true,		
									            	width : 130, 
									            	sortingOrder: ['asc','desc'],
												},
												{ field : "activityId.name",
													headerName : "Action", 
													enableSorting : false, 
													suppressSorting	: true,
													sortingOrder: ['asc','desc'],
									            	  cellRenderer : activityNameRenderer, 
									            	  width : 910
									            },
												{field : "initiator", headerName : "By", enableSorting : false,
									            	  width : 170, 
									            	  cellClass: 'gridTemplateCustomField giftcard_order',		
									            	  suppressSorting	: true,
									            	  sortingOrder: ['asc','desc'],
									            	  cellRenderer : initiatorRenderer
									              }, {field : "source", 
									            	  headerName : "Source", 
									            	  sortingOrder: ['asc','desc'],
									            	  enableSorting : false,
									            	  suppressSorting	: true,
									            	  width : 130, 
									              }
							              ],
							              getRowHeight: function(params) {
							                  return 27 + (12 * (Math.floor((params.data.activityId.name.length + ($sce.getTrustedHtml(params.data.note) ? $sce.getTrustedHtml(params.data.note).length : 0) + (params.data.standingOrderId ? params.data.standingOrderId.length : 0) + (params.data.saleId ? params.data.saleId.length : 0)) / 145) + 1));
							              },
							              rowData : $scope.gridData,
							              angularCompileRows: true,
							              onSortChanged:notifySortChange,
							              onGridReady:function(){							            	
							            	adjustColumns(); // To adjust all column widths as per screen size					            	
							              }
			};
			function notifySortChange(){
				var sortModel = $scope.gridOptions.api.getSortModel();				
				if(sortModel && sortModel.length > 0){
					var sortBy;
					switch(sortModel[0].colId){
						case "activityTimeStamp":
							sortBy = "date";
						break;
						case "activityId.name":
							sortBy = "action";
							break;
						case "initiator":
							sortBy = "initiator";
							break;
						case "source":
							sortBy = "source";
							break;
					}
					$scope.$parent.sortChanged(1,sortBy,sortModel[0].sort.toUpperCase());
				}
					
			}
			
			function activityNameRenderer(params){
				 var activityNameHtml = '<div class="gridTemplateCustomField">'+
					 '<strong>'+params.value+'</strong> - ';
				 if(!params.data.note){
					 activityNameHtml+= '<span>'+params.value+'</span>';				      				  
			     }
				 if(params.data.note){
					 var note =$sce.getTrustedHtml(params.data.note);// $sce.trustAsHtml(params.data.note);				
					if(note) activityNameHtml+= '<span>'+note+'</span>'; 
				 }
				 if(params.data.saleId){
					 activityNameHtml+= '(Order #:'+params.data.saleId+')';				      				  
			     }
				 if(params.data.standingOrderId){
					 activityNameHtml+= '(Standing Order #: '+params.data.standingOrderId+')';				      				      
				 }
				 activityNameHtml+= '</div>';				
			      var domElement = document.createElement("div");
	              domElement.innerHTML = activityNameHtml;
			      return domElement;
			}
			function initiatorRenderer(params){
      		  var initiatorString = (params.data.masqueradeAgent ? (params.data.masqueradeAgent + ' as ') : '') + params.value;								            		 					            			  
      		  var domElement = document.createElement("div");
      		  domElement.innerHTML = initiatorString;
      		  return domElement; 									            		  
      	    }			
			function adjustColumns(resize) {
				var documentWidth = Math.max(
						document.documentElement["clientWidth"],
						document.body["scrollWidth"],
						document.documentElement["scrollWidth"],
						document.body["offsetWidth"],
						document.documentElement["offsetWidth"]
				);
				if(resize || (documentWidth < 1340)){
					setTimeout(function(){
						$scope.gridOptions.api.sizeColumnsToFit();
					},500);					
				}					
			}		 
			$scope.height = 700;
			/*$scope.height = Utilities.setGridHeight(".crm_header_menu",".crm_footer_container",".activity_header.pos_relate",".activity-pg-container","32");
         	$(window).resize(function(){ 
     			$scope.height = "";
                $scope.$apply(function(){                         
                   $scope.height = Utilities.setGridHeight(".crm_header_menu",".crm_footer_container",".activity_header.pos_relate",".activity-pg-container","32");
                });
                adjustColumns(true);
            });*/

		}]),
		template: 
			'<div>' +
			'<div ag-grid="gridOptions" class="crm-activity-log-ag-grid crm-activity-log-grid ag-fresh  " ng-style="{\'height\': height+\'px\'}" style="height:{{height}}px" ng-attr-style="height:{{height}}px"></div>' +
			'</div>'
	}
})