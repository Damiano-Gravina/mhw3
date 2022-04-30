const spotifyClientId = '63e1a84694c2446dbdf3b1a8dc01d231';
const spotifyClientSecret = '99dc3f1bf67747ce8c13653829fc6d8a';


const albumList=["Nevermind","Revolver", "Rubber Soul", "The+Doors", "The+Dark+Side+of+the+Moon", "Are+You+Experienced", "Led+Zeppelin", "Wheels+of+Fire", "Wish+You+Were+Here", " Pink+Moon", "Thriller", "Appetite+for+Destruction", "Hotel+California"];


const SpotifyURL= "https://api.spotify.com/v1/search?type=album&q="
const wikipediaURL= "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=1&exchars=1500&gsrsearch="


const guitarNames=["Stratocaster+guitar","Les+Paul+guitar", "Fender+Telecaster+guitar", "Gibson+335+guitar", "ibanez+rg+guitar"]
const idName=["#stratocaster", "#lesPaul", "#telecaster", "#gibson335", "#rg"]
const lastWord=["The", "Due", "Although", "Origins", "Origin"]
let wikipediaIndex2=0;


function randAlbumName(){
    let i = Math.floor(Math.random() * (albumList.length));
    return albumList[i];
}


function onTokenJson(json)
{
  console.log(json)
  apiToken = json.access_token;
}


function onTokenResponse(response)
{
  return response.json();
}


function tokenRequest(){
    fetch("https://accounts.spotify.com/api/token",
	{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(spotifyClientId + ':' + spotifyClientSecret)
   }
  }
  ).then(onTokenResponse).then(onTokenJson);
}


function onWikipediaJson(json){
    const page=json.query.pages
    const pageId = Object.keys(page)[0];
    const html = page[pageId].extract; 
    const textEnd=html.lastIndexOf(lastWord[wikipediaIndex2])
    const html2 = html.slice(0,textEnd)
    const p3=document.querySelector(idName[wikipediaIndex2])
    p3.innerHTML=html2
    wikipediaIndex2++
 }


function onSpotifyJson(json){

    console.log(json);
    const view = document.querySelector("#api1");
    view.innerHTML='';
    const albumVector=json.albums.items;
    let numAlbum=albumVector.length;

    if(numAlbum>10){
        numAlbum=10;
    }
    for(let index=0; index<numAlbum; index++){
        const image = document.createElement('img');
        const albumImage = albumVector[index].images[0].url;
        image.src = albumImage;
        const box = document.createElement('div');
        box.appendChild(image);
        view.appendChild(box);
    }
}


function onFail(error){
    console.log("Error: " + error);
}


function onSuccess(response){
    return response.json();
}


function generaAlbum(){
let selectedAlbum=randAlbumName();
let URL=SpotifyURL+selectedAlbum;
fetch(URL,
    {
    headers:
    {
      'Authorization': 'Bearer ' + apiToken
    }
  }).then(onSuccess, onFail).then(onSpotifyJson, onFail);
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }


let apiToken=0;
tokenRequest();
const button=document.querySelector('button');
setTimeout(generaAlbum, 2500)
button.addEventListener("click", generaAlbum);



for(wikipediaIndex1=0; wikipediaIndex1<guitarNames.length; wikipediaIndex1++){
const completeURL= wikipediaURL+guitarNames[wikipediaIndex1]
fetch(completeURL).then(onSuccess, onFail).then(onWikipediaJson, onFail)
sleep(500)
}