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
                    "duration": 0,
                    "dismissable": false,
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
                                    "type": "FormImageData"
                                },
                                {
                                    "name": "welcomeTitle",
                                    "textStyle": "titleSemiBoldBlack",
                                    "alignment": "center",
                                    "value": "Welcome to Anytime Mailbox!",
                                    "type": "FormFieldTextData"
                                },
                                {
                                    "name": "welcomeDescription",
                                    "alignment": "center",
                                    "value": "We are excited to introduce our updated and improved mobile app, designed with your needs in mind. We hope you enjoy the new look and experience!",
                                    "type": "FormFieldTextData"
                                },
                                {
                                    "name": "welcomeDescription2",
                                    "alignment": "center",
                                    "value": "Let’s take a tour of your dashboard.",
                                    "type": "FormFieldTextData"
                                },
                                {
                                    "name": "positiveAction",
                                    "title": "Continue",
                                    "isPrimary": true,
                                    "textStyleMode": 0,
                                    "action": "returnField",
                                    "value": "",
                                    "type": "FormActionButtonData"
                                },
                                {
                                    "name": "negativeAction",
                                    "title": "Skip",
                                    "isPrimary": false,
                                    "textStyleMode": 0,
                                    "action": "returnField",
                                    "value": "",
                                    "type": "FormActionButtonData"
                                }
                            ]
                        }
                    ]
                },
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
            "type": "FormFieldTextData"
        });
    }
    if (description && description.trim() !== "") {
        json.data.form.sections[0].fields.push({
          "name": "description",
          "alignment": "center",
          "value": description,
          "type": "FormFieldTextData"
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
          "type": "FormActionButtonData"
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
          "type": "FormActionButtonData"
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
                "duration": duration,
                "dismissable": true,
                "title": "Information",
                "sections": [
                    {
                        "fields": [
                            
                        ]
                    }
                ],
            },
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
            "type": "FormImageData"
        });
    }
    if (message && message.trim() !== "") {
        json.data.form.sections[0].fields.push({
          "name": "message",
          "alignment": "center",
          "value": message,
          "type": "FormFieldTextData"
        });
    }
    var jsonResponse = await callNativeWithResponse(json);
    console.log('jsonResponse:'+ JSON.stringify(jsonResponse));
    if (jsonResponse.dataType === 'field') {
        var confirmed = jsonResponse.data.name === 'positiveAction';
        return confirmed;
    }   
}  

async function showBottomSheet() {
    var json = {
        "data": {
            "form": {
                "duration": 0,
                "dismissable": false,
                "title": "Mail Details",
                "sections": [
                    {
                        "itemSpacing": 4.0,
                        "fields": [
                            {
                                "name": "welcomeTitle",
                                "textStyle": "smallLightBlack",
                                "alignment": "start",
                                "value": "MAIL DETAILS",
                                "type": "FormFieldTextData"
                            },
                            {
                                "name": "titleField",
                                "title": "Title",
                                "placeHolder": "Add Value",
                                "type": "FormCellInputData"
                            },
                            {
                                "name": "mailIdField",
                                "title": "Mail ID",
                                "value": "#9818237",
                                "type": "FormCellInfoData"
                            },
                            {
                                "name": "statusField",
                                "title": "Status",
                                "value": "Viewed",
                                "textColor":"#0D804A",
                                "backgroundTextColor":"#ECFDF3",
                                "type": "FormCellInfoData"
                            },
                            {
                                "name": "lastActionDateField",
                                "title": "Last Action Date",
                                "value": "May 26, 2023",
                                "type": "FormCellInfoData"
                            },
                            {
                                "name": "receivedDateField",
                                "title": "Mail ID",
                                "value": "Received Date",
                                "type": "FormCellInfoData"
                            },
                            {
                                "name": "mailTypeField",
                                "title": "Mail Type",
                                "value": "Box",
                                "type": "FormCellInfoData"
                            }
                        ]
                    },
                    {  
                        "fields":[
                            {
                                "name": "downloadPdfButton",
                                "title": "Download as PDF",
                                "imagePath": "assets/images/pdf_file.svg",
                                "type": "FormCellButtonData"
                            }
                        ]
                    }
                ]
            },
        },
        "dataType": "form",
        "callId": Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        "function": "showFormBottomSheet"
    }
    return await callNativeWithResponse(json);
}

async function showOverlayTopAndBottomBar(argbHexColor){
    var json = {
        "data": {
            "argbHexColor": argbHexColor
        },
        "dataType": "color",
        "callId": Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        "function": "showOverlayTopAndBottomBar"
    }
    return await callNativeWithResponse(json);
}

async function hideOverlayTopAndBottomBar(){
    var json = {
        "dataType": "none",
        "callId": Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        "function": "hideOverlayTopAndBottomBar"
    }
    return await callNativeWithResponse(json);
}

async function changeTab(tabIndex){
    var json = {
        "data": {
            "number": tabIndex
        },
        "dataType": "int",
        "callId": Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        "function": "changeTab"
    }
    return await callNativeWithResponse(json);
}

async function showMailboxSelectUI() {
    var json = {
        "data": {
            "form": {
                "selectionMode": "multiple",
                "duration": 0,
                "dismissable": false,
                "title": "Select Mailbox",
                "sections": [
                    {
                        "fields": [
                            {
                                "name": "title",
                                "textStyle": "smallLightBlack",
                                "alignment": "start",
                                "value": "YOUR MAILBOXES",
                                "type": "FormFieldTextData"
                            },
                            {
                                "name": "mailbox17",
                                "title": "Mailbox 17",
                                "value": "123",
                                "address": "Unit #26 Royal Tower\nScofield and Burrows Parcel\nDaly City, CA, 90124\nUnited States",
                                "titleTextStyle":"normalSemiBoldBlack",
                                "addressTextStyle":"normalLightBlack",
                                "isSelected": true,
                                "action": "none",
                                "type": "FormSelectMailboxData"
                            },
                            {
                                "name": "mailbox20",
                                "title": "Mailbox 20",
                                "value": "124",
                                "address": "Unit #27B\nScofield and Burrows Parcel\nNew York, NY, 10001\nUnited States",
                                "titleTextStyle":"normalSemiBoldBlack",
                                "addressTextStyle":"normalLightBlack",
                                "isSelected": false,
                                "action": "none",
                                "type": "FormSelectMailboxData"
                            },
                            {
                                "name": "mailbox23",
                                "title": "Mailbox 23",
                                "value": "125",
                                "address": "Unit #30\nScofield and Burrows Parcel\nLos Angeles, CA, 90001\nUnited States",
                                "titleTextStyle":"normalSemiBoldBlack",
                                "addressTextStyle":"normalLightBlack",
                                "isSelected": false,
                                "action": "none",
                                "type": "FormSelectMailboxData"
                            },
                            
                        ]
                    }
                ]
            },
        },
        "dataType": "form",
        "callId": Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        "function": "showFormBottomSheet"
    }
    return await callNativeWithResponse(json);
}
