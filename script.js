var folder = "https://api.github.com/repos/cyberscript77/datapack/contents/datapacks"
var raw_url = "https://cyberscript77.github.io/datapack/datapacks";
var first_featured = false;
var feature_count = 2;
var selected_datapack = "";
$(document).ready(function () {
    $.getJSON(folder, async function (folders_list) {
        for (i = 0; i < folders_list.length; i++) {
            var folder_name = folders_list[i].name;
            await $.getJSON(raw_url + "/" + folder_name + "/desc.json", function (data) {
                if (data.featured && feature_count != 0) { feature_count--; }
                else if (data.featured && feature_count == 0) { data.featured = false; }
                document.getElementsByClassName(`${data.featured ? "featured-container" : "container"}`)[0].insertAdjacentHTML("beforeend",
                    `<div class="card ${data.featured ? "featured" : ""} ${data.featured && first_featured ? "next" : ""}" onclick="openDatapack('${raw_url + "/" + folder_name}');"><img src="${raw_url + "/" + folder_name + "/thumbnail.jpg"}" />
                             <h2>${data.name}</h2>
                             <p>${data.desc}</p><br>
                             <p class="author">▣ Author: ${data.author}</p> ${data.branch == "beta" || data.branch == "alpha" ? `<div class="tag shimmer">${data.branch.capitalize()}</div>` : ""}
                             </div>`);
                if (data.featured == true) first_featured = true;
            });
        }
    });

    document.getElementById("how-to-install-datapack").addEventListener('click', () => {
        window.open("Still working on guide", '_blank');
    });

    document.getElementById("download-datapack").addEventListener('click', () => {
                // Testing
                $.getJSON("./datapacks/av-of-night-city/desc.json", function (D) {
                    console.log(D);
                });
        GitZip.zipRepo(selected_datapack);
    });
});

function openDatapack(location) {
    selected_datapack = location;
    $.getJSON(location + "/desc.json", function (desc) {
        // Set title
        document.getElementById("modal-title").innerHTML = desc.name;
        document.getElementById("info-name").innerHTML = desc.name;
        // Set image
        document.getElementById("view-img-src").src = location + "/thumbnail.jpg";
        // Set description
        document.getElementById("info-desc").innerHTML = desc.desc;
        // Set changelog
        document.getElementById("info-changelog").innerHTML = "";
        if (desc.changelog) {
            for (i = 0; i < desc.changelog.length; i++) {
                document.getElementById("info-changelog").insertAdjacentHTML("beforeend", ` <p class="changelog-title">Version ${desc.changelog[i].version}</p><p class="changelog-title-underline"></p>
            <p class="changelog-body">${desc.changelog[i].desc.replaceAll("\n", "<br>")}</p>`);
            }
        } else {
            document.getElementById("info-changelog").innerHTML = "<br>&nbsp; No changelog found 🐱";
        }

        // Get the modal
        var modal = document.getElementById("datapackModal");
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        $('body').css("overflow", "hidden");

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
            $('body').css("overflow", "auto");
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
                modal.classList.remove("modal-open");
                $('body').css("overflow", "auto");
            }
        }
    });
}

Object.defineProperty(String.prototype, 'capitalize', {
    value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}