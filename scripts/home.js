var currUser;
const ip = "192.168.29.4";
// const ip = "192.168.95.69";
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

function update_elements() {
    const perMonth = getPercentageOfMonthPassed();
    const perBudget = Math.floor(100 * (currUser.todaySpendings / currUser.budgetPerMonth));
    const budget = currUser.weekdayBudget;
    console.log(currUser.todaySpendings, currUser.budgetPerMonth, perBudget)
    $(".budget span").html(perBudget + "%");
    if (perBudget <= perMonth) {
        $(".budget span").removeClass("red-1").addClass("green-1");
    }
    $(".month span").html(perMonth + "%");
    $(".loader").fadeOut();
    $(".userNameJS").html(currUser.name);
    $(".balanceJS").html("₹" + currUser.todaySpendings);
    if (currUser.upiSpendings <= .9 * budget) {
        $(".curbal.balanceJS").removeClass("red-1").removeClass("yellow-1").addClass("green-1");
    } else if (currUser.upiSpendings >= 1 * budget) {
        $(".curbal.balanceJS").removeClass("green-1").removeClass("yellow-1").addClass("red-1");
    } else {
        $(".curbal.balanceJS").removeClass("red-1").removeClass("green-1").addClass("yellow-1");
    }
    $(".upiBalJS").html("₹" + Math.floor(currUser.upiSpendings));
    $(".cashBalJS").html("₹" + Math.floor(currUser.cashSpendings));
    $(".daily-budgetJS").html("₹" + Math.floor(budget))

}

function setWaterLevel(percentage) {
    var $water = $('#water');
    var containerHeight = $('#water-container').height();

    // Calculate height based on percentage and container height
    var height = (percentage / 100) * containerHeight;

    // Set the height of the water div
    $water.css('transform', 'translateY(' + (100 - percentage) + '%)');
}

// Example usage: Fill the water to 50%
$(document).ready(function () {
    setWaterLevel(50);
});




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
        fetch('http://' + ip + ':3000/api/update-balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data_json
        })
            .then(response => response.json())
            .then(data => {
                $(".add-trans-box").animate({ opacity: 0, marginTop: "100px" }, 500);
                $(".popup-overlay").fadeOut();
                $(".add-trans-box").hide();
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

$(document).ready(function () {
    var app = document.getElementById('auto-quote');

    var typewriter = new Typewriter(app, {
        // loop: true,
        delay: 60,
        cursor: ""
    });

    typewriter
        .pauseFor(1000)
        .typeString('A rupee saved is a rupee earned!')
        .start();
})

