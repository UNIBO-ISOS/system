$(document).ready(() => {
    const loadContent = (search) => {
        let url = "/api/restaurants";
        const city_id = localStorage.getItem("city_id")
		if (search) {
			url = url + "/?search=" + search;
		}
		$.get(url, (data) => {
			$("#restaurants").remove();
			$("#content").append('<ul id="restaurants"></ul>');
			const ul = $("#restaurants");

			for (const item of data.restaurants) {
				if(item.city._id == city_id)
                {
                    ul.append("<li id='" + item._id + "' > " + item.name + "</li>");
                }
			}
			$("#restaurants li").on("click", (event) => {
				const target = event.target;
				const id = $(target).attr("id");
				console.log(id);

				localStorage.setItem("restaurant_id", id);
				window.location.href = "/menus.html";
            });
		});
	};
	$("#filter").on("keyup", (event) => {
		const text = $("#filter").val() ? $("#filter").val() : undefined;
		loadContent(text);
	});
	loadContent();
});
