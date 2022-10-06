$(document).ready(() => {
	const loadContent = (search) => {
		let url = "/api/cities";
		if (search) {
			url = url + "/?search=" + search;
		}
		$.get(url, (data) => {
			$("#cities").remove();
			$("#content").append('<ul id="cities"></ul>');
			const ul = $("#cities");
			for (const item of data.cities) {
				ul.append("<li id='" + item._id + "' > " + item.name + "</li>");
			}
			$("#cities li").on("click", (event) => {
				const target = event.target;
				const id = $(target).attr("id");
				console.log(id);

				localStorage.setItem("city_id", id);
				window.location.href = "/restaurants.html";
			});
		});
	};
	$("#filter").on("keyup", (event) => {
		const text = $("#filter").val() ? $("#filter").val() : undefined;
		loadContent(text);
	});
	loadContent();
});
