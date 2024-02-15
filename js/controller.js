var isFlutterInAppWebViewReady = false;
window.addEventListener("flutterInAppWebViewPlatformReady", function(event) {
    isFlutterInAppWebViewReady = true;
});

// variable that will represents the port used to communicate with the Dart side
var port;
var resolveFunctions = {};
// listen for messages
window.addEventListener('message', function(event) {
    if (event.data == 'capturePort') {
        // capture port2 coming from the Dart side
        if (event.ports[0] != null) {
            // the port is ready for communication,
            // so you can use port.postMessage(message); wherever you want
            port = event.ports[0];
            // To listen to messages coming from the Dart side, set the onmessage event listener
            port.onmessage = function (event) {
                // event.data contains the message data coming from the Dart side
                var jsonData = JSON.parse(event.data);
                if (resolveFunctions[jsonData.callId]) {
                    resolveFunctions[jsonData.callId](jsonData);
                    delete resolveFunctions[jsonData.callId];  // Remove the resolve function after it's called
                }
                
            };
        }
    }
}, false);

async function callNativeWithResponse(json) {
    try {
        if (isFlutterInAppWebViewReady) {
            var jsonString = JSON.stringify(json);
            port.postMessage(jsonString);
            return new Promise((resolve, reject) => {
                resolveFunctions[json.callId] = resolve;
            });
        }
    } catch (error) {
        console.error('Error in callNativeWithResponse:', error);
    }
}

async function showFormPopup(){
    var json = {
            "data": {
                "form": {
                    "title": "Welcome",
                    "sections": [
                        {
                            "fields": [
                                {
                                    "name": "image",
                                    "alignment": "center",
                                    "value": "assets/images/congratulation.svg",
                                    "isLocal": true,
                                    "width": 100,
                                    "height": 100,
                                    "type": 4
                                },
                                {
                                    "name": "welcomeTitle",
                                    "textStyle": "titleSemiBoldBlack",
                                    "alignment": "center",
                                    "value": "Welcome to Anytime Mailbox!",
                                    "type": 1
                                },
                                {
                                    "name": "welcomeDescription",
                                    "alignment": "center",
                                    "value": "We are excited to introduce our updated and improved mobile app, designed with your needs in mind. We hope you enjoy the new look and experience!",
                                    "type": 1
                                },
                                {
                                    "name": "welcomeDescription2",
                                    "alignment": "center",
                                    "value": "Let’s take a tour of your dashboard.",
                                    "type": 1
                                },
                                {
                                    "name": "positiveAction",
                                    "title": "Continue",
                                    "isPrimary": true,
                                    "textStyleMode": 0,
                                    "action": "returnField",
                                    "value": "",
                                    "type": 5
                                },
                                {
                                    "name": "negativeAction",
                                    "title": "Skip",
                                    "isPrimary": false,
                                    "textStyleMode": 0,
                                    "action": "returnField",
                                    "value": "",
                                    "type": 5
                                }
                            ]
                        }
                    ]
                },
                "duration": 0,
                "dismissable": false
            },
            "dataType": "form",
            "callId": Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            "function": "showFormPopup"
        }
    return await callNativeWithResponse(json);
    // console.log('Form Popup shown'+JSON.stringify(jsonResponse));
}

async function showProgressPopup() {
    console.log('Showing progress popup');
    var json  = {
        "dataType": "none",
        "callId": Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        "function": "showProgressPopup"
    }
    setTimeout(async function() {
        await hideProgressPopup();
    }, 3000);
    return await callNativeWithResponse(json);
}

async function hideProgressPopup() {  
    console.log('Hiding progress popup');
    var json  = {
        "dataType": "none",
        "callId": Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        "function": "hideProgressPopup"
    }
    return await callNativeWithResponse(json);
}

