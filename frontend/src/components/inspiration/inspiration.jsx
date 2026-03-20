import React, { useState } from 'react'
import './inspiration.css'


const destinations = [
    { id: 1, name: 'London', country: 'United Kingdom', image: 'london.jpg', description: 'London is a huge city that somehow never feels boring. Big Ben, Tower Bridge and Buckingham Palace are all worth seeing but honestly just wandering around the different neighbourhoods is the best part. Great food, great museums and always something going on.' },
    { id: 2, name: 'Paris', country: 'France', image: 'paris.jpg', description: 'Paris is honestly one of the best cities in Europe. Sure the Eiffel Tower is touristy but its still worth seeing. The cafes, the food and just walking around the streets make it special. One of those places you just have to visit at least once.' },
    { id: 3, name: 'Stockholm', country: 'Sweden', image: 'stockholm.jpg', description: 'Stockholm is built on 14 islands which makes it unlike most other cities. Gamla Stan has super narrow streets and colorful buildings that are really cool to walk around in. Clean, safe and easy to get around.' },
    { id: 4, name: 'Gothenburg', country: 'Sweden', image: 'göteborg.jpg', description: 'Gothenburg is way more chill than Stockholm and thats honestly a good thing. The food scene is great, especially the seafood down by the harbour. Liseberg is fun if youre into that kind of thing. Just a really easy city to like.' },
    { id: 5, name: 'Oslo', country: 'Norway', image: 'oslo.jpg', description: 'Oslo is a cool city if youre into both nature and architecture. The Opera House is wild, you can literally walk up on the roof. Not the cheapest city but definitely worth the trip. Aker Brygge is a great spot just to walk around.' },
    { id: 6, name: 'Örebro', country: 'Sweden', image: 'Örebro.jpg', description: 'Örebro is such an underrated city and more people should know about it! The castle right in the middle of the river looks incredible especially at sunset. Young and lively with lots of good restaurants and cafés.' },
    { id: 7, name: 'Copenhagen', country: 'Denmark', image: 'copenhagen.jpg', description: 'Copenhagen is just a really fun city to visit! The colourful houses along Nyhavn are even better in real life than in photos. The food scene is amazing and Tivoli is worth a visit even if youre not usually into amusement parks.' },
    { id: 9, name: 'Berlin', country: 'Germany', image: 'berlin.jpg', description: 'Berlin is unlike any other city in Europe and thats what makes it so cool. History is everywhere you look, from the Brandenburg Gate to the remains of the Wall. Just walking around the different neighbourhoods is enough to keep you busy for days.' },
    { id: 10, name: 'Helsinki', country: 'Finland', image: 'helsinki.jpg', description: 'Helsinki is a small capital but it punches above its weight. The cathedral, the market square and the Suomenlinna island fortress are all great. Its a very clean and calm city with a really unique Nordic feel.' },
    { id: 11, name: 'Prague', country: 'Czech Republic', image: 'prag.jpg', description: 'Prague looks like something out of a fairy tale, the old town is genuinely stunning. Prague Castle and Charles Bridge are must sees. Its also one of the more affordable cities in Europe which is always a bonus.' },
    { id: 12, name: 'Malmö', country: 'Sweden', image: 'malmö.jpg', description: 'Malmö is right across the bridge from Copenhagen so its easy to combine both cities. Its got a really multicultural food scene and the Turning Torso is hard to miss. A underrated city that deserves more attention.' },
    { id: 13, name: 'Borås', country: 'Sweden', image: 'Borås.jpg', description: 'Borås is a chill Swedish city known for its street art and the popular Borås Zoo. Not the most obvious tourist destination but worth a visit if youre in the area. Relaxed atmosphere and friendly people.' },
    { id: 14, name: 'Eskilstuna', country: 'Sweden', image: 'Eskillstuna.jpg', description: 'Eskilstuna has a cool industrial history and Parken Zoo is one of the best zoos in Sweden. Its a working class city with a lot of character and some really good local spots to eat and hang out.' },
    { id: 15, name: 'Falun', country: 'Sweden', image: 'Falun.jpg', description: 'Falun is famous for its copper mine which is a UNESCO World Heritage Site and genuinely interesting to visit. The surrounding Dalarna nature is beautiful and the iconic red Falun paint actually comes from here.' },
    { id: 16, name: 'Gävle', country: 'Sweden', image: 'Gävle.jpg', description: 'Gävle is best known for its giant Christmas goat that people try to burn down every year. But beyond that its a nice city with a historic old town and easy access to forests and nature. Worth a stop.' },
    { id: 17, name: 'Halmstad', country: 'Sweden', image: 'Halmstad.jpg', description: 'Halmstad is the place to be in summer on the Swedish west coast. Tylösand beach is great and the city centre has a nice vibe. The medieval castle is also worth checking out while youre there.' },
    { id: 18, name: 'Jönköping', country: 'Sweden', image: 'Jönköping.jpg', description: 'Jönköping sits right at the tip of Lake Vättern and the views are honestly beautiful. Its a young city with a big university and a lively atmosphere. The match factory history is also pretty interesting.' },
    { id: 19, name: 'Kalmar', country: 'Sweden', image: 'kalmar.jpg', description: 'Kalmar has one of the best preserved castles in Sweden, its right by the water and looks amazing. The city is small but charming and Öland island is just a bridge away. A great weekend destination.' },
    { id: 20, name: 'Karlskrona', country: 'Sweden', image: 'karlskrona.jpg', description: 'Karlskrona is built on a bunch of islands in the Baltic Sea which gives it a really unique feel. The old naval architecture is UNESCO listed and the archipelago around it is stunning. Not many tourists know about it which makes it even better.' },
    { id: 21, name: 'Karlstad', country: 'Sweden', image: 'Karlstad.jpg', description: 'Karlstad is known as the sunshine city of Sweden and it really lives up to it. Right on Lake Vänern with a friendly atmosphere and lots of outdoor activities. A great city if you want to slow down a bit.' },
    { id: 22, name: 'Kiruna', country: 'Sweden', image: 'Kiruna.jpg', description: 'Kiruna is way up above the Arctic Circle and it feels like another world. The ICEHOTEL is incredible, the Northern Lights are something else and in summer you get the Midnight Sun. A bucket list destination for sure.' },
    { id: 23, name: 'Kristianstad', country: 'Sweden', image: 'Krisianstad.jpg', description: 'Kristianstad is a pretty historic city in southern Sweden with some really nice renaissance buildings. The wetlands nature reserve nearby is great for birdwatching and the Hanö island is a hidden gem.' },
    { id: 24, name: 'Linköping', country: 'Sweden', image: 'Linköping.jpg', description: 'Linköping is a lively university city with a beautiful medieval cathedral. Gamla Linköping is an open air museum that is genuinely cool to walk around. Also known as a big hub for tech and aerospace in Sweden.' },
    { id: 25, name: 'Luleå', country: 'Sweden', image: 'Luleå.jpg', description: 'Luleå is up in northern Sweden on the Gulf of Bothnia and has a beautiful archipelago. In winter you can go ice fishing or dog sledding which is pretty unique. The Gammelstad church town is UNESCO listed and worth a visit.' },
    { id: 26, name: 'Lund', country: 'Sweden', image: 'Lund.jpg', description: 'Lund is one of the oldest cities in Scandinavia and it really shows. The Romanesque cathedral is stunning and the whole city has a really charming historic atmosphere. Its a university city so always lively.' },
    { id: 27, name: 'Mora', country: 'Sweden', image: 'Mora.jpg', description: 'Mora is a cosy little city on Lake Siljan in the heart of Dalarna. Its home to the famous Vasaloppet ski race and the Zorn Museum is surprisingly good. A perfect base for exploring the beautiful Dalarna region.' },
    { id: 28, name: 'Narvik', country: 'Norway', image: 'Narvik.jpg', description: 'Narvik is a dramatic Norwegian city surrounded by fjords and mountains. The WWII history here is heavy and really interesting. The skiing at Narvikfjellet is world class and the scenery is hard to beat.' },
    { id: 29, name: 'Norrköping', country: 'Sweden', image: 'Norrköping.jpg', description: 'Norrköping has totally reinvented itself from an old industrial city into a creative and cultural hub. The old factories along the river are now museums, restaurants and art spaces. Really cool atmosphere.' },
    { id: 31, name: 'Skövde', country: 'Sweden', image: 'skövde.jpg', description: 'Skövde is a growing city in the middle of Sweden with a big university and a surprising gaming industry. Lake Vättern is close by and Billingen offers great nature just outside the city. More to it than you might think.' },
    { id: 32, name: 'Strömstad', country: 'Sweden', image: 'strömstad.jpg', description: 'Strömstad is a classic Swedish west coast summer city. The archipelago is beautiful, the seafood is fresh and it gets really lively in summer. Close to the Norwegian border so easy to combine with a trip to Norway.' },
    { id: 33, name: 'Sundsvall', country: 'Sweden', image: 'sundsvall.jpg', description: 'Sundsvall is called the Stone City because of its unique 19th century stone buildings in the city centre. The view from Norra Berget hill over the city and coast is great. A bit underrated but worth a visit.' },
    { id: 34, name: 'Trollhättan', country: 'Sweden', image: 'Trollhättan.jpg', description: 'Trollhättan has the most dramatic waterfalls in Sweden and they are genuinely impressive when they open the locks. Its also known as Trollywood because a lot of Swedish films are made here. An interesting mix of nature and culture.' },
    { id: 35, name: 'Uddevalla', country: 'Sweden', image: 'Udervalla.jpg', description: 'Uddevalla is a west coast city surrounded by beautiful fjords and islands. Great for outdoor activities and fresh seafood. Its a relaxed and friendly city that doesnt get as much attention as it deserves.' },
    { id: 36, name: 'Umeå', country: 'Sweden', image: 'umeå.jpg', description: 'Umeå is a vibrant university city in northern Sweden full of young people and energy. The birch trees everywhere give it a really distinctive look. Great music and arts scene and a surprisingly lively city for being so far north.' },
    { id: 37, name: 'Uppsala', country: 'Sweden', image: 'uppsala.jpg', description: 'Uppsala is just a short train ride from Stockholm and totally worth it. The cathedral is the biggest in Scandinavia and the university atmosphere gives the whole city a really nice energy. Viking burial mounds are just outside the city too.' },
    { id: 38, name: 'Västerås', country: 'Sweden', image: 'västerås.jpg', description: 'Västerås is right on Lake Mälaren with a really nice waterfront area. The cathedral is beautiful and there is a lot of Viking history in the area. A solid Swedish city that is easy to visit from Stockholm.' },
    { id: 39, name: 'Visby', country: 'Sweden', image: 'visby.jpg', description: 'Visby on Gotland island is one of the most unique places in Sweden. The medieval city walls, the ruins and the roses everywhere make it feel like stepping back in time. Summer is the best time to go but it gets busy.' },
    { id: 40, name: 'Växjö', country: 'Sweden', image: 'växjö.jpg', description: 'Växjö calls itself the Greenest City in Europe and takes it seriously. Surrounded by lakes and forests with a really strong glass making tradition in the region. A calm and pleasant city with a lot of Swedish charm.' },
    { id: 41, name: 'Östersund', country: 'Sweden', image: 'östersund.jpg', description: 'Östersund is right in the middle of Sweden on a beautiful lake. Locals swear there is a monster in the lake called Storsjöodjuret. Great for winter sports and the mountain scenery around the city is stunning.' },
    { id: 43, name: 'Alvesta', country: 'Sweden', image: 'Alvesta.jpg', description: 'Alvesta is a small town in Småland that most people pass through on the train. But the surrounding lakes and forests are really beautiful and it makes a good base for exploring the region. A quiet and pleasant place.' },
    { id: 44, name: 'Bromma', country: 'Sweden', image: 'Bromma.jpg', description: 'Bromma is basically part of Stockholm with its own airport which makes it super convenient. Its a green and leafy area with a more relaxed feel than the city centre. Good if you want to be close to Stockholm without being right in the middle of it.' },
]



