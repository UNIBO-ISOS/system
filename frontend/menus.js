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
						</div>
					</div>
				`)
			}
            
			$("#menu .card").on("click", (event) => {
				const target = event.target;
				const id = $(target).attr("id");
				console.log(id);
			});
		});
	};
	$("#filter").on("keyup", (event) => {
		const text = $("#filter").val() ? $("#filter").val() : undefined;
		loadContent(text);
	});
	loadContent();
});
