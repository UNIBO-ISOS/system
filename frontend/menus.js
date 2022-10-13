var initLocation = () => {
	navigator.geolocation.getCurrentPosition((position) => {
		let lat = position.coords.latitude;
		let long = position.coords.longitude;

		$("#latitude").val(lat.toFixed(4));
		$("#longitude").val(long.toFixed(4));
	});
};

var bankAuth = () => {
	//  todo: login banca con SOAP
};

$(document).ready(() => {
	const loadContent = (search) => {
		const restaurant_id = localStorage.getItem("restaurant_id");
		const token = localStorage.getItem("token");
		let url = "/api/restaurants/" + restaurant_id;

		let order = {
			restaurantId: restaurant_id,
			amount: 0,
			items: [],
			/*
            date: (new Date()).setHours(0,0,0,0),
            address
            */
		};

		const sendOrder = () => {
			$.ajax({
				type: "POST",
				url: "/api/orders/",
				data: JSON.stringify(order),
				dataType: "json",
				contentType: "application/json",
				beforeSend: (req) => {
					req.setRequestHeader("Authorization", "Bearer " + token);
				},
				success: (data) => {
					console.log(data);

					//todo save order id (versione di Pizzo) e passare alla visualizzazione dello stato ordine e pagamento
				},
				error: (jqxhr, status, error) => {
					console.log(error);
				},
			});
		};

		const getTotal = () => {
			$("#checkoutButton").attr("disabled", true);
			const list = $(`#recap .card .card-body ul li`);
			let total = 0;
			order.items = [];
			for (const item of list) {
				$("#checkoutButton").attr("disabled", false);
				total =
					total +
					parseFloat(
						$(
							`#recap .card .card-body ul #${item.id} #total`
						).text()
					);
				order.items.push({
					menuId: item.id,
					qty: parseInt(
						$(`#recap .card .card-body ul #${item.id} #qty`).text()
					),
				});
			}
			order.amount = total;
			return total;
		};

		if (search) {
			url = url + "/?search=" + search;
		}
		$.get(url, (data) => {
			$("#menu").remove();
			$("#contents").prepend('<div id="menu" class="col-sm-4"></div>');
			const row = $("#menu");

			for (const item of data.restaurant.menu) {
				let li = ``;
				for (const itemMenu of item.items) {
					li = li.concat(
						`<li class="list-group-item">Name: ${itemMenu.name} (${
							item.categories[itemMenu.category[0]]
						})</li>`
					);
				}
				const ul = `<ul class="list-group list-group-flush">${li}</ul>`;
				row.append(`
                    <div class="card" id="${item._id}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">${item.desc}</p>
                        </div>
                        ${ul}
                        <div class="card-footer">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <button type="button" class="btn btn-default btn-number remove">
                                        <i class="bi bi-dash"></i>
                                    </button>
                                </div>
                                <input type="number" class="form-control col-xs-2" placeholder="Quantity" min="0" value="0"></input>
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-default btn-number add">
                                        <i class="bi bi-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
					</div>
				`);

				$(`#${item._id} .card-footer .remove`).on("click", (event) => {
					// remove old menu's entry
					$(`#recap .card .card-body ul #${item._id}`).remove();
					const qty = parseInt($(`#${item._id} input`).val()) - 1;
					const menuValue = qty * item.price;
					if (qty > 0)
						$("#recap .card .card-body ul").append(
							`<li id="${item._id}"><span id="qty">${qty}</span> x ${item.price} - ${item.name} <span id="total">${menuValue}</span></li>`
						);
					$("#recap .card .card-footer span").text(`${getTotal()}`);
					if (qty >= 0) {
						$(`#${item._id} input`).val(qty.toString());
					}
				});

				$(`#${item._id} .card-footer .add`).on("click", (event) => {
					// remove old menu's entry
					$(`#recap .card .card-body ul #${item._id}`).remove();
					const qty = parseInt($(`#${item._id} input`).val()) + 1;
					const menuValue = qty * item.price;
					$("#recap .card .card-body ul").append(
						`<li id="${item._id}"><span id="qty">${qty}</span> x ${item.price} - ${item.name} <span id="total">${menuValue}</span></li>`
					);
					$("#recap .card .card-footer span").text(`${getTotal()}`);
					$(`#${item._id} input`).val(qty.toString());
				});
			}

			$("#recap").append(
				`
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Order Details</h5>
                    </div>
                    <div class="card-body">
                        <ul class="card-text">
                        </ul>
                    </div>
                    <div class="card-footer">
						<h5>Total <span>0</span></h5>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#checkout_popup" id="checkoutButton" onClick="initLocation()" disabled>Checkout</button>
                    </div>
                </div>
                `
			);

			$("#continue").on("click", (event) => {
				const delivery = $("#deliveryTime").val();
				const street = $("#street").val();
				const number = parseInt($("#number").val());
				const city = $("#city").val();
				const lat = parseFloat($("#latitude").val());
				const lng = parseFloat($("#longitude").val());
				if (!delivery || !street || !number || !city || !lat || !lng) {
					alert("Attention, missing field!");
					return;
				}
				order.deliveryTime = delivery;
				order.address = {
					street: street,
					number: number,
					city: city,
					location: {
						type: "Point",
						coordinates: [lat, lng],
					},
				};
				sendOrder();
				console.log(order);
			});
		});
	};
	$("#filter").on("keyup", (event) => {
		const text = $("#filter").val() ? $("#filter").val() : undefined;
		loadContent(text);
	});
	loadContent();
});