function Inspiration() {
    //vilken destination som är öppnad
    const [selected, setSelected] = useState(null);
    // vad användaren skriver i sökfältet
    const [search, setSearch] = useState('');

    // filtrera destinationer baserat på söktext
    const filtered = destinations.filter(dest =>
        dest.name.toLowerCase().includes(search.toLowerCase()) ||
        dest.country.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="inspiration-wrapper">

            {/* sökfält */}
            <div className="search-bar-container">
                <div className="search-bar">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    {/* uppdaterar search-state när användaren skriver */}
                    <input
                        type="text"
                        placeholder="Search destinations"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="search-input"
                    />
                    {/* tabort knapp */}
                    {search && (
                        <button className="search-clear" onClick={() => setSearch('')}>✕</button>
                    )}
                </div>
            </div>

            {/* kommer om sökning inte finns */}
            {filtered.length === 0 && (
                <p className="no-results">No destinations found for "{search}"</p>
            )}

             {/* loopar igenom alla destinationer och skapar ett kort för varje */}
            <div className="destinations-grid">
                {filtered.map(dest => (
                    <div key={dest.id} className="dest-card" onClick={() => setSelected(dest)}>
                        <div className="dest-image" style={{ backgroundImage: `url(${dest.image})` }} />
                        <div className="dest-info">
                            <div>
                                <h3 className="dest-name">{dest.name}</h3>
                                <p className="dest-country">{dest.country}</p>
                            </div>
                             {/* visar första 80 tecknen av beskrivningen */}
                            <p className="dest-preview">{dest.description.slice(0, 80)}...</p>
                            <span className="dest-readmore">Read more →</span>
                        </div>
                    </div>
                ))}
            </div>

           {/* popup visas när man klickar på ett kort */}

            {selected && (
                  // klick på bakgrunden stänger popupen
                <div className="modal-backdrop" onClick={() => setSelected(null)}>
                    <div
                        className="modal-card"
                        style={{ backgroundImage: `url(${selected.image})` }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* stäng-knapp sätter selected till null */}
                        <button className="modal-close-x" onClick={() => setSelected(null)}>✕</button>
                        <div className="modal-body">
                            <h2 className="modal-title">{selected.name}</h2>
                            <p className="modal-description">{selected.description}</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Inspiration