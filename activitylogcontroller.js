agGrid.initialiseAgGridWithAngular1(angular);
var app = angular.module('ActivityLogModule', ["agGrid",'ngSanitize'])
app.controller('ActivityLogController',['$scope','$http',
                                     function($scope,$http){

	$scope.activityLog = {};			
	var prevLogData = '';
	var toLogData = '';
	$scope.paginationPageSizes = [25,50,100];
	$scope.pagesArray = [];
	$scope.currentPageNumber = 1;
	$scope.customerId = '';
	$scope.getLogDetails = function(pageNumber,sortBy,orderBy,activityLog,paginationPageSize){	
		var json = {};
		json.customerId = $scope.customerId;
		if(pageNumber == undefined)
			pageNumber = "1";
		if(sortBy == undefined)
			sortBy = "date";
		if(orderBy == undefined)
			orderBy = "DESC";

		$scope.sortBy = sortBy;
		$scope.orderBy = orderBy;

		if(activityLog) {
			if(activityLog.fromDate)
				json.fromDate = activityLog.fromDate;

			if(activityLog.toDate)
				json.toDate = activityLog.toDate;

			if(activityLog.action)
				json.activityId = activityLog.action;

			if(activityLog.by)
				json.initiator = activityLog.by;

			if(activityLog.source)
				json.source = activityLog.source;
		}else if($scope.activityLog) {
			if($scope.activityLog.deliveryFromDate)
				json.fromDate = $scope.activityLog.deliveryFromDate;

			if($scope.activityLog.deliverytoDate)
				json.toDate = $scope.activityLog.deliverytoDate;

			if($scope.activityLog.action)
				json.activityId = $scope.activityLog.action;

			if($scope.activityLog.by)
				json.initiator = $scope.activityLog.by;

			if($scope.activityLog.source)
				json.source = $scope.activityLog.source;
		}

		json.pageNo = pageNumber;
		json.sortBy = sortBy;
		json.orderBy = orderBy;
		json.pageSize = paginationPageSize || "25";
		console.log(json);
		$http.get('activitylog.json').then(function success(response) {
			$scope.activitylist = response;
			if(response.data == undefined || response.data.length == 0 || response.data.count == 0) {
				$scope.isActivityListFound = true;
				$scope.activitylist = {
						data:{}
				}
				$scope.activitylist.data.activityLogDetailsModelList = [];
			}else{
				$scope.isActivityListFound = false;
				$scope.count = response.data.count;
				$scope.numberOfPages = Math.ceil($scope.count/25);
				$scope.pagesArray = [];
				var pageStart = 1;
				var pageEnd;
				if((pageNumber-5)>0){
					pageStart = pageNumber-5;
					pageEnd = (pageStart + 9) < $scope.numberOfPages ? (pageStart + 9) : $scope.numberOfPages;
					if(pageEnd == $scope.numberOfPages){
						pageStart = ($scope.numberOfPages - 10) > 0 ? ($scope.numberOfPages - 10) : 1;
					}
				}
				else{
					pageStart = 1;
					pageEnd = $scope.numberOfPages < 10 ? $scope.numberOfPages : 10;
				}
				for(var pageIndex = pageStart;pageIndex<=pageEnd;pageIndex++){
					$scope.pagesArray.push(pageIndex);
				}
			}
			$scope.activityLog.currentPageNumber = ((pageNumber == 1) ? 1 : undefined);
		});
		$scope.currentPageNumber = pageNumber;
	}	

	$scope.initActivityLog = function(pageNumber, sortBy, orderBy){			
		$scope.getLogDetails(pageNumber, sortBy, orderBy);		
	}

	$scope.sortChanged = function(pageNumber, sortBy, orderBy){
		$scope.orderBy = orderBy;
		$scope.sortBy = sortBy;
		$scope.getLogDetails(pageNumber, sortBy, orderBy);
	}
	$scope.jumpToPage = function(pageNumber,paginationPageSize){
		$scope.getLogDetails(pageNumber, $scope.sortBy, $scope.orderBy,null,paginationPageSize);
	}
	$scope.filter = function(activityLog) {
		pageNumber = "1";
		sortBy = $scope.sortBy;
		orderBy = $scope.orderBy;
		var activityLogDetails = {};
		activityLogDetails.currentPageNumber = 1;

		if(activityLog.deliveryFromDate){				
			activityLogDetails.fromDate = activityLog.deliveryFromDate;
			activityLogDetails.fromDate.setHours(0, -activityLogDetails.fromDate.getTimezoneOffset(), 0, 0); 
			activityLogDetails.fromDate = activityLogDetails.fromDate.toISOString();
			prevLogData = activityLogDetails.fromDate;
		}else if(activityLog.deliveryFromDate == null){}
		else {
			if(prevLogData != '')
				activityLogDetails.fromDate = prevLogData;
		}
		if(activityLog.deliverytoDate) {
			activityLogDetails.toDate = activityLog.deliverytoDate;
			activityLogDetails.toDate.setHours(0, -activityLogDetails.toDate.getTimezoneOffset(), 0, 0); 
			activityLogDetails.toDate = activityLogDetails.toDate.toISOString();
			toLogData = activityLogDetails.toDate;
		}else if(activityLog.deliverytoDate == null){}
		else {
			if(toLogData != '')
				activityLogDetails.toDate = toLogData;
		}
		if(activityLog.action)
			activityLogDetails.action = activityLog.action;

		if(activityLog.by)
			activityLogDetails.by = activityLog.by;

		if(activityLog.source)
			activityLogDetails.source = activityLog.source;

		$scope.getLogDetails(pageNumber,sortBy,orderBy,activityLogDetails);
	}

	$scope.checkNullValues = function() {
		return function(item) {
			if(item != null)
				return true
		}
	}
}]);