$(document).ready(() => {
	const loadContent = (search) => {
		const restaurant_id = localStorage.getItem("restaurant_id");
		let url = "/api/restaurants/" + restaurant_id;
		if (search) {
			url = url + "/?search=" + search;
		}
		$.get(url, (data) => {
			$("#menu").remove();
			$("#content").append('<div id="menu" class="row"></div>');
			const row = $("#menu");
			
			for (const item of data.restaurant.menu) {
				let li = ``
				for(const itemMenu of item.items) {
					li = li.concat(`<li class="list-group-item">Name: ${itemMenu.name} (${item.categories[itemMenu.category[0]]})</li>`)
				}
				const ul = `<ul class="list-group list-group-flush">${li}</ul>`
				row.append(`
					<div class="col-sm-6" id="menu">
						<div class="card" id="${item._id}">
							<div class="card-body">
								<h5 class="card-title">${item.name}</h5>
								<p class="card-text">${item.desc}</p>
							</div>
							${ul}
							<div class="card-footer">
								<div class="input-group col-xs-2">
									<div class="input-group-prepend">
										<button type="button" class="btn btn-default btn-number remove">
											<i class="bi bi-dash"></i>
										</button>
									</div>
									<input type="number" class="form-control" placeholder="Quantity" min="0" value="0"></input>
									<div class="input-group-append">
										<button type="button" class="btn btn-default btn-number add">
											<i class="bi bi-plus"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				`)
				console.log(item._id)
				$(`#${item._id} .card-footer .remove`).on('click', (event) => {
					const newValue = parseInt($(`#${item._id} input`).val()) - 1
					if(newValue >= 1) {
						$(`#${item._id} input`).val(newValue.toString())
					}
				})

				$(`#${item._id} .card-footer .add`).on('click', (event) => {
					const newValue = parseInt($(`#${item._id} input`).val()) + 1
					$(`#${item._id} input`).val(newValue.toString())
				})

			}
		});
	};
	$("#filter").on("keyup", (event) => {
		const text = $("#filter").val() ? $("#filter").val() : undefined;
		loadContent(text);
	});
	loadContent();
});
