$(document).ready(() => {
	const loadContent = (search) => {
		const restaurant_id = localStorage.getItem("restaurant_id");
		let url = "/api/restaurants/" + restaurant_id;
		if (search) {
			url = url + "/?search=" + search;
		}
		$.get(url, (data) => {
			$("#menu").remove();
			$("#content").append('<ul id="menu"></ul>');
			const ul = $("#menu");
			
			for (const item of data.restaurant.menu) {
				ul.append("<li id='" + item._id + "' > " + item.name + "</li>");
			}
            
			$("#menu li").on("click", (event) => {
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
