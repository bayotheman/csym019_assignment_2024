
export function postRequest(url, payload, headers={}) {
    let response = {
        successful: false,
        message: "Invalid request payload",
        data:[]
    };
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType:"application/json",
        data: JSON.stringify(payload),
        async: false,
        headers:headers,
        success: function(success) {
            console.log("inside jQuery success function");
            console.log("success: "); console.log(success);
            response = success;
        },
        error: function(xhr, status, error) {
            response.message = "An error has occurred";
        }
    });

    return response;
}


export function getRequest(url, headers={}) {
    let response = {
        successful: false,
        message: "Invalid request payload",
        data:[]
    };

    $.ajax({
        url: url,
        type: "GET",
        contentType:"application/json",
        async: false,
        headers:headers,
        success: function(success) {
            console.log("inside jQuery success function");
            console.log("success: "); console.log(success);
            response = success;
        },
        error: function(xhr, status, error) {
            response.message = "An error has occurred";
        }
    });

    return response;
}