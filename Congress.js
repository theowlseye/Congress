(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
   
	var Member_Col = [
	     { id : "id", alias : "id", dataType : tableau.dataTypeEnum.string },
	     { id : "chamber", alias : "chamber", dataType : tableau.dataTypeEnum.string },
		 { id : "state", alias : "state", dataType : tableau.dataTypeEnum.string },
		 { id : "district", alias : "district", dataType : tableau.dataTypeEnum.string },
	     { id : "first_name", alias : "first_name", dataType : tableau.dataTypeEnum.string },
		 { id : "last_name", alias : "last_name", dataType : tableau.dataTypeEnum.string },
         { id : "party", alias : "party", dataType : tableau.dataTypeEnum.string }];
	
	var Member_tableInfo_Member = {
        id : "Member",
        alias : "Member",
        columns : Member_Col
    };
    
	var Vote_Col=[
	     { id : "id", alias : "id", dataType : tableau.dataTypeEnum.string },
		 { id : "congress", alias : "congress", dataType : tableau.dataTypeEnum.string},
		 { id : "session", alias : "session", dataType : tableau.dataTypeEnum.string},
  	     { id : "chamber", alias : "chamber", dataType : tableau.dataTypeEnum.string },
		 { id : "roll_call", alias : "roll_call", dataType : tableau.dataTypeEnum.string},
		 { id : "description", alias : "description", dataType : tableau.dataTypeEnum.string},
		 { id : "member_id", alias : "member_id", dataType : tableau.dataTypeEnum.string },
		 { id : "vote_position", alias : "vote_position", dataType : tableau.dataTypeEnum.string }];
		 
	var Vote_tableInfo = {
        id : "Vote",
        alias : "Vote",
        columns : Vote_Col
    };	 
	
	
	schemaCallback([Member_tableInfo_Member,Vote_tableInfo]);
    };
    $.ajaxSetup({
     headers : {
       
       'X-API-KEY' : 'xRpBvViAHZ5OQ7jQek9EV1F9TLfMEop14ujNWfZa'
      }
});
    myConnector.getData = function(table, doneCallback) {
		var apiCall ="";
		if(table.tableInfo.id=="Member"){
			apiCall="https://api.propublica.org/congress/v1/110/house/members.json";
		}
		else if(table.tableInfo.id=="Vote"){
			//American Health care act
			//apiCall="https://api.propublica.org/congress/v1/115/house/sessions/1/votes/256.json";
			//TARP
			//apiCall="https://api.propublica.org/congress/v1/110/house/sessions/2/votes/680.json";
			//test
			apiCall="https://api.propublica.org/congress/v1/115/senate/sessions/1/votes/17.json";
			
		}
    $.getJSON(apiCall, function(resp) {
		
		if(table.tableInfo.id=="Member")
		{
                     var feat = resp.results[0].members;
	             var featChamber=resp.results[0].chamber;
	             var tableData = [];
	             var singleDistricts = ["MT","ND","SD","WY","AK","VT","DE"];
            
                     // Iterate over the JSON object
                     for (var i = 0 ; i < feat.length; i++) {
                      //Check to see if its a state with a single District
                      for(var j=0; j<singleDistricts.length;j++)
		      {		 
                          if(feat[i].state==singleDistricts[j])
   		          {
	  	            feat[i].district="0";
		          }			 
		      }
		  
		       tableData.push({ 
		       "id":feat[i].id,	  
                       "chamber": featChamber,
		       "state": feat[i].state,
		       "district": feat[i].district,
		       "first_name": feat[i].first_name,
		       "last_name": feat[i].last_name,
		       "party": feat[i].party
                       });
		      }
		}
		else if(table.tableInfo.id=="Vote")
		{
			var myVote = resp.results.votes.vote;
			
			var myPositions= resp.results.votes.vote.positions;
                        var tableData = [];
			
			for (var k = 0 ; k < myPositions.length ; k++) {
			tableData.push({
			 	 "id":myPositions[k].member_id,	
		                 "congress":"congress",
				 "session":"2",	
                 "chamber": myVote.chamber,
		         "roll_call": "34",
		         "description":"Who knows",
				 "member_id": myPositions[k].member_id,
				 "vote_position": myPositions[k].vote_position
                });
			}
		}
			
        table.appendRows(tableData);
        doneCallback();
    });
};

    tableau.registerConnector(myConnector);
    $(document).ready(function () {
        $("#submitButton").click(function () {
          tableau.connectionName = "Congress Feed";
          tableau.submit();
       });
});
})();
