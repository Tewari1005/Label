// Common directive to display pagination controls and call service function which is passed as parameter
app.directive('gridCustomPaginationDirective', [function () {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: "gridcustompagination.html",
		scope: {
			totalRecords : '=',
			getNewData : '&', // Specify a function which will be called after clicking on pagination buttons
			currentPageNumber : '=',
			paginationPageSize : '=', // Pass integer value to specify how many items to display per page
			paginationPageSizes : '=' // Pass array to display page sizes drop-down
		},
		link: function($scope, elem, attrs) {      	
			$scope.currentPageNumber = $scope.currentPageNumber && parseInt(+$scope.currentPageNumber,10) || 1;
			$scope.paginationPageSize = $scope.paginationPageSize && parseInt(+$scope.paginationPageSize,10) || 25;
			$scope.pagination = {
					pageSize: ($scope.paginationPageSize && parseInt(+$scope.paginationPageSize,10)) || 25,
					pageNumber: 1,
					totalRecords: $scope.totalRecords,
					getTotalPages: function (dataLength) {
						return Math.ceil(dataLength / this.pageSize);
					},
					nextPage: function () {
						if ($scope.currentPageNumber < this.getTotalPages($scope.totalRecords)) {
							$scope.currentPageNumber++;
							this.getUpdatedData();
							this.disableButtons();
						}
					},
					previousPage: function () {
						if ($scope.currentPageNumber > 1) {
							$scope.currentPageNumber--;
							this.getUpdatedData();
							this.disableButtons();
						}
					},
					firstPage: function () {
						$scope.currentPageNumber = 1;
						this.getUpdatedData();
						this.disableButtons();
					},
					lastPage: function () {
						$scope.currentPageNumber = this.getTotalPages($scope.totalRecords);				
						this.getUpdatedData();
						this.disableButtons();
					},
					getUpdatedData: function(){
						$scope.getNewData({currentPageNumber : $scope.currentPageNumber,paginationPageSize : this.pageSize});
					},
					disableButtons: function(){
						$scope.firstPageDisabled = false;
						$scope.prevPageDisabled = false;
						$scope.nextPageDisabled = false;
						$scope.lastPageDisabled = false;
						if($scope.currentPageNumber == 1){
							$scope.firstPageDisabled = true;
							$scope.prevPageDisabled = true;
						}
						if($scope.currentPageNumber == this.getTotalPages($scope.totalRecords)){
							$scope.nextPageDisabled = true;
							$scope.lastPageDisabled = true;
						} 
					}
			};

			//For enabling or disabling the pagination buttons
			$scope.pagination.disableButtons();
			
			$scope.validatePaginationInput = function(pageNumber){
				// Validate whether entered page number is integer
				if(pageNumber && Number(pageNumber) === pageNumber && pageNumber % 1 === 0)
					$scope.pagination.getUpdatedData(); 
			}
		}
	};
}]);

