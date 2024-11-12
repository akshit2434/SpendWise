var currUser;
var ip = "192.168.29.4";
fetch('http://' + ip + ':3000/api/users')
    .then(response => response.json())
    .then(data => {
        currUser = data;
        // Handle the data received from backend
        update_elements();
    })
    .catch(err => {
        console.error('Error fetching data:', err);
        $(".loader").html("<h1>An Error Occured</h1>");
    });

function update_elements() {
    $(".loader").fadeOut();
    $(".userNameJS").html(currUser.name);
    $(".balanceJS").html("₹" + currUser.currentBalance);
    $(".upiBalJS").html("₹" + currUser.upiBalance);
    $(".cashBalJS").html("₹" + currUser.cashBalance);

    main();
}

function main() {
    $(".add-trans").click(function () {
        $(".popup-overlay").fadeIn("fast");
        $(".add-trans-box").show();
        $(".add-trans-box").animate({ opacity: 1, marginTop: 0 }, 300);
        console.log("open");
    });
    $(".add-trans-box .close, .popup-overlayl, .add-trans-box .cancel").on("click", function () {

        $(".add-trans-box").animate({ opacity: 0, marginTop: "100px" }, 300);
        $(".popup-overlay").fadeOut("fast");
        $(".add-trans-box").hide();
        console.log("close");
    });

    $(".add-trans-box .plus").click(function () {
        $(".add-trans-box .plus").addClass("active");
        $(".add-trans-box .minus").removeClass("active");
    });

    $(".add-trans-box .minus").click(function () {
        $(".add-trans-box .minus").addClass("active");
        $(".add-trans-box .plus").removeClass("active");
    });
}

