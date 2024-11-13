const ip = "192.168.29.4";
// const ip = "192.168.95.69";
var currUser;

fetch('http://' + ip + ':3000/api/users')
    .then(response => response.json())
    .then(data => {
        currUser = data;
        // Handle the data received from backend
        update_elements();
        main();
    })
    .catch(err => {
        console.error('Error fetching data:', err);
        $(".loader").html("<h1>An Error Occured</h1>");
    });

function formatDate(date) {
    date = new Date(date);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;

}

function update_elements() {
    var x = 0;
    $(".wrapper").html("<h1>Dues</h1><hr><br><br></br>");
    for (var person of currUser.dues) {
        x++;
        var amount = person.balance;
        var color = (amount < 0) ? "green" : "red";
        if (amount < 0) amount *= -1;
        var sign = (color == "green") ? "Take " : "Give ";
        var title = person.name;
        // var date = formatDate(person.date);
        $(".wrapper").html($(".wrapper").html() + '<div class="transaction frosted white-1"><span class="amount ' + color + '-1">' + sign + "₹" + amount + "</span><i data-lucide='circle-user-round'></i><div><span class='name'>" + title + "</span></div></div>");
    }
    if (x == 0) {
        $(".wrapper").html($(".wrapper").html() + "<h1>No Dues...</h1>");
    }
    $(".loader").fadeOut();
}

function main() {
    $(".b-menu .history").click(function () {
        window.location = 'http://' + ip + ':5500/history.html';
    });
    $(".b-menu .home").click(function () {
        window.location = 'http://' + ip + ':5500/index.html';
    });
    $(".b-menu .dues").click(function () {
        window.location = 'http://' + ip + ':5500/dues.html';
    });

    const userId = currUser._id;
    $(".add-trans").click(function () {
        $(".popup-overlay").fadeIn("fast");
        $(".add-trans-box").show();
        $(".add-trans-box").animate({ opacity: 1, marginTop: 0 }, 300);
    });
    $(".add-trans-box .close, .popup-overlay, .add-trans-box .cancel").on("click", function () {

        $(".add-trans-box").animate({ opacity: 0, marginTop: "100px" }, 300);
        $(".popup-overlay").fadeOut("fast");
        $(".add-trans-box").hide();
    });

    $(".add-trans-box .plus").click(function () {
        $(".add-trans-box .plus").addClass("active");
        $(".add-trans-box .minus").removeClass("active");
    });

    $(".add-trans-box .minus").click(function () {
        $(".add-trans-box .minus").addClass("active");
        $(".add-trans-box .plus").removeClass("active");
    });



    document.getElementById('add-trans-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        var amount = parseFloat($("#add-trans-form input").val());
        const title = $("#add-trans-form #title").val();
        const description = $("#add-trans-form #desc").val();
        const pay_type = $("#add-trans-form #options").val();

        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid transaction amount. ' + amount);
            return;
        }
        if ($(".add-trans-box .minus").hasClass("active")) amount *= -1;
        // Assuming you have the user's ID available as `userId`

        const data_json = JSON.stringify({ userId, amount, title, description, pay_type });
        console.log(data_json);
        fetch('http://' + ip + ':3000/api/update-dues', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data_json
        })
            .then(response => response.json())
            .then(data => {
                $(".add-trans-box").animate({ opacity: 0, marginTop: "100px" }, 300);
                $(".popup-overlay").fadeOut("fast");
                $(".add-trans-box").hide();
                refresh();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    });

}

function refresh() {

    fetch('http://' + ip + ':3000/api/users')
        .then(response => response.json())
        .then(data => {
            currUser = data;
            update_elements();
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            $(".loader").html("<h1>An Error Occured</h1>");
        });


}

