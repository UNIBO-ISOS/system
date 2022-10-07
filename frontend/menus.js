$(document).ready(() => {
	const loadContent = (search) => {
		const restaurant_id = localStorage.getItem("restaurant_id");
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
				console.log(item._id);
				$(`#${item._id} .card-footer .remove`).on("click", (event) => {
					const newValue =
						parseInt($(`#${item._id} input`).val()) - 1;
					if (newValue >= 1) {
						$(`#${item._id} input`).val(newValue.toString());
					}
				});

				$(`#${item._id} .card-footer .add`).on("click", (event) => {
					const newValue =
						parseInt($(`#${item._id} input`).val()) + 1;
					$(`#${item._id} input`).val(newValue.toString());
				});

				//  todo: aggiungere layout recap
				//  todo: modificare funzioni di add e remove per gestire il recap
				//  todo: modificare oggeto order dinamicamente per ottere dettagli ordine
				//  todo: redirect pagina di checkout contenente i dettagli ordine
			}

			$("#recap").append(
				`
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">Order Details</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            // todo: dettagli ordine
                        </p>
                    </div>
                    <div class="card-footer">
                        <button type="button" class="btn btn-default btn-number add">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
                `
			);
		});
	};
	$("#filter").on("keyup", (event) => {
		const text = $("#filter").val() ? $("#filter").val() : undefined;
		loadContent(text);
	});
	loadContent();
});
