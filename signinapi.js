//Start Status Page JS//
//Format date//
function formatDate(dateString) {
    var d = new Date(dateString);
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
    };
    return d.toLocaleDateString('en-US', options);
}
//Pull StatusPage API//
function setupStatusPage() {
    let CASdown = 0;
    var sp = new StatusPage.page({
        page: 'lv92pqt38dpy'
    });
    var printIncidentSummary = function (result) {
        console.log("Incident summary object: ", result);
        if (result.error != null) {
            console.log("Error: ", result.error);
        }
        //Check incidents where the incident status IS NOT resolved AND the name of the component is ReggieNet and the component IS NOT operational//
        //Also check for Central Login outages -- TODO - maybe include maintenance too?//
        if (result.incidents != null) {
            result.incidents.forEach(function (i) {
                if (i.status != "resolved") {
                    i.components.forEach(function (item) {
                        if (
                            item.name.indexOf("ReggieNet") != -1 && item.status != "operational") {
                            //console.log("We found an item!!!", item);
                            //Title with link to incident, updated date, body//
                            document.getElementById("Statuspage-api").innerHTML += "<h3><a href='" + i.shortlink + "'>" + i.name + "</a></h3>" + "<i>Updated " + formatDate(i.updated_at) + "</i></br>" + i.incident_updates[0].body + "";
                        }
                        else if (item.name.indexOf("Login and Authentication") != -1 && item.status != "operational") {
                            document.getElementById("Statuspage-api").innerHTML += "<h3><a href='" + i.shortlink + "'>" + i.name + "</a></h3>" + "<i>Updated " + formatDate(i.updated_at) + "</i></br>" + i.incident_updates[0].body + "";

                                document.getElementById("alternatelink").setAttribute("role", "alert");
                                document.getElementById("alternatelink").innerHTML = "<br><br>The <a href='https://reggienetdev.illinoisstate.edu/x/bygYHd' class='link'>ReggieNet Login</a> button will allow you to access ReggieNet while the regular login system is unavailable.<br><br><br>";
                                document.getElementById("reggie-login").style.display = 'inline-block';
                                $(document).ready(function () {
                                    $(".login-link").hide();
                                    // $(".reggie-login").css({visibility = 'visible'});
                                    $(".alt-login").removeClass("visuallyhidden");

                                })
                                // document.getElementsByClassName("reggie-login")[0].className += " alt-login";

                        }
                    })
                }
            });
        }
        //Check scheduled maintenance where the schedule maintenance status IS NOT completed AND the name of the component is ReggieNet//
        if (result.scheduled_maintenances != null) {
            result.scheduled_maintenances.forEach(function (sm) {
                if (sm.status != "completed") {
                    sm.components.forEach(function (item) {
                        if (item.name.indexOf("ReggieNet") != -1) {
                            //console.log("We found an item!!!", item);
                            //Title with link to incident, updated date, body//
                            document.getElementById("Statuspage-api").innerHTML += ("<h3><a href='" + sm.shortlink + "'>" + sm.name + "</a></h3>" + "<i>Updated " + formatDate(sm.updated_at) + "</i></br>" + sm.incident_updates[0].body + "");
                        }
                    })
                }
            });
        }
    }
    //Get incidents and scheduled-maintenances to send to functions above.//
    sp.get("incidents", {
        success: printIncidentSummary
    });
    sp.get("scheduled-maintenances", {
        success: printIncidentSummary
    });

 

    //Other stuff that can be deleted. But keep for now//
    sp.summary({
        success: function (data) {
            console.log(data);
            data.components.forEach(function (comp) {
                if (comp.name == "Campus Solutions") {
                    console.log('SIS status: ', comp);
                    if (comp.status != 'operational') {
                        console.log("showing error thing on page");
                        // show a thing on the page about how there's a problem    
                        //document.getElementById("techalertrss").innerHTML = "<h1>Thar' be a problem</h1>";
                    }

 

                }
            })
        }
    });
}
//END StatusPage JS//