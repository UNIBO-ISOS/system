$(document).ready(() => {
	const loadContent = (search) => {
		let url = "/apilistener/restaurants";
		const city_id = localStorage.getItem("city_id");
		if (search) {
			url = url + "/?search=" + search + "&cityId=" + city_id;
		} else {
			url = url + "/?cityId=" + city_id;
		}
		$.ajax({
			type: 'GET',
			url: url,
			beforeSend: (request) => {
				const bk = localStorage.getItem('bk')
				request.setRequestHeader("businessKey", bk);
			},
			success: (data) => {
				$("#restaurants").remove();
				$("#content").append('<ul id="restaurants"></ul>');
				const ul = $("#restaurants");

				for (const item of data.restaurants) {
					ul.append("<li id='" + item._id + "' > " + item.name + "</li>");
				}
				$("#restaurants li").on("click", (event) => {
					const target = event.target;
					const id = $(target).attr("id");
					console.log(id);

					localStorage.setItem("restaurant_id", id);
					window.location.href = "/menus.html";
				});
			}
		})
	};
	$("#filter").on("keyup", (event) => {
		const text = $("#filter").val() ? $("#filter").val() : undefined;
		loadContent(text);
	});
	loadContent();
});
