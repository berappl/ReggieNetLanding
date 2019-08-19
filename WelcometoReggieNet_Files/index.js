//Start Status Page JS//
//Format date//
function formatDate(dateString) {
	var d = new Date(dateString);
	var options = {
		month: 'short',
		day: 'numeric',
		hour12: true,
		hour: 'numeric',
		minute: 'numeric'
	};
	return d.toLocaleDateString('en-US', options);
}

//Choose system//
var switchSystem
if (window.location.toString().indexOf('reggienet') >= 0){switchSystem="ReggieNet";}
else {}

//Pull StatusPage API//
function setupStatusPage() {
	var sp = new StatusPage.page({
		page: 'lv92pqt38dpy'
	});
	var printIncidentSummary = function (result) {
		console.log("Incident summary object: ", result);
		if (result.error != null) {
			console.log("Error: ", result.error);
		}
		//Check components where the incident the name of the component is 'System name' and get the component status//
		if (result.components != null) {
			result.components.forEach(function (c) {
				if (c.name == switchSystem) { 
					if (c.status == 'operational') { document.getElementById("statusPageComponent").innerHTML 
					+= ('<span class="statusBarGreen">' + c.name + ' is operational<span class="visuallyhidden">Operational</span><span class="operational"></span></span>'); }	
				}
			});	
		}
		//Check incidents where the incident status IS NOT resolved AND the name of the component is 'System name' and the component IS NOT operational//
		if (result.incidents != null) {
			result.incidents.forEach(function (i) {
				if (i.status != "resolved") {
					i.components.forEach(function (item) {
						if (item.name.indexOf(switchSystem) != -1 && item.status == "degraded_performance") { 
							document.getElementById("statusPageIncidents").innerHTML += '<span class="statusBarRed" role="alert">' 
							+ "<a href='" + i.shortlink + "' target='blank'>" + i.name 
							+ '</a><span class="visuallyhidden">Degraded Performance</span><span class="degraded_performance"></span></span>'; 
						}
						if (item.name.indexOf(switchSystem) != -1 && item.status == "partial_outage") { 
							document.getElementById("statusPageIncidents").innerHTML += '<span class="statusBarRed" role="alert">' 
							+ "<a href='" + i.shortlink + "' target='blank'>" + i.name 
							+ '</a><span class="visuallyhidden">Partial Outage</span><span class="partial_outage"></span></span>'; 
						}
						if (item.name.indexOf(switchSystem) != -1 && item.status == "major_outage") { 
							document.getElementById("statusPageIncidents").innerHTML += '<span class="statusBarRed" role="alert">' 
							+ "<a href='" + i.shortlink + "' target='blank'>" + i.name 
							+ '</a><span class="visuallyhidden">Major Outage</span><span class="major_outage"></span></span>'; 
						}
						//Show LDAP login and hide CentralLogin if incident status is not resolved AND Central Login is in the title AND the item status is not operational//
						if (i.name.toUpperCase().includes("CENTRAL LOGIN") && item.status != "operational") {
							document.getElementById("ldap-login").style.display = "block"; document.getElementById("central-login").style.display = "none";
						}
					})
				}
			});
		}
		//Check scheduled maintenance where the scheduled maintenance status IS NOT completed AND the name of the component is 'System name'//
		if (result.scheduled_maintenances != null) {
			result.scheduled_maintenances.forEach(function (sm) {
				if (sm.status != "completed") {
					sm.components.forEach(function (item) {
						if (item.name.indexOf(switchSystem) != -1) {
							//console.log("We found an item!!!", item);
							document.getElementById("statusPageMaintenance").innerHTML += ('<span class="statusBarBlue">' 
							+ "<a href='" + sm.shortlink + "' target='blank'>" + sm.name + '</a> <span class="date">Scheduled ' 
							+ formatDate(sm.scheduled_for) + ' - ' + formatDate(sm.scheduled_until) 
							+ '</span><span class="visuallyhidden">Maintenance</span><span class="maintenance"></span></span>');
						}
					})
				}
		//Show LDAP login and hide CentralLogin if maintenance status is in progress and Central Login is in the title//
				if (sm.status == "in_progress" && sm.name.toUpperCase().includes("Central Login")) {
					sm.components.forEach(function (item) {
						if (item.name.indexOf(switchSystem) != -1) {
							document.getElementById("ldap-login").style.display = "block";
							document.getElementById("central-login").style.display = "none";
						}
					})
				}
			});
		}
	}
	//Get incidents and scheduled-maintenances to send to functions above.//
	sp.get("components", {
		success: printIncidentSummary
	});
	sp.get("incidents", {
		success: printIncidentSummary
	});
	sp.get("scheduled-maintenances", {
		success: printIncidentSummary
	});
}
//END StatusPage JS//

//Choose which to pull environment//
window.addEventListener('load', function () {
	setupStatusPage();
	var title = document.getElementById('title');
	var subhead = document.getElementById('subhead');
	var ldapsubmit = document.getElementById('ldapsubmit');
	//var hostname = window.location.href //for testing//
	var hostname = window.location.hostname //for prod//
	var loginLink = document.getElementById('login-link')
	if (hostname.indexOf('reggienetdev') >= 0) {
		title.textContent, subhead.textContent = "ReggieNet - Dev";
		ldapsubmit.action = "https://reggienetdev.illinoisstate.edu/portal/xlogin";
		loginLink.href = "https://reggienetdev.illinoisstate.edu/portal/login";
	} else if (hostname.indexOf('reggienettest') >= 0) {
		title.textContent, subhead.textContent = "ReggieNet - Test";
		ldapsubmit.action = "https://reggienettest.illinoisstate.edu/portal/xlogin";
		loginLink.href = "https://reggienettest.illinoisstate.edu/portal/login";
	} 

});

//on click of copyright button, show internal log in//
function showLDAPlogin() {
	document.getElementById("ldap-login").style.display = "block";
}