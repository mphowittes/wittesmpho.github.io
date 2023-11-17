

    const APP_ID = '86DB0E86-6924-65CB-FF1F-99E061C5E700'; 
    const REST_API_KEY = '12735845-2C7C-40E5-8980-10559654CB2E'; 
    
    Backendless.initApp(APP_ID,REST_API_KEY);

   
function populateTable() {
    
    const query = Backendless.DataQueryBuilder.create();

    
    Backendless.Data.of('Orders').find(query)
        .then(function (orders) {
            // Get the table body to append rows
            const tbody = document.querySelector('#ord_table tbody');

            
            orders.forEach(function (order) {
                const row = tbody.insertRow();
                row.insertCell(0).textContent = order.order_number;
                row.insertCell(1).textContent = order.fullname;
                row.insertCell(2).textContent = order.order_date;
                row.insertCell(3).textContent = order.quantity330ml;
                row.insertCell(4).textContent = order.quantity500ml;

             
                const statusCell = row.insertCell(5);
                const statusDropdown = document.createElement('select');
                statusDropdown.innerHTML = `
                    <option value="Recieved">Recieved</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Pending">Pending</option>
                `;
                statusDropdown.value = order.status; // Set the selected option based on the order's status

                statusCell.appendChild(statusDropdown);

                // Create the Save column with a button
                const saveCell = row.insertCell(6);
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                saveButton.classList.add('btn', 'btn-primary');
                saveButton.addEventListener('click', function () {
                    const newStatus = statusDropdown.value;
                    
                    updateOrderStatus(order.objectId, newStatus);
                });
                saveCell.appendChild(saveButton);
            });
        })
        .catch(function (error) {
            console.error('Error fetching data:', error);
        });
}

function updateOrderStatus(orderId, newStatus) {
    const ordersTable = Backendless.Data.of('Orders');
    
    
    const updateObject = {
        status: newStatus
    };

    ordersTable.save({ objectId: orderId, ...updateObject })
        .then(function (updatedOrder) {
            console.log('Order status updated:', updatedOrder);
        })
        .catch(function (error) {
            console.error('Error updating order status:', error);
        });
}
   
    populateTable();


    document.addEventListener("DOMContentLoaded", function() {
  var logoutLink = document.getElementById("logoutLink");

  if (logoutLink) {
    logoutLink.addEventListener("click", function(event) {
      event.preventDefault();

      Backendless.UserService.logout()
        .then(() => {
          
          window.history.pushState({}, "", "main.html?loggedOut=true");

          
          window.location.href = "main.html";
          console.log("User logged out");
          clearViews();
        })
        .catch((error) => {
          console.error("Error logging out:", error);
        });
    });
  } else {
    console.error("Element with id 'logoutLink' not found.");
  }
});

      
      // Thingspeak keys
      const channelID = '1761585'; 
      const apiKey = '147VXUAFDWWKEOV2'; 
      const apiUrl = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=10`;
     


// Function to fetch data and populate the table
async function fetchDataAndPopulateTable() {
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            const tableBody = document.querySelector('#pant_table tbody');

            data.feeds.forEach(feed => {
              
                const row = tableBody.insertRow();

                row.insertCell(0).textContent = feed.entry_id;
                row.insertCell(1).textContent = feed.field1; 
                row.insertCell(2).textContent = feed.field2; 
                row.insertCell(3).textContent = feed.field3; 
                row.insertCell(4).textContent = feed.field4; 
                row.insertCell(5).textContent = feed.field5;
                
            });
        } else {
            console.error('Error fetching data from ThingSpeak.');
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}

fetchDataAndPopulateTable();





    document.addEventListener("DOMContentLoaded", function () {

       
        // Function to fetch data from ThingSpeak
        function fetchDataFromThingSpeak() {
            const channelID = '1761585'; // ThingSpeak channel ID
            const apiKey = '147VXUAFDWWKEOV2'; // ThingSpeak API Key
            const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=10`;

            // Fetch data from ThingSpeak
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const field3Data = data.feeds.map(feed => feed.field3);
                    console.log(field3Data);
                    const field5Data = data.feeds.map(feed => feed.field5);
        console.log(field5Data);
        const entry = data.feeds.map(feed => feed.entry_id);
                    
                    updatePieChart(data.feeds);
                   updateChart(field3Data,field5Data,entry);
                })
                .catch(error => console.error('Error fetching data from ThingSpeak:', error));
        }

       
        function updatePieChart(feeds) {
            // Check if there are feeds
            if (feeds.length === 0) {
                console.error('No data available from ThingSpeak');
                return;
            }

            // Extract data from the latest feed
            var b300count = feeds.reduce((sum, feed) => sum + parseFloat(feed.field1), 0);
            var b500count = feeds.reduce((sum, feed) => sum + parseFloat(feed.field2), 0);
            var sumElevation = feeds.reduce((sum, feed) => sum + parseFloat(feed.field3), 0);
            var sumFlowing = feeds.reduce((sum, feed) => sum + parseFloat(feed.field4), 0);
            var sumWaterLevel = feeds.reduce((sum, feed) => sum + parseFloat(feed.field5), 0);

            

            var bottlePieChartCanvas = document.getElementById("bottlesChart").getContext("2d");
            var backgroundColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF5733"];
            var bottleChart = new Chart(bottlePieChartCanvas, {
                type: "pie",
                data: {
                    labels: ['330ml Bottles', '500ml Bottles',],
                    datasets: [{
                        data: [b300count, b500count],
                        backgroundColor: backgroundColors,
                    }],
                },
            });
            
        }

        function updateChart(feed1,feed2,entry_id){
            const xValues = [10,20,30,40,50,60,70,80,90,100];

            new Chart("chart_water_level", {
                type: "line",
                data: {
                    labels: entry_id,
                    datasets: [{
                        data: feed1,
                        borderColor: "red",
                        fill: false
                    }]
                },
                options: {
                    legend: { display: false },
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Entry ID'
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Weater Level' 
                            }
                        }]
                    }
                }
            });
            





new Chart("chart_elevation", {
    type: "line",
    data: {
        labels: entry_id,
        datasets: [{
            data: feed2,
            borderColor: "blue",
            fill: false
        }]
    },
    options: {
        legend: { display: false },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Entry ID'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Elevation'
                }
            }]
        }
    }
});

        }

      



        

        fetchDataFromThingSpeak();
    });



