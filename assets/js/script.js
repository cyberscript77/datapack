// Set the latest selected datapack to this variable, it will be useful for download button.
var selected_datapack = "";

// Start this when page loaded.
$(document).ready(function () {


	$(document).keydown(function(event) { 
	  if (event.keyCode == 27) { 
	    var modal = document.getElementById("datapackModal");
	     modal.style.display = "none";
        $('body').css("overflow", "auto");
	  }
	});
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

                // Splide list holder
                var splide_list = `<li class="splide__slide"><img class="image_zoom" src = "${"meta/" + datapack_name + ".jpg"}"></li>`

                // Splide init
                if (data.slideshow && data.slideshow.length > 0) {
                    for (j = 0; j < data.slideshow.length; j++) {
                        splide_list += `<li class="splide__slide"><img class="image_zoom" src = "${"slideshow/" + datapack_name + "/" + data.slideshow[j]}"></li>`
                    }
                }

                // Append elements to the DOM.
                document.getElementsByClassName(`${featured ? "featured-container" : "container"}`)[0].insertAdjacentHTML("beforeend",
                    //        `<div class="card ${featured ? "featured" : ""} ${featured && i == 1 ? "next" : ""}" onclick="openDatapack('${datapack_name}', '${encodeURIComponent(JSON.stringify(data))}',);"><img src="${"meta/" + datapack_name + ".jpg"}" />
                    `<div class="card ${featured ? "featured" : ""} ${featured && i == 1 ? "next" : ""}" onclick="openDatapack('${datapack_name}', '${encodeURIComponent(JSON.stringify(data)).replace(/'/g, "%27")}',);"> <div class="splide" role="group" aria-label="Splide Basic HTML Example">
                     <div class="splide__track"><ul class="splide__list">${splide_list}</ul></div></div>              
                  
                    <h2>${data.name}</h2>
                    <p style="min-height:45px; max-height:45px; overflow: hidden;">${data.desc}</p><br>
                    <p class="author">▣ Author: ${data.author}</p> ${data.branch == "beta" || data.branch == "alpha" ? `<div class="tag">${data.branch.capitalize()}</div>` : ""}
                </div>`);
            });
        }

        // Splide
        var elms = document.getElementsByClassName('splide');
        for (var i = 0; i < elms.length; i++) {
            new Splide(elms[i], {
                pagination: false,
                autoplay: true,
                arrows: false,
                rewind: true
            }).mount();
        }
    });

    // Guide on how to install datapack (Will open new )
    document.getElementById("how-to-install-datapack").addEventListener('click', () => {
        // Open a new window (tab)
        alert("Installation documentation is in progress, Please look at the notice in the homepage");
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
    // Set description
    document.getElementById("info-desc").innerHTML = desc.desc.replaceAll("\n", "<br>");
	
    // Set changelog
    document.getElementById("info-changelog").innerHTML = "";
	document.getElementById("info-extra").innerHTML = "";
    if (desc.changelog) {
        for (i = 0; i < desc.changelog.length; i++) {
            document.getElementById("info-changelog").insertAdjacentHTML("beforeend", ` <p class="changelog-title">Version ${desc.changelog[i].version}</p><p class="changelog-title-underline"></p>
            <p class="changelog-body">${desc.changelog[i].desc.replaceAll("\n", "<br>")}</p>`);
        }
    } else {
        document.getElementById("info-changelog").innerHTML = "<br>&nbsp; No changelog found 🐱<br><br>";
    }
	
	if (desc.extranote) {
        document.getElementById("info-extra").insertAdjacentHTML("beforeend", ` <p class="extra-body">${desc.extranote.replaceAll("\n", "<br>")}</p>`);
    } else {
        document.getElementById("info-extra").innerHTML = "<br>&nbsp; No extra notes found 🐱<br><br>";
    }

    // Splide
    var splide_list = `<li class="splide__slide"><img src = "${"meta/" + datapack_name + ".jpg"}"></li>`
    var thumbnail_list = `<li class="thumbnail"><img width="120" height="70" src = "${"meta/" + datapack_name + ".jpg"}"></li>`
    if (desc.slideshow && desc.slideshow.length > 0) {
        for (j = 0; j < desc.slideshow.length; j++) {
            splide_list += `<li class="splide__slide"><img src = "${"slideshow/" + datapack_name + "/" + desc.slideshow[j]}"></li>`
            thumbnail_list += `<li class="thumbnail"><img width="120" height="70" src = "${"slideshow/" + datapack_name + "/" + desc.slideshow[j]}"></li>`
        }
    }

    // Splide init
    document.getElementById("datapack__image__list").innerHTML = splide_list;
    document.getElementById("thumbnails").innerHTML = thumbnail_list;
    var splide = new Splide('#datapack-carousel', {
        pagination: false,
        autoplay: true,
        rewind: true
    });

    var thumbnails = document.getElementsByClassName('thumbnail');
    var current;

    // Splide thumbnail initialization
    for (var i = 0; i < thumbnails.length; i++) {
        initThumbnail(thumbnails[i], i);
    }

    // The function to initialize each thumbnail.
    function initThumbnail(thumbnail, index) {
        thumbnail.addEventListener('click', function () {
            splide.go(index);
        });
    }
    
    splide.on( 'mounted move', function () {
        var thumbnail = thumbnails[ splide.index ];
      
        if ( thumbnail ) {
          if ( current ) {
            current.classList.remove( 'is-active' );
          }
      
          thumbnail.classList.add( 'is-active' );
          current = thumbnail;
        }
      } );
      
      splide.mount();



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