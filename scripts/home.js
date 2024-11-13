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
    var perMonth = getPercentageOfMonthPassed();
    var perBudget = Math.floor(100 * (currUser.currentBalance / currUser.budgetPerMonth));
    console.log(currUser.currentBalance, currUser.budgetPerMonth, perBudget)
    $(".budget span").html(perBudget + "%");
    if (perBudget <= perMonth) {
        $(".budget span").removeClass("red-1").addClass("green-1");
    }
    $(".month span").html(perMonth + "%");
    $(".loader").fadeOut();
    $(".userNameJS").html(currUser.name);
    $(".balanceJS").html("₹" + currUser.currentBalance);
    $(".upiBalJS").html("₹" + Math.floor(currUser.upiBalance));
    $(".cashBalJS").html("₹" + Math.floor(currUser.cashBalance));

    main();
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
        fetch('http://' + ip + ':3000/api/update-balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data_json
        })
            .then(response => response.json())
            .then(data => {
                alert('Transaction successful:');
                refresh();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    });

}

function getPercentageOfMonthPassed() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDaysInMonth = (lastDayOfMonth - firstDayOfMonth) / (1000 * 60 * 60 * 24) + 1;
    const daysPassed = (currentDate - firstDayOfMonth) / (1000 * 60 * 60 * 24) + 1;
    const percentagePassed = (daysPassed / totalDaysInMonth) * 100;

    return percentagePassed.toFixed(0);
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