async function showConfirmationPopup(title, description, positiveMessage, negativeMessage) {
    var json = {
        "data": {
            "form": {
                "title": "Confirmation",
                "sections": [
                    {
                        "fields": [
                            
                        ]
                    }
                ]
            }
        },
        "dataType": "form",
        "callId": Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        "function": "showFormPopup"
    }
    if (title && title.trim() !== "") {
        json.data.form.sections[0].fields.push({
            "name": "title",
            "textStyle": "titleSemiBoldBlack",
            "alignment": "center",
            "value": title,
            "type": 1
        });
    }
    if (description && description.trim() !== "") {
        json.data.form.sections[0].fields.push({
          "name": "description",
          "alignment": "center",
          "value": description,
          "type": 1
        });
    }
    if (positiveMessage && positiveMessage.trim() !== "") {
        json.data.form.sections[0].fields.push({
          "name": "positiveAction",
          "title": positiveMessage,
          "isPrimary": true,
          "textStyleMode": 0,
          "action": "returnField",
          "value": "",
          "type": 5
        });
    }
    if (negativeMessage && negativeMessage.trim() !== "") {
        json.data.form.sections[0].fields.push({
          "name": "negativeAction",
          "title": negativeMessage,
          "isPrimary": false,
          "textStyleMode": 0,
          "action": "returnField",
          "value": "",
          "type": 5
        });
    }
    var jsonResponse = await callNativeWithResponse(json);
    console.log('jsonResponse:'+ JSON.stringify(jsonResponse));
    if (jsonResponse.dataType === 'field') {
        var confirmed = jsonResponse.data.name === 'positiveAction';
        return confirmed;
    }   
}   

async function showInformationPopup(message,icon,duration) {
    var json = {
        "data": {
            "form": {
                "title": "Information",
                "sections": [
                    {
                        "fields": [
                            
                        ]
                    }
                ],
            },
            "duration": duration,
            "dismissable": true,
        },
        "dataType": "form",
        "callId": Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        "function": "showFormPopup"
    }
    if (icon && icon.trim() !== "") {
        json.data.form.sections[0].fields.push(                                {
            "name": "icon",
            "alignment": "center",
            "value": "assets/images/circle_check.svg",
            "isLocal": true,
            "width": 40,
            "height": 40,
            "type": 4
        });
    }
    if (message && message.trim() !== "") {
        json.data.form.sections[0].fields.push({
          "name": "message",
          "alignment": "center",
          "value": message,
          "type": 1
        });
    }
    var jsonResponse = await callNativeWithResponse(json);
    console.log('jsonResponse:'+ JSON.stringify(jsonResponse));
    if (jsonResponse.dataType === 'field') {
        var confirmed = jsonResponse.data.name === 'positiveAction';
        return confirmed;
    }   
}  

function showBottomSheet(title, message) {
    console.log('Showing BottomSheet');
    if (isFlutterInAppWebViewReady) {
        console.log('Calling getBottomSheetData');
        var json  = {
            "data": {
                "form": 
                {
                    "title": "Mail Details",
                    "sections": [
                        {
                            "fields":[
                              {
                                    "name": "title",
                                    "title": "Mail Details",
                                    "textStyleMode":1,
                                    "type": 1
                                },
                                {
                                    "name": "titleField",
                                    "title": "Title",
                                    "placeHolder": "Add Value",
                                    "textStyleMode":1,
                                    "type": 1
                                },
                                {
                                    "name": "mailIdField",
                                    "title": "Mail ID",
                                    "value": "#9818237",
                                    "type": 2
                                },
                                {
                                    "name": "statusField",
                                    "title": "Status",
                                    "value": "Viewed",
                                    "type": 3
                                },
                                {
                                    "name": "lastActionDateField",
                                    "title": "Last Action Date",
                                    "value": "May 26, 2023",
                                    "type": 2
                                },
                                {
                                    "name": "receivedDateField",
                                    "title": "Received Date",
                                    "value": "May 20, 2023",
                                    "type": 2
                                },
                                {
                                    "name": "mailTypeField",
                                    "title": "Mail Type",
                                    "value": "Box",
                                    "type": 2
                                }
                            ]
                        },
                        {
                            "fields":[
                                { 
                                    "name": "divider",
                                    "title": "",
                                    "textStyleMode":1,
                                    "type": 1
                                },
                                {
                                    "name": "downloadPdfButton",
                                    "title": "Download as PDF",
                                    "iconName": "filePdf",
                                    "iconFont": "font_awesome",
                                    "textStyleMode":1,
                                    "type": 1
                                },
                                {
                                    "name": "openScanButton",
                                    "title": "Open & Scan",
                                    "iconName": "filePdf",
                                    "iconFont": "custom_icons",
                                    "textStyleMode":1,
                                    "type": 1
                                }
                            ]
                        }
                    ]
                }
                
            },
            "callId": 9001,
            "function": "showBottomSheet"
        }
        var jsonString = JSON.stringify(json);
        port.postMessage(jsonString);
    }
}
