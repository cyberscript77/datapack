// Set the latest selected datapack to this variable, it will be useful for download button.
var selected_datapack = "";

// Start this when page loaded.
$(document).ready(function () {

    // Start reading the registry.json
    $.getJSON("registry.json").then(async function (datapack_list) {

        // Looping through all the objects in registry.json
        for (var i = 0; i < datapack_list.length; i++) {

            // If first two elements in registry, then feature them.
            var featured = false;
            if (i == 0 || i == 1) featured = true;

            // Assign datapack name from the loop. [To make it easy to read].
            var datapack_name = datapack_list[i];

            // Get name, description and image from meta folder.
            await $.getJSON("meta/" + datapack_name + ".json", function (data) {

                // Append elements to the DOM.
                document.getElementsByClassName(`${featured ? "featured-container" : "container"}`)[0].insertAdjacentHTML("beforeend",
                    `<div class="card ${featured ? "featured" : ""} ${featured && i == 1 ? "next" : ""}" onclick="openDatapack('${datapack_name}', '${encodeURIComponent(JSON.stringify(data))}',);"><img src="${"meta/" + datapack_name + ".jpg"}" />
                             <h2>${data.name}</h2>
                             <p>${data.desc}</p><br>
                             <p class="author">▣ Author: ${data.author}</p> ${data.branch == "beta" || data.branch == "alpha" ? `<div class="tag">${data.branch.capitalize()}</div>` : ""}
                             </div>`);
            });
        }
    });

    // Guide on how to install datapack (Will open new )
    document.getElementById("how-to-install-datapack").addEventListener('click', () => {
        // Open a new window (tab)
        window.open("Still working on guide", '_blank');
    });

    // This listener will be called when download button is clicked.
    document.getElementById("download-datapack").addEventListener('click', () => {
        // Download the 
        window.location.assign(`https://raw.githubusercontent.com/cyberscript77/datapack/main/datapacks/${selected_datapack}.zip`);
    });
});


// This function will be called to open datapack
function openDatapack(datapack_name, data) {

    // Set the global selected_datapack name
    selected_datapack = datapack_name;

    // Parse JSON
    var desc = JSON.parse(decodeURIComponent(data))

    // Set title
    document.getElementById("modal-title").innerHTML = desc.name;
    document.getElementById("info-name").innerHTML = desc.name;
    // Set image
    document.getElementById("view-img-src").src = "meta/" + datapack_name + ".jpg";
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
        document.getElementById("info-changelog").innerHTML = "<br>&nbsp; No changelog found 🐱<br><br>";
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
}

// Capitalize prototye
Object.defineProperty(String.prototype, 'capitalize', {
    value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});