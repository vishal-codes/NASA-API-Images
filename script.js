//jshint esversion:8
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');
const noFavorites = document.querySelector('.noFavorites');
var flag = 0;

// NASA Images API
const apiKey = 'DEMO_KEY';
const count = 6;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};      //favorites object

// Scroll To Top, Remove Loader, Show Content
function showContent(page) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    loader.classList.add('hidden');
    if (page === 'results') {
      resultsNav.classList.remove('hidden');
      favoritesNav.classList.add('hidden');
    } else {
      resultsNav.classList.add('hidden');
      favoritesNav.classList.remove('hidden');
    }
  }
  
function createDOMNodes(page){
    if(page === 'favorites'  && Object.keys(favorites).length === 0){
        noFavorites.classList.remove('hidden');
    }else{
        noFavorites.classList.add('hidden');
    }
    const currentArray = page === 'results' ? resultsArray :Object.values(favorites);
    
    currentArray.forEach((result) => {
        
        //card container
        const card = document.createElement('div');
        card.classList.add('card');

        //link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';

        //image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');

        //card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        //card title 
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        //save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add to Favorites';
            saveText.setAttribute('onclick' , `saveFavorite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove from Favorites';
            saveText.setAttribute('onclick' , `removeFavorite('${result.url}')`);
        }

        //card text
        var cardText = document.createElement('p');
        cardText.textContent = result.explanation; 
        var str = " ";   
        str = JSON.stringify(result.explanation);
        if(str.includes("digg_url")){
            flag = 1;
            console.log("true");
            console.log(str);
            str = str.slice(0,-77);
            cardText = str.substring(1);
            console.log(cardText);
        }

        //break;
        const newLine = document.createElement('br');
        const newLine1 = document.createElement('br');

        //footer container
        const footer = document.createElement('small');

        //date
        const date = document.createElement('strong');
        date.textContent = result.date;

        //copyright
        const copyrightResult = result.copyright === undefined ?'' : '  ©'+result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = `${copyrightResult}`;

        //append
        footer.append(date , copyright);
        if (flag==1) {
            flag = 0;
            cardBody.append(cardTitle,saveText,cardText,newLine,newLine1,footer);
        } else {
            cardBody.append(cardTitle,saveText,cardText,footer);
        }
        link.appendChild(image);
        card.append(link,cardBody);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page){
    //get favorites from localstorage
    if (localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

//getting 6 images from api, display loader
async function getNasaImages(){
    mybutton.style.display = "none";
    loader.classList.remove('hidden');
    try {   
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    } catch (error) {
         console.log('error');
    }
}
//add result to favorites
function saveFavorite(itemUrl){
    
    //loop through results array to select favorite
    resultsArray.forEach(item => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            
            //show save conformation
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            },2000);

            // save favorites in local storage
            localStorage.setItem('nasaFavorites' , JSON.stringify(favorites));
        }
    });

}

//remove from favorites
function removeFavorite(itemUrl){
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // save favorites i.e. update the local storage
        localStorage.setItem('nasaFavorites' , JSON.stringify(favorites));
        updateDOM(favorites);
    } 
}


// THEME TOGGLE
const theme_img = document.getElementById("theme-img");
const toggleSwitch = document.getElementById("toggle-check");

//Switch Theme
function switchTheme(event){
   if(event.target.checked){
       document.documentElement.setAttribute('data-theme' , 'dark');
       localStorage.setItem('theme' , 'dark');
       theme_img.src = 'moon.svg';
   }else{
    document.documentElement.setAttribute('data-theme' , 'light');
    localStorage.setItem('theme' , 'light');
    theme_img.src = 'sun.svg';
   }
}
//Event listener
toggleSwitch.addEventListener('change' , switchTheme);

//Check Local Storage for theme
const currentTheme = localStorage.getItem('theme');
if(currentTheme){
    document.documentElement.setAttribute('data-theme' , currentTheme);
    if(currentTheme === 'dark'){
        toggleSwitch.checked = true;
        theme_img.src = 'moon.svg';
    }
}


// GO TO TOP BUTTON
//Get the button:
const mybutton = document.getElementById("myBtn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
  if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
};
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


getNasaImages();