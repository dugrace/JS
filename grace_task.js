/*You will be working on an application that Organizes and Displays information about an Event/Conference. You will retrieve data from a json API.

Given a url: https://registration.gputechconf.com/cubehenge/json.php/GTC.MobileGuestServices.getSessions/GTC%202015/true

Which returns json in the following format:

[
  {
    "id": "S0001",
    "lsoUID": "1",
    "description": "Our presentation this year will provide an update on the...",
    "length": "25",
    "level": "1",
    "pdfUrl": "http://on-demand.gputechconf.com/gtc/2015/presentation/my-preso.pdf",
    "title": "Big Data in Real Time: An Approach to Predictive Analytics for...",
    "sessionTopic1": "16",
    "sessionTopic2": "103",
    "sessionTopic3": "2",
    "sessionTopic4": "",
    "sessionTopic5": "",
    "type": "1",
    "videoUrl": "http://on-demand.gputechconf.com/gtc/2015/video/S0001.html",
    "speakerInfo": [
      {
        "name": "John Doe",
        "organization": "Doeboys Inc.",
        "email": "jdoe@email.com",
        "jobTitle": "Chief Baking Officer"
      },
      {
        "name": "Jane Doe",
        "organization": "MJ & Associates.",
        "email": "jane.doe@mj-associates.com",
        "jobTitle": "Consultant"
      }
    ]
  },
  ...
  {
    ...
  }
]
Using Node.js, please complete the following tasks:

Task 1 (Speaker Information):

Choose a data structure for the speakers. Organize the session data so that each speaker only appears once. The speaker should maintain all of its properties. The speaker should have an additional property to store the sessions the speaker has presented at.

Print the information in the following format:

John Doe has spoken at 1 session(s).
Jane Doe has spoken at 2 session(s).
...
Task 2 (Organization Information):

Choose a data structure for the organizations. Organize the speaker data from the previous task so that each organization only appears once. The organization should contain speakers which should maintain all of their properties. The organization should also contain sessions which should hold all of the sessions ID's in which speakers from the organization have spoken at.

Print the information in the following format:

NVIDIA had 2 employee(s) that spoke at 1 session(s).
...
Task 3 (Node backend & Angular SPA):

Using the session url create a Node.js backend to fetch the data and an Angular.js app to display.

Task 4 (JSON to CSV):

Write the data json data to a csv file. You can remove the speakers from the output.
*/

var request = require('request');
var jsonfile = require('jsonfile');
var fs = require('fs');
var url = 'http://registration.gputechconf.com/cubehenge/json.php/GTC.MobileGuestServices.getSessions/GTC%202015/true';

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var conf = JSON.parse(body);
    /////task1:speaker information
	var xx=[]; ids=[];
    for (i=0;i<conf.length;i++){ 
        for (j=0;j< conf[i].speakerInfo.length;j++){
           if (conf[i].speakerInfo[j].name.length<20)
		   xx.push([conf[i].speakerInfo[j].name,conf[i].speakerInfo[j].organization,conf[i].speakerInfo[j].email,conf[i].speakerInfo[j].jobTitle,conf[i].id]);
     }}
    var tt={};
   for (var i=0;i<xx.length;i++){
    if (!tt[xx[i][0]]) tt[xx[i][0]]=[xx[i][4]];
        else {
            tt[xx[i][0]].push(xx[i][4]);
              }
     }
	var spr=[];
	var had=[];
	for (var i=0;i<xx.length;i++){
      if (tt[xx[i][0]].length==1) {
       spr.push([xx[i][0],xx[i][1],xx[i][2],xx[i][3],tt[xx[i][0]]]);
       }
    else {
        if (had.indexOf(xx[i][0])==-1){
           had.push(xx[i][0]);    
             spr.push([xx[i][0],xx[i][1],xx[i][2],xx[i][3],tt[xx[i][0]]]);
	       }
        }
    }
    //convert to json object and save 
	var sprobj=[];
	for (var i=0;i<spr.length;i++){
      sprobj[i]={"name":spr[i][0],"organization":spr[i][1],"email":spr[i][2],"jobTitle":spr[i][3],"sessionIds":spr[i][4]};
	  console.log(sprobj[i].name+" has spoken at "+sprobj[i].sessionIds.length+" session(s).");
	}
    var file = 'speakers.json'
    jsonfile.writeFile(file, sprobj, function (err) {
    if (err) console.error(err)
   })
   
	////task2: organization information
	had={};
    var sids={};
   for (i=0;i<spr.length;i++){
    if (!had[spr[i][1]]) {
   	  had[spr[i][1]]=[spr[i]];
      sids[spr[i][1]]=spr[i][4];
    }
    else {
       had[spr[i][1]].push(spr[i]);
       //  avoid duplicated sessions 
		 for (i2=0;i2<spr[i][4].length;i2++){
           flag=0;
             for(j2=0;j2<sids[spr[i][1]].length;j2++){
              if (sids[spr[i][1]][j2]==spr[i][4][i2]) flag=1;
            }
           if (flag==0)
           sids[spr[i][1]].push(spr[i][4][i2]);
        } 
    }
   }
   var org=[];
   var orgobj=[];
   var i=0;
	for ( var k in had){
	orgobj[i]={"name":k,"speakers":had[k],"sessionIds":sids[k]};
	console.log(orgobj[i].name+" has "+orgobj[i].speakers.length+" speaker at "+orgobj[i].sessionIds.length+" session(s)");
	i=i+1;
	}
    var file_org = 'orgs.json';
    jsonfile.writeFile(file_org, orgobj, function (err) {
	if (err)    console.error(err);
   })
	/////////////task4:write json data to csv file.
	var csv = '';
      for (var i = 0; i < conf.length; i++) {
       var line = '';
         for (var index in conf[i]) {
	      if (index != "speakerInfo"){
             if (line != '') line += ','
              line += conf[i][index];
               }
            }
           csv += line + '\r\n';
      }
	console.log(csv);
   fs.writeFile("conf.csv", csv, function(err) {
     if(err)  console.log(err);
   }); 

	//
  } else {
    console.log("Got an error: ", error, ", status code: ", response.statusCode);
  }
});
