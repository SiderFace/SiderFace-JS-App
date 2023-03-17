let pokemonRepository = (function () {
   let pokemonList = [];

   // External api source for pokemon data
   let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=350';

   function add(pokemon) {
      pokemonList.push(pokemon);
   }

   // Establish what the getAll function will do
   function getAll() {
      return pokemonList;
   }

   // Create buttons on a list in the HTML containers
   function addListItem(pokemon) {
      let pokemonList = document.querySelector('.pokemon-list .row');
      let listPokemon = document.createElement('div');
      listPokemon.classList.add('col-md-2' , 'mb-1');
      let button = document.createElement('button');
      button.innerText = pokemon.name;
      button.classList.add('btn-block');
      button.classList.add('btn-primary');
      button.classList.add('button-pokemon');
      button.setAttribute('data-toggle' , 'modal');
      button.setAttribute('data-target', '#pokemonModal');
      listPokemon.appendChild(button);
      pokemonList.appendChild(listPokemon);

   // Event listener to showDetails when clicked
      button.addEventListener('click' , function () {
         pokemonRepository.showDetails(pokemon);
      });
   }

   // Pull the data from loadDetails and loadList functions and set how and where they will be displayed
   function showDetails(pokemon) {
      pokemonRepository.loadDetails(pokemon).then(function () {
        showModal(pokemon);
      });
    }
     
   //Modal popup when each Pokemon button is clicked
   function showModal(pokemon) {
      let modalTitle = document.querySelector('.modal-title');
      let modalBody = document.querySelector('.modal-body');

      modalTitle.innerHTML = '<h1>' + pokemon.name + '</h1>';
      modalBody.innerHTML = '<img class="modal-img" style="width:50%" src="' + pokemon.imageUrl + '">'
                           + '<p>Height : ' + pokemon.height + '</p>';

      modalBody.classList.add('text-center');
   }

   // Message to inform user that the list is loading
   function showLoadingMessage() {
      let message = document.createElement('p');
      message.innerText = 'That\'s a lot of Pokemon! Please be patient while we catch \'em all for you ^-^ ';
      document.body.appendChild(message);
   }
   function hideLoadingMessage() {
      let message = document.querySelector('p');
      document.body.removeChild(message);
   }
    
   // Fetch the list from external api database
   function loadList() {
      showLoadingMessage();
      return fetch(apiUrl).then(function (response) {
         return response.json();
      }).then(function (json) {
         json.results.forEach(function (item) {
            let pokemon = {
               name: item.name,
               detailsUrl: item.url
            };
            add(pokemon);
         });
      }).catch(function (e) {
         hideLoadingMessage();
         console.error(e);
      })
   }

   //fetch the pokemon details to be applied to each pokemon list item
   function loadDetails(pokemon) {
      let url = pokemon.detailsUrl;
      return fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(function (details) {
          pokemon.imageUrl = details.sprites.front_default;
          pokemon.height = details.height;
          pokemon.types = details.types;
          return pokemon; 
        })
        .catch(function (e) {
          console.error(e);
        });
    }

    //TO LEARN:   I don't have a good enough comprehension on why the return is written the way that it is
   return {
      add,
      getAll,
      addListItem,
      loadList,
      loadDetails,
      showDetails,
      showModal,
   };
})();

   //TO LEARN:   I've gotten lost in some of the repeated concepts and dont understand why this these functions need to be fire here
   pokemonRepository.loadList().then(function () {
      pokemonRepository.getAll().forEach(function (pokemon) {
         pokemonRepository.addListItem(pokemon);
      });
   });