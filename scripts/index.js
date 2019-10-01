const routes = {
  home: "/",
  tvs: "/tv",
  films: "/films "
};
const urls = {
  tvsRated:
    "https://api.themoviedb.org/3/tv/top_rated?api_key=89c7d7d9e7a3de86e27a4d871fb88384&language=en-US&page=",
  filmsTop:
    "https://api.themoviedb.org/3/movie/popular?api_key=89c7d7d9e7a3de86e27a4d871fb88384&language=en-US&page=",
  tvsTop:
    "https://api.themoviedb.org/3/tv/popular?api_key=89c7d7d9e7a3de86e27a4d871fb88384&language=en-US&page="
};
// Популярні
function loadTop(url, page = 1) {
  return fetch(url + page)
    .then(res => {
      return res.json();
    })
    .then(res => {
      const main = res.results.reduce(function(agr, current) {
        return (agr += `<div class="column col-2 " onclick="more(${
          current.id
        })">
        
        <img  src="https://image.tmdb.org/t/p/w200/${current.poster_path}" />
       <h2> ${current.name || current.title}</h2>
       <hr/>
       <p>${current.overview.slice(0, 150)} ...</p>
      
       </div>`);
      }, "");
      return { main: main, pages: res.total_pages };
    });
}
// Деталі фільма
function loadDetails(id) {
  return fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=89c7d7d9e7a3de86e27a4d871fb88384&language=en-US`
  )
    .then(res => res.json())
    .then(res => {
      const seasons = res.seasons.reduce((agr, current) => {
        return (agr += `<div class="row season" onclick="seariasModal(${
          current.season_number
        },${id})" >
         
            <div class='row' >
              <h4 >${current.season_number} ${current.name}</h4>
            </div>
           
          
        </div>`);
      }, "");
      let main = `
      <div class='column col-3'>
      <img  src="https://image.tmdb.org/t/p/w200/${res.poster_path}" />
      <p>Status:${res.status}</p>
      <p>Type:${res.type}</p>
      <h3>Vote:${res.vote_average}</h3>
      <p>Vote Count:${res.vote_count}</p>
      </div>
      <div class='column col-6'>
      <h2> ${res.name || res.title}</h2>
      <p><b>Overview:</b>${res.overview} </p>
      <p><b>Number of Seasons:</b>${res.number_of_seasons}</p>
      <p><b>Number of Series:</b>${res.number_of_episodes}</p>
      <hr/>
      <h3 >List of Seasons</h3>
      <div class='container'>
        
        ${seasons}
        
        </div>
     </div>
     
      `;

      return main;
    });
}

function more(id) {
  window.location.replace(window.location.origin + "#/details/" + id);
}
// Модалка з серіями та інфо по сезону
function seariasModal(season, film) {
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  let content = document.getElementById("modalContent");
  let eps = document.getElementById("modalEpisodes");
  eps.innerHTML = "";
  content.innerHTML = "";
  const url = `https://api.themoviedb.org/3/tv/${film}/season/${season}`;
  fetch(url + "?api_key=89c7d7d9e7a3de86e27a4d871fb88384&language=en-US")
    .then(res => res.json())
    .then(res => {
      content.innerHTML += `<div class='row'>
      <div class='column col-6'>
      <img src="https://image.tmdb.org/t/p/w200/${res.poster_path}" />
      </div>
      <div class='column col-6'>
      <p> Name: ${res.name} </p>
      <p> Overview:${res.overview} </p>
      <p> Air Date: ${res.air_date} </p>
      <p> Episodes Count: ${res.episodes.length} </p>
      </div>
    </div>`;
      eps.innerHTML += `<div class='row'>
    
       <h3>Episodes:</h3>
       
  </div>`;
      res.episodes.forEach(element => {
        eps.innerHTML += `<div class='row episodesCont' onclick="showOver(this,${season},${film},${
          element.episode_number
        })">
        <div class='column'>
           <p><b>${element.season_number}S ${element.episode_number}E</b> ${
          element.name
        }</p>
           <div class='episodOwer hide' id='ower' name='ower'>
             
           </div>
           </div>
      </div>`;
      });
    });

  modal.style.display = "block";
  span.onclick = function() {
    modal.style.display = "none";
  };
}
//Інфо Епізода
function showOver(el, season, film, episode) {
  const sp = el.children[0].children[1];
  if (sp.className.includes("hide")) {
    sp.className = "episodOwer";
    fetch(
      `https://api.themoviedb.org/3/tv/${film}/season/${season}/episode/${episode}?api_key=89c7d7d9e7a3de86e27a4d871fb88384&language=en-US`
    )
      .then(res => {
        return res.json();
      })
      .then(res => {
        sp.innerHTML = `<div class='container'>
        <div class='row'>
          <div class='column col-5'>
            <img src="https://image.tmdb.org/t/p/w200/${res.still_path}"/>
          </div>
          <div class='column col-5'>
            <h4>${res.name}</h4>
            <p>${res.air_date}</p>
            <p><b>Owerview:</b>${res.overview}</p>
            <p>Vote average:${res.vote_average}</p>
          </div>
        </div>
      </div>`;
      });
  } else {
    sp.className = "episodOwer hide";
    sp.innerHTML = "";
  }
}
//Примітивний пошук
function search(e) {
  const searchBox = document.getElementById("search");
  const searchRes = document.getElementById("search-res");
  if (searchBox.value === "") {
    alert("Empty search box");
  } else {
    searchRes.innerHTML = "";
    fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=89c7d7d9e7a3de86e27a4d871fb88384&language=en-US&query=${
        searchBox.value
      }&page=1`
    )
      .then(res => res.json())
      .then(res => {
        searchRes.innerHTML += ` 
        <div class='container'>
        <div class='row'><h4>Total Results ${res.total_results}</h4></div>
        <div class='row'>
      `;
        res.results.forEach(element => {
          searchRes.innerHTML += `<a href='/#/details/${
            element.id
          }'class='column col-3'">
        ${element.name}
        </a>`;
        });
        searchRes.innerHTML += "</div></div>";
      });
  }
}

// Головний роутер
function router(url) {
  const el = document.getElementById("main");
  var pathArray = url.hash.split("/");

  switch (pathArray[1]) {
    case "tv":
      loadTop(urls.tvsTop).then(res => {
        el.innerHTML = res.main;
      });

      break;
    case "tv-top":
      window.scrollTo(0, 0);
      loadTop(urls.tvsRated, pathArray[2] || 1).then(res => {
        el.innerHTML = res.main;

        var newEl = document.createElement("div");
        newEl.className = "container row";

        for (let i = 1; i <= res.pages; i++) {
          if (i == pathArray[2]) {
            newEl.innerHTML += `<a class=" column active">${i}</a>`;
          } else {
            newEl.innerHTML += `<a class="column" href="#/tv-top/${i}">${i}</a>`;
          }
        }
        el.append(newEl);
      });

      break;

    case "details":
      loadDetails(pathArray[2]).then(res => {
        el.innerHTML = res;
      });
      break;
    default:
      el.innerHTML = `<div class="container">
      <div class='row'>
        <h2>Here you can search some Tv's or go check some Top rated and Popular one's</h2>
      </div>
      <div class="row">

        <div class="column  search">
          <input type="text" placeholder="Enter to search..." id="search" />
          <button onclick='search(this)'>Search</button>
        </div>
      </div>
      <div class='row' id='search-res'></div>
    </div>`;
      break;
  }
}
// Підписка на івенти
window.addEventListener("hashchange", () => {
  router(document.location);
});
window.addEventListener("load", function() {
  router(document.location);

  var modal = document.getElementById("myModal");
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});
